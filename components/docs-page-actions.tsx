'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, Copy, ExternalLink, FileText } from 'lucide-react';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { cn } from 'fumadocs-ui/utils/cn';

const cache = new Map<string, string>();

function resolveMarkdownUrl(markdownUrl: string): string {
  if (typeof window === 'undefined' || markdownUrl.startsWith('http')) return markdownUrl;
  return window.location.origin + markdownUrl;
}

export function CopyMarkdownButton({ markdownUrl }: { markdownUrl: string }) {
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    const url = resolveMarkdownUrl(markdownUrl);
    const cached = cache.get(url);
    if (cached) return navigator.clipboard.writeText(cached);

    setLoading(true);
    try {
      const res = await fetch(url);
      const content = await res.text();
      cache.set(url, content);
      await navigator.clipboard.writeText(content);
    } finally {
      setLoading(false);
    }
  });

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        buttonVariants({
          color: 'secondary',
          size: 'sm',
          className: 'gap-1.5 not-prose',
        })
      )}
      aria-label="Copy markdown"
    >
      {checked ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {isLoading ? 'Copying…' : checked ? 'Copied' : 'Copy Markdown'}
    </button>
  );
}

export function ViewOptions({
  markdownUrl,
  githubUrl,
}: {
  markdownUrl: string;
  githubUrl: string | null;
}) {
  const items = useMemo(() => {
    const list: { title: string; href: string; icon: React.ReactNode }[] = [];
    if (githubUrl) {
      list.push({
        title: 'Open in GitHub',
        href: githubUrl,
        icon: <ExternalLink className="size-4" />,
      });
    }
    list.push({
      title: 'View as Markdown',
      href: markdownUrl.startsWith('http') ? markdownUrl : markdownUrl,
      icon: <FileText className="size-4" />,
    });
    return list;
  }, [githubUrl, markdownUrl]);

  if (items.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({
            color: 'secondary',
            size: 'sm',
            className: 'gap-1.5 not-prose',
          })
        )}
        aria-label="Open options"
      >
        Open
        <ChevronDown className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1">
        {items.map((item) => (
          <a
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-fd-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            {item.icon}
            {item.title}
          </a>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function DocsPageActions({
  markdownUrl,
  githubUrl,
}: {
  markdownUrl: string;
  githubUrl: string | null;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 not-prose mb-2">
      <CopyMarkdownButton markdownUrl={markdownUrl} />
      <ViewOptions markdownUrl={markdownUrl} githubUrl={githubUrl} />
    </div>
  );
}
