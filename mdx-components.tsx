import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import * as AccordionComponents from 'fumadocs-ui/components/accordion';
import * as StepsComponents from 'fumadocs-ui/components/steps';
import { Card as FumadocsCard, Cards } from 'fumadocs-ui/components/card';
import { OperationHeader, ResponseStatus } from '@/components/openapi-operation';
import Link from 'fumadocs-core/link';
import { cn } from 'fumadocs-ui/utils/cn';
import {
  CreditCard,
  Globe,
  Cog,
  Package,
  DollarSign,
  ShoppingCart,
  RotateCw,
  HandCoins,
  Link2,
  Code,
  Monitor,
  Key,
  Download,
  Github,
  MessageCircle,
  Rocket,
  PiggyBank,
  Wrench,
  ChartLine,
  Users,
  Building2,
  Landmark,
  Percent,
  UserPlus,
  BookOpen,
  Eye,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'credit-card': CreditCard,
  globe: Globe,
  'building-columns': Landmark,
  gears: Cog,
  box: Package,
  'money-bill': DollarSign,
  'cart-shopping': ShoppingCart,
  'arrows-rotate': RotateCw,
  'hand-holding-dollar': HandCoins,
  link: Link2,
  browser: Monitor,
  code: Code,
  key: Key,
  download: Download,
  github: Github,
  discord: MessageCircle,
  rocket: Rocket,
  'piggy-bank': PiggyBank,
  wrench: Wrench,
  'chart-line': ChartLine,
  users: Users,
  building: Building2,
  percent: Percent,
  'dollar-sign': DollarSign,
  'user-plus': UserPlus,
  book: BookOpen,
  eye: Eye,
  react: Code,
  php: Code,
  'node-js': Code,
  js: Code,
  python: Code,
  golang: Code,
};

const methodColors: Record<
  string,
  { border: string; badge: string; badgeText: string }
> = {
  GET: {
    border: 'border-l-emerald-500 dark:border-l-emerald-500',
    badge: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
  },
  POST: {
    border: 'border-l-blue-500 dark:border-l-blue-500',
    badge: 'bg-blue-500/15 dark:bg-blue-500/20',
    badgeText: 'text-blue-700 dark:text-blue-300',
  },
  PUT: {
    border: 'border-l-amber-500 dark:border-l-amber-500',
    badge: 'bg-amber-500/15 dark:bg-amber-500/20',
    badgeText: 'text-amber-700 dark:text-amber-300',
  },
  PATCH: {
    border: 'border-l-amber-500 dark:border-l-amber-500',
    badge: 'bg-amber-500/15 dark:bg-amber-500/20',
    badgeText: 'text-amber-700 dark:text-amber-300',
  },
  DELETE: {
    border: 'border-l-red-500 dark:border-l-red-500',
    badge: 'bg-red-500/15 dark:bg-red-500/20',
    badgeText: 'text-red-700 dark:text-red-300',
  },
};

function OpenAPICard(props: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  title: string;
  description?: React.ReactNode;
  href: string;
  children?: React.ReactNode;
}) {
  const { method, title, description, href, children } = props;
  const colors = methodColors[method] ?? methodColors.GET;
  const body = description ?? children;
  const Wrapper = href ? Link : 'div';
  return (
    <Wrapper
      href={href}
      className={cn(
        'block rounded-xl border border-l-4 bg-fd-card p-4 text-fd-card-foreground transition-colors @max-lg:col-span-full',
        colors.border,
        href && 'hover:bg-fd-accent/80'
      )}
    >
      <div
        className={cn(
          'not-prose mb-2 w-fit rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
          colors.badge,
          colors.badgeText
        )}
      >
        {method}
      </div>
      <h3 className="not-prose mb-1 text-sm font-medium">{title}</h3>
      {body ? (
        <p className="my-0! text-sm text-fd-muted-foreground">{body}</p>
      ) : null}
    </Wrapper>
  );
}

function CardWithIcon(props: {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  href?: string;
  external?: boolean;
  children?: React.ReactNode;
}) {
  const { icon, method, ...rest } = props;
  if (method && rest.href) {
    return (
      <OpenAPICard
        method={method}
        title={String(rest.title ?? '')}
        description={rest.description ?? rest.children}
        href={rest.href}
      />
    );
  }
  const IconComponent = icon ? iconMap[icon.toLowerCase()] : undefined;
  return (
    <FumadocsCard
      {...rest}
      icon={IconComponent ? <IconComponent className="size-4" /> : undefined}
    />
  );
}

function Expandable({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="my-4 rounded-xl border bg-fd-card [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:p-4 [&_summary]:font-medium [&_summary]:text-fd-foreground">
      <summary className="select-none">{title}</summary>
      <div className="border-t px-4 pb-4 pt-2">{children}</div>
    </details>
  );
}

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    ...AccordionComponents,
    ...StepsComponents,
    Card: CardWithIcon,
    OpenAPICard,
    OperationHeader,
    ResponseStatus,
    Cards,
    CardGroup: Cards,
    Expandable,
    Info: (props: { children: React.ReactNode }) => (
      <defaultMdxComponents.Callout type="info" {...props} />
    ),
    Warning: (props: { children: React.ReactNode }) => (
      <defaultMdxComponents.Callout type="warn" {...props} />
    ),
    Note: (props: { children: React.ReactNode }) => (
      <defaultMdxComponents.Callout type="info" {...props} />
    ),
    Tip: (props: { children: React.ReactNode }) => (
      <defaultMdxComponents.Callout type="info" {...props} />
    ),
    ...components,
  };
}
