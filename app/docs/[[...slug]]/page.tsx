import { notFound } from 'next/navigation';
import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/layouts/docs/page';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { findNeighbour, findSiblings } from 'fumadocs-core/page-tree';

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  if ((page.data as { type?: string }).type === 'openapi') {
    const { APIPage } = await import('@/components/api-page');
    return (
      <DocsPage full>
        <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
        <DocsBody>
          <APIPage {...(page.data as { getAPIPageProps: () => object }).getAPIPageProps()} />
        </DocsBody>
      </DocsPage>
    );
  }

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
        {(page.data as { index?: boolean }).index ? (
          <DocsCategory url={page.url} />
        ) : null}
      </DocsBody>
    </DocsPage>
  );
}

function DocsCategory({ url }: { url: string }) {
  return (
    <Cards>
      {findSiblings(source.getPageTree(), url).map((item) => {
        if (item.type === 'separator') return null;
        if (item.type === 'folder') {
          if (!item.index) return null;
          item = item.index;
        }
        return (
          <Card
            key={item.url}
            title={item.name}
            description={item.description}
            href={item.url}
          />
        );
      })}
    </Cards>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
