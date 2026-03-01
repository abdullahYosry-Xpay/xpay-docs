'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Copy, ExternalLink, FileText } from 'lucide-react';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { cn } from 'fumadocs-ui/utils/cn';

import chatgptIcon from '@/components/icons/chatgpt.svg';
import claudeIcon from '@/components/icons/claude.svg';
import cursorIcon from '@/components/icons/cursor.svg';
import sciraIcon from '@/components/icons/scira.svg';

const linkItemClass =
  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-fd-foreground hover:bg-fd-accent hover:text-fd-accent-foreground w-full text-left';
const separatorClass = 'my-1 h-px bg-fd-border';

function DropdownIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={16}
      height={16}
      className="
        shrink-0 size-4 object-contain
        filter dark:invert
      "
      aria-hidden
      loading="eager"
    />
  );
}
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

const PROMPT_TEMPLATE = (url: string) =>
  `Read ${url}, I want to ask questions about it.`;

function buildAiUrls(pageUrl: string) {
  const prompt = PROMPT_TEMPLATE(pageUrl);
  const q = encodeURIComponent(prompt);
  return {
    scira: `https://scira.ai/?q=${q}`,
    chatgpt: `https://chatgpt.com/?hints=search&q=${q}`,
    claude: `https://claude.ai/new?q=${q}`,
    cursor: `https://cursor.com/link/prompt?text=${encodeURIComponent(prompt)}`,
  };
}

export function ViewOptions({
  markdownUrl,
  githubUrl,
  pagePath,
}: {
  markdownUrl: string;
  githubUrl: string | null;
  pagePath?: string;
}) {
  const [pageUrl, setPageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && pagePath) {
      setPageUrl(window.location.origin + pagePath);
    }
  }, [pagePath]);

  const aiUrls = useMemo(
    () => (pageUrl ? buildAiUrls(pageUrl) : null),
    [pageUrl],
  );
  

  const { viewItems, aiItems } = useMemo(() => {
    const view: { title: string; href: string; icon: React.ReactNode }[] = [];
    if (githubUrl) {
      view.push({
        title: 'Open in GitHub',
        href: githubUrl,
        icon: <ExternalLink className="size-4" />,
      });
    }
    view.push({
      title: 'View as Markdown',
      href: markdownUrl.startsWith('http') ? markdownUrl : markdownUrl,
      icon: <FileText className="size-4" />,
    });

    const ai: { title: string; href: string; icon: React.ReactNode }[] = [
      {
        title: 'Open in Scira AI',
        href: aiUrls?.scira ?? 'https://scira.ai/',
        icon: <DropdownIcon src={sciraIcon.src} alt="Scira AI" />,
      },
      {
        title: 'Open in ChatGPT',
        href: aiUrls?.chatgpt ?? 'https://chatgpt.com/',
        icon: <DropdownIcon src={chatgptIcon.src} alt="ChatGPT" />,
      },
      {
        title: 'Open in Claude',
        href: aiUrls?.claude ?? 'https://claude.ai/new',
        icon: <DropdownIcon src={claudeIcon.src} alt="Claude" />,
      },
      {
        title: 'Open in Cursor',
        href: aiUrls?.cursor ?? 'https://cursor.com/link/prompt',
        icon: <DropdownIcon src={cursorIcon.src} alt="Cursor" />,
      },
    ];
    return { viewItems: view, aiItems: ai };
  }, [githubUrl, markdownUrl, aiUrls]);

  const hasView = viewItems.length > 0;
  const hasAi = aiItems.length > 0;
  if (!hasView && !hasAi) return null;

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
      <PopoverContent align="end" className="w-52 p-1">
        {hasView &&
          viewItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className={linkItemClass}
            >
              {item.icon}
              {item.title}
            </a>
          ))}
        {hasView && hasAi && <div className={separatorClass} role="separator" />}
        {aiItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noreferrer noopener"
            className={linkItemClass}
          >
            {item.icon}
            {item.title}
          </a>
        ))}
        {/* {hasAi && (
          <p className="px-2 py-1.5 text-[0.75rem] text-fd-muted-foreground mt-1 border-t border-fd-border">
            Use anonymous or private browsing if a login is required.
          </p>
        )} */}
      </PopoverContent>
    </Popover>
  );
}

export function DocsPageActions({
  markdownUrl,
  githubUrl,
  pagePath,
}: {
  markdownUrl: string;
  githubUrl: string | null;
  pagePath?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 not-prose mb-2">
      <CopyMarkdownButton markdownUrl={markdownUrl} />
      <ViewOptions
        markdownUrl={markdownUrl}
        githubUrl={githubUrl}
        pagePath={pagePath}
      />
    </div>
  );
}
