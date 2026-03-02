import type { ComponentProps, ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { source } from '@/lib/source';
import { DocsPage, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { findNeighbour, findSiblings, flattenTree } from 'fumadocs-core/page-tree';
import { getDocsGitHubUrls } from '@/lib/github';
import { DocsPageActions } from '@/components/docs-page-actions';
import { getOpenApiOperationTagMap } from '@/lib/openapi';
import { getOperationSlugFromUrl } from '@/lib/openapi-tree';

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
      <DocsPageActions
        markdownUrl={markdownUrl}
        githubUrl={githubUrl}
        pagePath={page.url}
      />
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

function slugify(s: unknown): string {
  if (typeof s !== 'string') return '';
  return s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

/** OpenAPI endpoint cards grouped by tag in dropdowns (index page + Scalar/APIPage view). */
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

  const operationTagMap = getOpenApiOperationTagMap();
  const byTag = new Map<string, typeof endpointItems>();
  for (const item of endpointItems) {    
    const slug = getOperationSlugFromUrl(item.url);
    const tag =
      (slug && operationTagMap.get(slugify(slug))) ?? 'Other';
    if (!byTag.has(tag)) byTag.set(tag, []);
    byTag.get(tag)!.push(item);
  }

  const sortedTags = Array.from(byTag.keys()).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-3">
      {sortedTags.map((tag) => {
        const items = byTag.get(tag)!;
        return (
          <details
            key={tag}
            className="group rounded-xl border bg-fd-card overflow-hidden"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-medium text-fd-foreground select-none hover:bg-fd-accent/50">
              <span className="flex-1">{tag}</span>
              <span className="text-sm text-fd-muted-foreground font-normal">
                {items.length} {items.length === 1 ? 'endpoint' : 'endpoints'}
              </span>
              <svg
                className="size-4 shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="border-t border-fd-border px-4 pb-4 pt-3">
              <Cards>
                {items.map((item) => (
                  <Card key={item.url} title={item.name} href={item.url}>
                    {item.description}
                  </Card>
                ))}
              </Cards>
            </div>
          </details>
        );
      })}
    </div>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
