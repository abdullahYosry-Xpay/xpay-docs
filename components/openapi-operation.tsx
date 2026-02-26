'use client';

import { cn } from 'fumadocs-ui/utils/cn';

const METHOD_STYLES: Record<
  string,
  { badge: string; pill: string }
> = {
  GET: {
    badge: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    pill: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  POST: {
    badge: 'bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    pill: 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  },
  PUT: {
    badge: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    pill: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  PATCH: {
    badge: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    pill: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  DELETE: {
    badge: 'bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    pill: 'bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  },
};

export function OperationHeader(props: {
  serverUrl: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  hasAuth?: boolean;
  hasPath?: boolean;
  hasBody?: boolean;
}) {
  const { serverUrl, method, path, hasAuth, hasPath, hasBody } = props;
  const styles = METHOD_STYLES[method] ?? METHOD_STYLES.GET;
  return (
    <div className="openapi-operation-header not-prose mb-6">
      <div className="mb-2 text-xs font-medium text-fd-muted-foreground">
        Server URL
      </div>
      <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm font-mono text-fd-foreground">
        {serverUrl}
      </code>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'inline-flex rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
            styles.badge
          )}
        >
          {method}
        </span>
        <code className="rounded border border-fd-border bg-fd-muted/50 px-2 py-1 font-mono text-sm">
          {path}
        </code>
        <span className="inline-flex rounded border border-fd-border bg-fd-muted/30 px-2 py-0.5 text-xs font-medium text-fd-muted-foreground">
          Send
        </span>
        {hasAuth && (
          <span
            className={cn(
              'rounded px-2 py-0.5 text-xs font-medium',
              styles.pill
            )}
          >
            Authorization
          </span>
        )}
        {hasPath && (
          <span
            className={cn(
              'rounded px-2 py-0.5 text-xs font-medium',
              styles.pill
            )}
          >
            Path
          </span>
        )}
        {hasBody && (
          <span
            className={cn(
              'rounded px-2 py-0.5 text-xs font-medium',
              styles.pill
            )}
          >
            Body
          </span>
        )}
      </div>
    </div>
  );
}

export function ResponseStatus(props: {
  codes: string[];
  children?: React.ReactNode;
}) {
  const { codes, children } = props;
  return (
    <div className="openapi-response-body not-prose mb-6">
      <div className="mb-3 flex flex-wrap gap-2">
        {codes.map((code) => (
          <span
            key={code}
            className="rounded bg-fd-muted px-2 py-0.5 font-mono text-sm font-medium text-fd-foreground"
          >
            {code}
          </span>
        ))}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
