import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const ICONS_DIR = path.resolve(process.cwd(), 'components', 'icons');
const ALLOWED = new Set(['chatgpt', 'claude', 'cursor', 'scira']);

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params;
  if (!name || !ALLOWED.has(name)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const filePath = path.join(ICONS_DIR, `${name}.svg`);
  const resolved = path.resolve(filePath);
  const relative = path.relative(ICONS_DIR, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    let content = await readFile(resolved, 'utf-8');
    // When SVG is loaded via <img>, currentColor doesn't inherit; use a visible fallback
    content = content.replace(/fill="currentColor"/gi, 'fill="#737373"');
    content = content.replace(/stroke="currentColor"/gi, 'stroke="#737373"');
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
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
