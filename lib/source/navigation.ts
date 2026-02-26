export function getSection(path: string | undefined) {
  if (!path) return undefined;
  const [dir] = path.split('/', 1);
  return dir || undefined;
}
