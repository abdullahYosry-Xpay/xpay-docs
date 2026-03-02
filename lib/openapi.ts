import { createOpenAPI } from 'fumadocs-openapi/server';
import fs from 'node:fs';
import path from 'node:path';

export const openapi = createOpenAPI({
  input: [path.resolve(process.cwd(), 'openapi.json')],
  proxyUrl: '/api/proxy',
});

const openApiPath = path.resolve(process.cwd(), 'openapi.json');

/** Slugify operationId for URL matching (e.g. "getRoot" -> "get-root"). */
function slugify(s: string): string {
  return s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Returns a map from operation slug to tag name from the OpenAPI spec.
 * Used to group endpoints in the sidebar and on the OpenAPI index page.
 */
export function getOpenApiOperationTagMap(): Map<string, string> {
  const raw = fs.readFileSync(openApiPath, 'utf-8');
  const spec = JSON.parse(raw) as {
    paths?: Record<
      string,
      Record<string, { operationId?: string; tags?: string[] }>
    >;
  };
  const map = new Map<string, string>();
  for (const pathUrl of Object.keys(spec.paths ?? {})) {
    const methods = spec.paths![pathUrl];
    for (const method of Object.keys(methods)) {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) continue;
      const op = methods[method];
      const tag = op?.tags?.[0];
      if (op?.operationId && tag) map.set(slugify(op.operationId), tag);
    }
  }
  return map;
}
