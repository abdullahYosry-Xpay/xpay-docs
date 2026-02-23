import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'docs',
});

type HastNode = { type?: string; properties?: Record<string, unknown>; children?: HastNode[] };

/** Rehype plugin: rename HTML `srcset` to React `srcSet` so pasted Polar docs work. */
function rehypeFixSrcSet() {
  return (tree: { children?: HastNode[] }) => {
    function visit(node: HastNode) {
      if (node.type === 'element' && node.properties && 'srcset' in node.properties) {
        node.properties.srcSet = node.properties.srcset;
        delete node.properties.srcset;
      }
      if (Array.isArray(node.children)) {
        for (const child of node.children) visit(child);
      }
    }
    if (Array.isArray(tree.children)) {
      for (const child of tree.children) visit(child);
    }
  };
}

export default defineConfig({
  mdxOptions: {
    providerImportSource: '@/mdx-components',
    rehypePlugins: [rehypeFixSrcSet],
  },
});