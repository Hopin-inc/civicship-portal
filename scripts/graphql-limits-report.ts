import fs from "node:fs";
import path from "node:path";
import {
  parse,
  Source,
  Lexer,
  TokenKind,
  type DocumentNode,
  type FragmentDefinitionNode,
  type OperationDefinitionNode,
  type SelectionNode,
} from "graphql";
import { BACKEND_LIMITS, CLIENT_LIMITS } from "../src/config/graphql-limits";

const ROOT = path.resolve(__dirname, "..", "src");

type Metric = "depth" | "aliases" | "directives" | "tokens" | "cost";

interface Hit {
  metric: Metric;
  value: number;
  operation: string;
  file: string;
}

const hits: Record<Metric, Hit[]> = {
  depth: [],
  aliases: [],
  directives: [],
  tokens: [],
  cost: [],
};

const fragments = new Map<string, FragmentDefinitionNode>();
const docs: { file: string; text: string; doc: DocumentNode }[] = [];

const GENERATED_FILE = path.resolve(__dirname, "..", "src", "types", "graphql.tsx");

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
    // Strip ${...} template interpolations (used to inline fragment constants
    // like `${USER_FRAGMENT}`). Fragment definitions are parsed separately
    // from their own gql templates, so the spread reference in the operation
    // body is sufficient for structural analysis.
    const stripped = m[1].replace(/\$\{[^}]*\}/g, "");
    out.push(stripped);
  }
  return out;
}

function hasSelections(node: { selectionSet?: { selections: readonly SelectionNode[] } }): boolean {
  return !!node.selectionSet && node.selectionSet.selections.length > 0;
}

function computeCost(
  selections: readonly SelectionNode[],
  depth: number,
  visited: Set<string>,
): number {
  const { costObjectCost: obj, costScalarCost: sc, costDepthCostFactor: f } = CLIENT_LIMITS;
  let cost = 0;
  for (const sel of selections) {
    if (sel.kind === "Field") {
      const isObject = hasSelections(sel);
      cost += (isObject ? obj : sc) * Math.pow(f, depth);
      if (isObject) {
        cost += computeCost(sel.selectionSet!.selections, depth + 1, visited);
      }
    } else if (sel.kind === "InlineFragment" && hasSelections(sel)) {
      cost += computeCost(sel.selectionSet!.selections, depth, visited);
    } else if (sel.kind === "FragmentSpread") {
      const name = sel.name.value;
      if (visited.has(name)) continue;
      const frag = fragments.get(name);
      if (!frag) continue;
      const next = new Set(visited);
      next.add(name);
      cost += computeCost(frag.selectionSet.selections, depth, next);
    }
  }
  return cost;
}

function computeDepth(
  selections: readonly SelectionNode[],
  depth: number,
  visited: Set<string>,
): number {
  let max = depth;
  for (const sel of selections) {
    if (sel.kind === "Field" && hasSelections(sel)) {
      max = Math.max(max, computeDepth(sel.selectionSet!.selections, depth + 1, visited));
    } else if (sel.kind === "InlineFragment" && hasSelections(sel)) {
      max = Math.max(max, computeDepth(sel.selectionSet!.selections, depth, visited));
    } else if (sel.kind === "FragmentSpread") {
      const name = sel.name.value;
      if (visited.has(name)) continue;
      const frag = fragments.get(name);
      if (!frag) continue;
      const next = new Set(visited);
      next.add(name);
      max = Math.max(max, computeDepth(frag.selectionSet.selections, depth, next));
    }
  }
  return max;
}

function countAliases(op: OperationDefinitionNode): number {
  let count = 0;
  const walk = (sels: readonly SelectionNode[]) => {
    for (const s of sels) {
      if (s.kind === "Field") {
        if (s.alias) count++;
        if (s.selectionSet) walk(s.selectionSet.selections);
      } else if (s.kind === "InlineFragment" && s.selectionSet) {
        walk(s.selectionSet.selections);
      }
    }
  };
  walk(op.selectionSet.selections);
  return count;
}

function countDirectives(op: OperationDefinitionNode): number {
  let count = 0;
  const visit = (n: unknown): void => {
    if (!n || typeof n !== "object") return;
    const obj = n as Record<string, unknown>;
    const directives = obj.directives as unknown[] | undefined;
    if (Array.isArray(directives)) count += directives.length;
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (Array.isArray(v)) v.forEach(visit);
      else if (v && typeof v === "object" && (v as Record<string, unknown>).kind) visit(v);
    }
  };
  visit(op);
  return count;
}

function countTokens(text: string): number {
  let c = 0;
  try {
    const lexer = new Lexer(new Source(text));
    let t = lexer.advance();
    while (t.kind !== TokenKind.EOF) {
      c++;
      t = lexer.advance();
    }
  } catch {
    /* ignore */
  }
  return c;
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

// Phase 1: collect fragments
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
    docs.push({ file: f, text, doc });
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

// Phase 2: measure each operation
for (const { file, text, doc } of docs) {
  const tokens = countTokens(text);
  if (tokens > 0) {
    hits.tokens.push({ metric: "tokens", value: tokens, operation: "(document)", file });
  }
  for (const d of doc.definitions) {
    if (d.kind !== "OperationDefinition") continue;
    const name = d.name?.value ?? "(anonymous)";
    const depth = computeDepth(d.selectionSet.selections, 1, new Set());
    const cost = Math.round(computeCost(d.selectionSet.selections, 1, new Set()));
    const aliases = countAliases(d);
    const directives = countDirectives(d);
    hits.depth.push({ metric: "depth", value: depth, operation: name, file });
    hits.cost.push({ metric: "cost", value: cost, operation: name, file });
    hits.aliases.push({ metric: "aliases", value: aliases, operation: name, file });
    hits.directives.push({ metric: "directives", value: directives, operation: name, file });
    opRows.push({ name, file, depth, aliases, directives, tokens, cost });
  }
}

function topN(metric: Metric, n = 3): Hit[] {
  return [...hits[metric]].sort((a, b) => b.value - a.value).slice(0, n);
}

const rows: { label: string; metric: Metric; limit: number; backend: number }[] = [
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
    `  scanned ${docs.length} documents, ${hits.depth.length} operations, ${fragments.size} fragments`,
    DIM,
  ),
);
console.log("");

const LABEL_W = 11;
const NUM_W = 6;
const BAR_W = 20;

console.log(
  `  ${"metric".padEnd(LABEL_W)} ${"max".padStart(NUM_W)} / ${"limit".padStart(NUM_W)}  ${"usage".padStart(7)}  status  ${"chart".padEnd(BAR_W)}   top operation`,
);
console.log(color(`  ${"-".repeat(LABEL_W + NUM_W * 2 + BAR_W + 50)}`, DIM));

let anyOver = false;
for (const row of rows) {
  const top = topN(row.metric, 1)[0];
  const value = top?.value ?? 0;
  const p = pct(value, row.limit);
  if (value > row.limit) anyOver = true;
  const c = statusColor(p);
  const usage = `${p.toFixed(1)}%`;
  const opName = top && value > 0 ? top.operation : "—";
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
