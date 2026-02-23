import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import * as AccordionComponents from 'fumadocs-ui/components/accordion';
import * as StepsComponents from 'fumadocs-ui/components/steps';
import { Card as FumadocsCard, Cards } from 'fumadocs-ui/components/card';
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

function CardWithIcon(props: {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: string;
  href?: string;
  external?: boolean;
  children?: React.ReactNode;
}) {
  const { icon, ...rest } = props;
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
