import type { Suggestion } from '@/components/layouts/not-found';
import { source } from '@/lib/source';
import type { Node } from 'fumadocs-core/page-tree';

function collectPages(nodes: Node[], term: string): Suggestion[] {
  const results: Suggestion[] = [];
  const lower = term.toLowerCase();

  for (const node of nodes) {
    if (node.type === 'page' && typeof node.name === 'string') {
      if (node.name.toLowerCase().includes(lower) || node.url.toLowerCase().includes(lower)) {
        results.push({ id: node.url, href: node.url, title: node.name });
      }
    } else if (node.type === 'folder') {
      if (node.index) results.push(...collectPages([node.index], term));
      results.push(...collectPages(node.children, term));
    }
  }
  return results;
}

export async function getSuggestions(pathname: string): Promise<Suggestion[]> {
  const tree = source.getPageTree();
  const term = pathname.replace(/^\//, '').replace(/\//g, ' ') || 'docs';
  const pages = collectPages(tree.children, term);
  return pages.slice(0, 5);
}
