import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'docs');

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await context.params;
  const segments = slug && slug.length > 0 ? slug : ['index'];
  const filePath = path.join(DOCS_DIR, ...segments.slice(0, -1), `${segments[segments.length - 1]}.mdx`);

  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(DOCS_DIR)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const content = await readFile(resolved, 'utf-8');
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === 'ENOENT') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }
}
