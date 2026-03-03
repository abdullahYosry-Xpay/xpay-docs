'use client';

import { usePathname } from 'next/navigation';
import type * as PageTree from 'fumadocs-core/page-tree';
import type { SidebarTabWithProps } from '@/lib/sidebar-tabs';
import type { LinkItemType } from 'fumadocs-ui/layouts/shared';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

const OPENAPI_PREFIX = '/docs/openapi';

type DocsLayoutClientProps = {
  frameworkTree: PageTree.Root;
  openApiTree: PageTree.Root;
  sidebarTabs: SidebarTabWithProps[];
  baseProps: Record<string, unknown>;
  links: LinkItemType[];
  nav: { title: React.ReactNode; url: string };
  children: ReactNode;
};

export function DocsLayoutClient({
  frameworkTree,
  openApiTree,
  sidebarTabs,
  baseProps,
  links,
  nav,
  children,
}: DocsLayoutClientProps) {
  const pathname = usePathname() ?? '';
  const isOpenApi = pathname.startsWith(OPENAPI_PREFIX);
  const tree = isOpenApi ? openApiTree : frameworkTree;

  return (
    <DocsLayout
      key={isOpenApi ? 'openapi' : 'framework'}
      {...baseProps}
      tree={tree}
      links={links}
      nav={nav}
      sidebar={{
        tabs: sidebarTabs,
      }}
    >
      {children}
    </DocsLayout>
  );
}
