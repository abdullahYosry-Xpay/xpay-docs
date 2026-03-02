import type * as PageTree from 'fumadocs-core/page-tree';
import { flattenTree } from 'fumadocs-core/page-tree';

const baseUrl = '/docs';
const openApiPrefix = `${baseUrl}/openapi`;
const openApiIndexUrl = `${baseUrl}/openapi`;

function getFolderUrls(folder: PageTree.Folder, output: Set<string> = new Set()): Set<string> {
  if (folder.index) output.add(folder.index.url);
  for (const child of folder.children) {
    if (child.type === 'page' && !child.external) output.add(child.url);
    if (child.type === 'folder') getFolderUrls(child, output);
  }
  return output;
}

function isOpenApiFolder(node: PageTree.Folder): boolean {
  const urls = getFolderUrls(node);
  const first = urls.values().next().value ?? '';
  return first.startsWith(openApiPrefix);
}

/** Last path segment of an OpenAPI page URL (operation slug). */
export function getOperationSlugFromUrl(url: string): string {
  if (!url.startsWith(openApiIndexUrl + '/')) return '';
  const rest = url.slice((openApiIndexUrl + '/').length).replace(/\/$/, '');
  const segments = rest.split('/').filter(Boolean);
  return segments[segments.length - 1] ?? '';
}

function slugify(s: unknown): string {
  if (typeof s !== 'string') return '';
  return s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Returns a new page tree with the OpenAPI folder's children replaced by
 * tag-grouped folders (e.g. Health, User, Checkout Sessions) for the sidebar.
 */
export function getOpenApiGroupedTree(
  tree: PageTree.Root,
  operationTagMap: Map<string, string>
): PageTree.Root {
  const endpointPages = flattenTree(tree.children).filter(
    (item): item is PageTree.Page =>
      item.type === 'page' &&
      !item.external &&
      item.url.startsWith(openApiIndexUrl) &&
      item.url !== openApiIndexUrl
  );

  const byTag = new Map<string, PageTree.Page[]>();
  for (const p of endpointPages) {
    const slug = getOperationSlugFromUrl(p.url);
    const tag =
      (slug && operationTagMap.get(slugify(slug))) ??
      'Other';
    if (!byTag.has(tag)) byTag.set(tag, []);
    byTag.get(tag)!.push(p);
  }

  const sortedTags = Array.from(byTag.keys()).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });

  const tagFolders: PageTree.Folder[] = sortedTags.map((name) => ({
    type: 'folder',
    name,
    children: byTag.get(name)!,
  }));

  function transformNode(node: PageTree.Node): PageTree.Node {
    if (node.type === 'page' || node.type === 'separator') return node;
    const folder = node as PageTree.Folder;
    if (!isOpenApiFolder(folder)) {
      return { ...folder, children: folder.children.map(transformNode) };
    }
    const indexPage =
      folder.index && folder.index.url === openApiIndexUrl ? folder.index : null;
    const newChildren: PageTree.Node[] = indexPage ? [indexPage, ...tagFolders] : tagFolders;
    return { ...folder, children: newChildren };
  }

  return { ...tree, children: tree.children.map(transformNode) };
}
