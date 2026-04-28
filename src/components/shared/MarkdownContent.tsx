"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Props = {
  children: string;
  className?: string;
};

const components: Components = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-6 mb-4 scroll-m-20 text-2xl font-bold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-6 mb-3 scroll-m-20 border-b border-border pb-1 text-xl font-bold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-5 mb-2 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "mt-4 mb-2 scroll-m-20 text-base font-semibold first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5 className={cn("mt-4 mb-2 text-sm font-semibold first:mt-0", className)} {...props} />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        "mt-4 mb-2 text-sm font-semibold text-muted-foreground first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn("my-3 leading-7 text-foreground first:mt-0 last:mb-0", className)}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "font-medium text-primary underline underline-offset-4 hover:text-primary-hover",
        className,
      )}
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn("my-3 ml-6 list-disc space-y-1 [&>li]:list-disc [&>li]:ml-0", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-3 ml-6 list-decimal space-y-1 [&>li]:list-decimal [&>li]:ml-0",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("leading-7 [&>p]:my-0", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-4 border-l-4 border-border bg-muted/40 px-4 py-2 italic text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-6 border-border", className)} {...props} />
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code
          className={cn(
            "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground",
            className,
          )}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={cn("font-mono text-sm", className)} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-4 overflow-x-auto rounded-md border border-border bg-muted p-4 text-sm leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
  table: ({ children }) => <Table className="my-4">{children}</Table>,
  thead: ({ children }) => <TableHeader>{children}</TableHeader>,
  tbody: ({ children }) => <TableBody>{children}</TableBody>,
  tr: ({ children }) => <TableRow>{children}</TableRow>,
  th: ({ children, style }) => <TableHead style={style}>{children}</TableHead>,
  td: ({ children, style }) => <TableCell style={style}>{children}</TableCell>,
  img: ({ className, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      className={cn("my-4 max-w-full rounded-md border border-border", className)}
      {...props}
    />
  ),
};

export function MarkdownContent({ children, className }: Props) {
  return (
    <div className={cn("text-foreground", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
