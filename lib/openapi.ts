import { createOpenAPI } from 'fumadocs-openapi/server';
import path from 'node:path';

export const openapi = createOpenAPI({
  input: [path.resolve(process.cwd(), 'scalar.yaml')],
  proxyUrl: '/api/proxy',
});
