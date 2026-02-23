import { notFound } from 'next/navigation';
import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/layouts/docs/page';
import { findNeighbour } from 'fumadocs-core/page-tree';

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const tree = source.getPageTree();
  const neighbours = findNeighbour(tree, page.url);
  const prev = neighbours.previous
    ? source.getNodePage(neighbours.previous)
    : undefined;
  const next = neighbours.next
    ? source.getNodePage(neighbours.next)
    : undefined;
  const Body = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      footer={{
        enabled: true,
        items: {
          previous: prev
            ? { name: prev.data.title ?? 'Previous', url: prev.url }
            : undefined,
          next: next
            ? { name: next.data.title ?? 'Next', url: next.url }
            : undefined,
        },
      }}
    >
      <DocsTitle>{page.data.title ?? 'Untitled'}</DocsTitle>
      {page.data.description && (
        <DocsDescription>{page.data.description}</DocsDescription>
      )}
      <DocsBody>
        <Body />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
