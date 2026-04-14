// ============================================================
// Linear.app Clone — TypeScript Types
// ============================================================

export interface NavItem {
  label: string;
  href: string;
  isDropdown?: boolean;
}

export interface NavConfig {
  logo: { text: string; href: string };
  primary: NavItem[];
  secondary: NavItem[];
  cta: { label: string; href: string; variant: "ghost" | "primary" };
}

export interface HeroContent {
  badge: {
    label: string;
    href: string;
  };
  heading: string;
  description: string;
  mockupImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface FeatureSection {
  number: string; // "1.0", "2.0" etc.
  label: string; // "Intake", "Plan" etc.
  heading: string;
  description: string;
  linkLabel: string;
  linkHref: string;
  mockupImages: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }[];
}

export interface CustomerQuote {
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
  avatarSrc?: string;
  theme: "dark" | "yellow";
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterConfig {
  columns: FooterColumn[];
  legal: { label: string; href: string }[];
  copyright: string;
}

export interface ButtonVariant {
  variant: "primary" | "secondary" | "ghost" | "invert";
  size: "sm" | "md" | "lg";
}
