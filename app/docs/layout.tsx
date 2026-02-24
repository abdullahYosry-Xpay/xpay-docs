import { source } from '@/lib/source';
import { baseOptions } from '@/lib/layout.shared';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsNavbar } from '@/components/docs-navbar';
import { DocsAIChat } from '@/components/docs-ai-chat';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DocsNavbar />
      <div className="flex-1 min-h-0">
        <DocsLayout
          tree={source.pageTree}
          {...baseOptions()}
          sidebar={{
            collapsible: false,
            defaultOpenLevel: 1,
          }}
        >
          {children}
        </DocsLayout>
      </div>
      <DocsAIChat />
    </div>
  );
}
