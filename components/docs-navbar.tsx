'use client';

import Link from 'fumadocs-core/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { text: 'Docs', url: '/docs' },
  { text: 'API Reference', url: '/api-reference' },
  { text: 'Guides', url: '/guides' },
  { text: 'Changelog', url: '/changelog' },
  { text: 'Support', url: '/support' },
] as const;

export function DocsNavbar() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center gap-6 border-b border-fd-border bg-fd-background px-4 py-3 md:px-6 shrink-0"
      aria-label="Documentation sections"
    >
      {navItems.map(({ text, url }) => {
        const isActive =
          url === '/docs'
            ? pathname === '/docs' || pathname.startsWith('/docs/')
            : pathname === url || pathname.startsWith(`${url}/`);
        return (
          <Link
            key={url}
            href={url}
            className={`text-sm font-medium transition-colors ${
              isActive
                ? 'text-fd-foreground'
                : 'text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            {text}
          </Link>
        );
      })}
    </nav>
  );
}
