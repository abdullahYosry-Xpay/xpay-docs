import { source } from '@/lib/source';
import { baseOptions, linkItems, logo } from '@/components/layouts/shared';
import { getFrameworkOpenApiTabs } from '@/lib/sidebar-tabs';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { BookOpen, Code2, MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const base = baseOptions();
  const tree = source.getPageTree();
  const sidebarTabs = getFrameworkOpenApiTabs(tree).map((tab) => {
    if (tab.title === 'Framework') {
      return {
        ...tab,
        icon: <BookOpen className="size-4" />,
        description: 'Documentation and guides',
      };
    }
    return {
      ...tab,
      icon: <Code2 className="size-4" />,
      description: 'API reference',
    };
  });

  return (
    <DocsLayout
      {...base}
      tree={tree}
      links={linkItems.filter((item) => item.type === 'icon')}
      nav={{
        ...base.nav,
        title: (
          <>
            {logo}
            <span className="font-medium max-md:hidden">Docs</span>
          </>
        ),
      }}
      sidebar={{
        tabs: sidebarTabs,
      }}
    >
      <AISearch>
        {children}
        <AISearchPanel />
        <AISearchTrigger
          position="float"
          className={cn(
            buttonVariants({
              variant: 'secondary',
              className: 'text-fd-muted-foreground rounded-2xl',
            }),
          )}
        >
          <MessageCircleIcon className="size-4.5" />
          Ask AI
        </AISearchTrigger>
      </AISearch>
    </DocsLayout>
  );
}
