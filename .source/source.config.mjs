// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
var docs = defineDocs({
  dir: "docs"
});
function rehypeFixSrcSet() {
  return (tree) => {
    function visit(node) {
      if (node.type === "element" && node.properties && "srcset" in node.properties) {
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
var source_config_default = defineConfig({
  mdxOptions: {
    providerImportSource: "@/mdx-components",
    rehypePlugins: [rehypeFixSrcSet]
  }
});
export {
  source_config_default as default,
  docs
};
