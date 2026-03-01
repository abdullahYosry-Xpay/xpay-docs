import type { ComponentProps, ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { source } from '@/lib/source';
import { DocsPage, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { findNeighbour, findSiblings, flattenTree } from 'fumadocs-core/page-tree';
import { getDocsGitHubUrls } from '@/lib/github';
import { DocsPageActions } from '@/components/docs-page-actions';

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
    const apiPageProps = (
      page.data as { getAPIPageProps: () => ComponentProps<typeof APIPage> }
    ).getAPIPageProps();
    const isOpenAPIIndex = (page.data as { index?: boolean }).index;
    return (
      <DocsPage full>
        <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
        {page.data.description && (
          <p className="text-lg text-fd-muted-foreground mb-2">{page.data.description}</p>
        )}
        {isOpenAPIIndex ? (
          <>
            <DocsBody>
              <OpenAPIEndpointCardsFromTree />
            </DocsBody>
            <DocsBody>
              <APIPage {...apiPageProps} />
            </DocsBody>
          </>
        ) : (
          <DocsBody>
            <APIPage {...apiPageProps} />
          </DocsBody>
        )}
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
  const Body = (page.data as { body: ComponentType }).body;

  const isIndex = (page.data as { index?: boolean }).index;

  const { markdownUrl, githubUrl } = getDocsGitHubUrls(slug);

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
      <h1 className="text-[1.75em] font-semibold">{page.data.title ?? 'Untitled'}</h1>
      {page.data.description && (
        <p className="text-lg text-fd-muted-foreground mb-2">{page.data.description}</p>
      )}
      <DocsPageActions markdownUrl={markdownUrl} githubUrl={githubUrl} />
      <div className="prose flex-1 text-fd-foreground/90">
        <DocsBody>
          <Body />
        </DocsBody>
        {page.url === '/docs/openapi' ? (
          <OpenAPIEndpointCardsFromTree />
        ) : isIndex ? (
          <DocsCategory url={page.url} />
        ) : null}
      </div>
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
          <Card key={item.url} title={item.name} href={item.url}>
            {item.description}
          </Card>
        );
      })}
    </Cards>
  );
}

const OPENAPI_INDEX_URL = '/docs/openapi';

/** Cards for all OpenAPI endpoints when route is /docs/openapi (sidebar endpoints from YML). */
function OpenAPIEndpointCardsFromTree() {
  const tree = source.getPageTree();
  const allPages = flattenTree(tree.children);
  const endpointItems = allPages.filter(
    (item) =>
      item.type === 'page' &&
      !item.external &&
      item.url.startsWith(OPENAPI_INDEX_URL) &&
      item.url !== OPENAPI_INDEX_URL
  );

  return (
    <Cards>
      {endpointItems.map((item) => (
        <Card key={item.url} title={item.name} href={item.url}>
          {item.description}
        </Card>
      ))}
    </Cards>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
