import fs from "node:fs";
import path from "node:path";
import {
  Kind,
  Source,
  buildClientSchema,
  parse,
  validate,
  type DefinitionNode,
  type DocumentNode,
  type FragmentDefinitionNode,
  type GraphQLSchema,
  type IntrospectionQuery,
  type OperationDefinitionNode,
} from "graphql";
import { costLimitRule } from "@escape.tech/graphql-armor-cost-limit";
import { maxDepthRule } from "@escape.tech/graphql-armor-max-depth";
import { maxAliasesRule } from "@escape.tech/graphql-armor-max-aliases";
import { maxDirectivesRule } from "@escape.tech/graphql-armor-max-directives";
import { MaxTokensParserWLexer } from "@escape.tech/graphql-armor-max-tokens";
import { BACKEND_LIMITS, CLIENT_LIMITS } from "../src/config/graphql-limits";

const ROOT = path.resolve(__dirname, "..", "src");
const GENERATED_FILE = path.resolve(__dirname, "..", "src", "types", "graphql.tsx");
const SCHEMA_FILE = path.resolve(__dirname, "..", "graphql.schema.json");

type Metric = "depth" | "aliases" | "directives" | "tokens" | "cost";

const fragments = new Map<string, FragmentDefinitionNode>();
const docs: { file: string; doc: DocumentNode }[] = [];

function walkDir(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const p = path.join(dir, entry.name);
    if (p === GENERATED_FILE) continue;
    if (entry.isDirectory()) walkDir(p, out);
    else if (/\.(ts|tsx|graphql)$/.test(entry.name)) out.push(p);
  }
  return out;
}

function extractGqlTemplates(source: string): string[] {
  const out: string[] = [];
  const re = /gql`([\s\S]*?)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    out.push(m[1].replace(/\$\{[^}]*\}/g, ""));
  }
  return out;
}

function loadSchema(): GraphQLSchema {
  const raw = JSON.parse(fs.readFileSync(SCHEMA_FILE, "utf8"));
  const introspection: IntrospectionQuery = raw.__schema ? raw : raw.data;
  return buildClientSchema(introspection);
}

function collectSpreadFragments(node: unknown, acc: Set<string> = new Set()): Set<string> {
  if (!node || typeof node !== "object") return acc;
  const obj = node as Record<string, unknown>;
  if (obj.kind === "FragmentSpread") {
    const name = ((obj.name as { value: string }) || { value: "" }).value;
    if (name && !acc.has(name)) {
      acc.add(name);
      const frag = fragments.get(name);
      if (frag) collectSpreadFragments(frag, acc);
    }
  }
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (Array.isArray(v)) v.forEach((x) => collectSpreadFragments(x, acc));
    else if (v && typeof v === "object" && (v as Record<string, unknown>).kind) {
      collectSpreadFragments(v, acc);
    }
  }
  return acc;
}

function buildSelfContainedDocument(op: OperationDefinitionNode): DocumentNode {
  const definitions: DefinitionNode[] = [op];
  for (const name of collectSpreadFragments(op)) {
    const frag = fragments.get(name);
    if (frag) definitions.push(frag);
  }
  return { kind: Kind.DOCUMENT, definitions };
}

interface Captured {
  depth: number;
  aliases: number;
  directives: number;
  cost: number;
}

function measureWithArmor(schema: GraphQLSchema, doc: DocumentNode): Captured {
  const captured: Captured = { depth: 0, aliases: 0, directives: 0, cost: 0 };
  const rules = [
    costLimitRule({
      maxCost: Number.MAX_SAFE_INTEGER,
      objectCost: BACKEND_LIMITS.costObjectCost,
      scalarCost: BACKEND_LIMITS.costScalarCost,
      depthCostFactor: BACKEND_LIMITS.costDepthCostFactor,
      propagateOnRejection: false,
      onAccept: [(_ctx, { n }) => (captured.cost = n)],
    }),
    maxDepthRule({
      n: Number.MAX_SAFE_INTEGER,
      propagateOnRejection: false,
      onAccept: [(_ctx, { n }) => (captured.depth = n)],
    }),
    maxAliasesRule({
      n: Number.MAX_SAFE_INTEGER,
      propagateOnRejection: false,
      onAccept: [(_ctx, { n }) => (captured.aliases = n)],
    }),
    maxDirectivesRule({
      n: Number.MAX_SAFE_INTEGER,
      propagateOnRejection: false,
      onAccept: [(_ctx, { n }) => (captured.directives = n)],
    }),
  ];
  validate(schema, doc, rules);
  return captured;
}

function measureTokens(doc: DocumentNode): number {
  // Armor's max-tokens plugin hooks the Parser; replicate by tokenizing printed output.
  const { print } = require("graphql") as typeof import("graphql");
  const source = new Source(print(doc));
  const parser = new MaxTokensParserWLexer(source, {
    n: Number.MAX_SAFE_INTEGER,
    propagateOnRejection: false,
  });
  parser.parseDocument();
  return parser.tokenCount;
}

function rel(p: string): string {
  return path.relative(path.resolve(__dirname, ".."), p);
}

function pct(value: number, limit: number): number {
  if (limit === 0) return 0;
  return (value / limit) * 100;
}

function bar(value: number, limit: number, width = 20): string {
  const filled = Math.min(width, Math.round((value / limit) * width));
  return `[${"#".repeat(filled)}${" ".repeat(width - filled)}]`;
}

function color(text: string, code: string): string {
  if (!process.stdout.isTTY) return text;
  return `\x1b[${code}m${text}\x1b[0m`;
}

const RED = "31";
const YELLOW = "33";
const GREEN = "32";
const DIM = "2";

function statusColor(p: number): string {
  if (p > 100) return RED;
  if (p >= 80) return YELLOW;
  return GREEN;
}

function statusLabel(value: number, limit: number): string {
  if (value > limit) return color("OVER", RED);
  if (value === limit) return color("AT", YELLOW);
  if (value / limit >= 0.8) return color("NEAR", YELLOW);
  return color("OK", GREEN);
}

// --- main ------------------------------------------------------------------

const schema = loadSchema();

const files = walkDir(ROOT);
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const templates = f.endsWith(".graphql") ? [src] : extractGqlTemplates(src);
  for (const text of templates) {
    let doc: DocumentNode;
    try {
      doc = parse(text);
    } catch {
      continue;
    }
    for (const d of doc.definitions) {
      if (d.kind === "FragmentDefinition") fragments.set(d.name.value, d);
    }
    docs.push({ file: f, doc });
  }
}

interface OperationRow {
  name: string;
  file: string;
  depth: number;
  aliases: number;
  directives: number;
  tokens: number;
  cost: number;
}

const opRows: OperationRow[] = [];

for (const { file, doc } of docs) {
  for (const d of doc.definitions) {
    if (d.kind !== "OperationDefinition") continue;
    const name = d.name?.value ?? "(anonymous)";
    const selfContained = buildSelfContainedDocument(d);
    try {
      const { depth, aliases, directives, cost } = measureWithArmor(schema, selfContained);
      const tokens = measureTokens(selfContained);
      opRows.push({
        name,
        file,
        depth,
        aliases,
        directives,
        tokens,
        cost: Math.round(cost),
      });
    } catch (err) {
      console.error(`failed to measure ${name} in ${rel(file)}:`, (err as Error).message);
    }
  }
}

type RowMeta = { label: string; metric: Metric; limit: number; backend: number };

const rows: RowMeta[] = [
  { label: "depth", metric: "depth", limit: CLIENT_LIMITS.maxDepth, backend: BACKEND_LIMITS.maxDepth },
  { label: "aliases", metric: "aliases", limit: CLIENT_LIMITS.maxAliases, backend: BACKEND_LIMITS.maxAliases },
  { label: "directives", metric: "directives", limit: CLIENT_LIMITS.maxDirectives, backend: BACKEND_LIMITS.maxDirectives },
  { label: "tokens", metric: "tokens", limit: CLIENT_LIMITS.maxTokens, backend: BACKEND_LIMITS.maxTokens },
  { label: "cost", metric: "cost", limit: CLIENT_LIMITS.maxCost, backend: BACKEND_LIMITS.maxCost },
];

console.log("");
console.log(color("GraphQL operation limits report", "1"));
console.log(
  color(
    `  scanned ${docs.length} documents, ${opRows.length} operations, ${fragments.size} fragments`,
    DIM,
  ),
);
console.log(color(`  measurement engine: @escape.tech/graphql-armor-* (parity with backend)`, DIM));
console.log("");

const LABEL_W = 11;
const NUM_W = 6;
const BAR_W = 20;

console.log(
  `  ${"metric".padEnd(LABEL_W)} ${"max".padStart(NUM_W)} / ${"limit".padStart(NUM_W)}  ${"usage".padStart(7)}  status  ${"chart".padEnd(BAR_W)}   top operation`,
);
console.log(color(`  ${"-".repeat(LABEL_W + NUM_W * 2 + BAR_W + 50)}`, DIM));

function maxOf(metric: Metric): { value: number; operation: string } {
  let best: { value: number; operation: string } = { value: 0, operation: "" };
  for (const op of opRows) {
    const v = op[metric];
    if (v > best.value) best = { value: v, operation: op.name };
  }
  return best;
}

let anyOver = false;
for (const row of rows) {
  const top = maxOf(row.metric);
  const value = top.value;
  const p = pct(value, row.limit);
  if (value > row.limit) anyOver = true;
  const c = statusColor(p);
  const usage = `${p.toFixed(1)}%`;
  const opName = top.operation || "—";
  console.log(
    `  ${row.label.padEnd(LABEL_W)}` +
      ` ${color(String(value).padStart(NUM_W), c)} / ${String(row.limit).padStart(NUM_W)}  ` +
      `${color(usage.padStart(7), c)}  ${statusLabel(value, row.limit).padEnd(14)} ` +
      `${color(bar(value, row.limit, BAR_W), c)}   ${opName}`,
  );
}

console.log("");
console.log(color("per operation (sorted by worst-metric usage):", "1"));

const CELL = 10;
const NAME_W = Math.max(12, ...opRows.map((r) => r.name.length));

function cell(value: number, limit: number): string {
  const p = limit > 0 ? value / limit : 0;
  const text = `${value}/${limit}`;
  const padded = text.padStart(CELL);
  if (value > limit) return color(padded, RED);
  if (value === limit) return color(padded, YELLOW);
  if (p >= 0.8) return color(padded, YELLOW);
  return padded;
}

function worstPct(op: OperationRow): number {
  return Math.max(
    op.depth / CLIENT_LIMITS.maxDepth,
    CLIENT_LIMITS.maxAliases ? op.aliases / CLIENT_LIMITS.maxAliases : 0,
    CLIENT_LIMITS.maxDirectives ? op.directives / CLIENT_LIMITS.maxDirectives : 0,
    op.tokens / CLIENT_LIMITS.maxTokens,
    op.cost / CLIENT_LIMITS.maxCost,
  );
}

opRows.sort((a, b) => worstPct(b) - worstPct(a) || b.cost - a.cost || a.name.localeCompare(b.name));

console.log(
  color(
    `  ${"operation".padEnd(NAME_W)}  ${"depth".padStart(CELL)}  ${"aliases".padStart(CELL)}  ${"directives".padStart(CELL)}  ${"tokens".padStart(CELL)}  ${"cost".padStart(CELL)}  file`,
    DIM,
  ),
);
for (const op of opRows) {
  console.log(
    `  ${op.name.padEnd(NAME_W)}  ${cell(op.depth, CLIENT_LIMITS.maxDepth)}  ${cell(op.aliases, CLIENT_LIMITS.maxAliases)}  ${cell(op.directives, CLIENT_LIMITS.maxDirectives)}  ${cell(op.tokens, CLIENT_LIMITS.maxTokens)}  ${cell(op.cost, CLIENT_LIMITS.maxCost)}  ${color(rel(op.file), DIM)}`,
  );
}
console.log("");
console.log(color("status legend: OK (< 80%) · NEAR (>= 80%) · AT (== limit) · OVER (> limit)", DIM));
console.log(
  color(
    "client limits are derived from backend (civicship-api Apollo Armor) with a safety buffer; backend values are the hard ceiling.",
    DIM,
  ),
);
console.log("");

if (anyOver) {
  console.log(color("FAIL: at least one metric exceeds the client limit.", RED));
  process.exit(1);
}
