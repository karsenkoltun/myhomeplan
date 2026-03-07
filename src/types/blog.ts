export interface BlogAuthor {
  name: string;
  avatar?: string;
  bio?: string;
}

export type BlogCategory =
  | "outdoor-maintenance"
  | "indoor-cleaning"
  | "home-systems"
  | "specialty-services"
  | "seasonal-guides"
  | "homeowner-tips"
  | "cost-guides"
  | "strata-property-management"
  | "local-okanagan";

export const BLOG_CATEGORIES: Record<
  BlogCategory,
  { label: string; description: string }
> = {
  "outdoor-maintenance": {
    label: "Outdoor Maintenance",
    description:
      "Lawn care, snow removal, gutter cleaning, and exterior upkeep",
  },
  "indoor-cleaning": {
    label: "Indoor Cleaning",
    description: "House cleaning, carpet care, window washing, and more",
  },
  "home-systems": {
    label: "Home Systems",
    description: "HVAC, plumbing, electrical inspections and maintenance",
  },
  "specialty-services": {
    label: "Specialty Services",
    description: "Pest control, handyman work, painting, and specialty tasks",
  },
  "seasonal-guides": {
    label: "Seasonal Guides",
    description: "Month-by-month maintenance calendars and seasonal checklists",
  },
  "homeowner-tips": {
    label: "Homeowner Tips",
    description:
      "First-time homeowner guides, maintenance advice, and pro tips",
  },
  "cost-guides": {
    label: "Cost Guides",
    description:
      "Pricing breakdowns, budget calculators, and cost comparisons",
  },
  "strata-property-management": {
    label: "Strata & Property Management",
    description: "Guides for strata councils and property managers",
  },
  "local-okanagan": {
    label: "Local Okanagan",
    description:
      "Okanagan-specific home maintenance tips, climate advice, and local guides",
  },
};

export interface BlogPostFrontmatter {
  title: string;
  metaTitle?: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: BlogAuthor;
  category: BlogCategory;
  tags: string[];
  featuredImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  excerpt: string;
  readingTime?: number;
  relatedServices?: string[];
  relatedPosts?: string[];
  focusKeyword?: string;
  secondaryKeywords?: string[];
  faq?: Array<{ question: string; answer: string }>;
  tableOfContents?: boolean;
  featured?: boolean;
  draft?: boolean;
}

export interface BlogPost extends BlogPostFrontmatter {
  content: string;
  headings: Array<{
    id: string;
    text: string;
    level: number;
  }>;
}

export interface BlogPostCard {
  title: string;
  slug: string;
  description: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  featuredImage?: {
    src: string;
    alt: string;
  };
  featured?: boolean;
  author: BlogAuthor;
}
