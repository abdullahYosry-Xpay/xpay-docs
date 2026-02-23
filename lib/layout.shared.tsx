import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Xpay Docs',
      url: '/docs',
    },
    sidebar: {
      collapsible: false,
      defaultOpenLevel: 1,
    },
  };
}
