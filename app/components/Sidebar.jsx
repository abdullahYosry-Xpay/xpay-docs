'use client';

import { source } from '@/lib/source';
import { useTheme } from 'next-themes';
import { Sidebar } from 'fumadocs-ui/components/sidebar';
import Link from 'next/link';

export function CustomSidebar() {
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-64 h-screen flex flex-col border-r bg-background">

      <div className="p-4 border-b">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          Toggle Theme
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Sidebar tree={source.pageTree} />
      </div>

      <div className="p-4 border-t text-sm">
        <Link href="/support" className="block mb-2">
          Support
        </Link>
        <Link href="/changelog" className="block">
          Changelog
        </Link>
      </div>
    </aside>
  );
}
