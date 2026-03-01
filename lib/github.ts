/**
 * GitHub repo config for "Open in GitHub" and raw markdown URLs.
 * Set in env as GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH (default: main)
 * or replace these defaults with your repo.
 */
export const github = {
  owner: process.env.GITHUB_OWNER ?? 'your-org',
  repo: process.env.GITHUB_REPO ?? 'xpay-docs',
  branch: process.env.GITHUB_BRANCH ?? 'main',
};

export function getDocsGitHubUrls(slug: string[] | undefined) {
  const path =
    !slug || slug.length === 0 ? 'index.mdx' : `${slug.join('/')}.mdx`;
  const docsPath = `docs/${path}`;

  const hasGitHub =
    github.owner !== 'your-org' || github.repo !== 'xpay-docs';
  const githubUrl = hasGitHub
    ? `https://github.com/${github.owner}/${github.repo}/blob/${github.branch}/${docsPath}`
    : null;

  const markdownUrl = hasGitHub
    ? `https://raw.githubusercontent.com/${github.owner}/${github.repo}/${github.branch}/${docsPath}`
    : `/api/docs/raw/${slug?.length ? slug.join('/') : ''}`;

  return { markdownUrl, githubUrl };
}
