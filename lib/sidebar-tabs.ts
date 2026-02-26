import type * as PageTree from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';

export type SidebarTabWithProps = {
  url: string;
  title: ReactNode;
  description?: React.ReactNode;
  urls?: Set<string>;
  unlisted?: boolean;
};

const baseUrl = '/docs';
const openApiPrefix = `${baseUrl}/openapi`;

function getFolderUrls(folder: PageTree.Folder, output: Set<string> = new Set()): Set<string> {
  if (folder.index) output.add(folder.index.url);
  for (const child of folder.children) {
    if (child.type === 'page' && !child.external) output.add(child.url);
    if (child.type === 'folder') getFolderUrls(child, output);
  }
  return output;
}

/**
 * Returns two sidebar tabs: Framework (full docs) and OpenAPI (only OpenAPI).
 * When Framework is selected, sidebar shows full tree; when OpenAPI, only openapi subtree.
 */
export function getFrameworkOpenApiTabs(tree: PageTree.Root): SidebarTabWithProps[] {
  const frameworkUrls = new Set<string>();
  let openApiUrls = new Set<string>();
  let openApiFirstUrl = '';

  for (const node of tree.children) {
    if (node.type === 'page' && !node.external) {
      frameworkUrls.add(node.url);
      continue;
    }
    if (node.type !== 'folder') continue;
    const urls = getFolderUrls(node);
    const firstUrl = urls.values().next().value ?? '';
    if (firstUrl.startsWith(openApiPrefix)) {
      openApiUrls = urls;
      openApiFirstUrl = firstUrl;
    } else {
      urls.forEach((u) => frameworkUrls.add(u));
    }
  }

  const frameworkFirstUrl = frameworkUrls.values().next().value ?? baseUrl;

  return [
    {
      url: frameworkFirstUrl,
      title: 'Framework',
      urls: frameworkUrls,
    },
    {
      url: openApiFirstUrl || openApiPrefix,
      title: 'OpenAPI',
      urls: openApiUrls,
    },
  ];
}
