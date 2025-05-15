
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Full HTML or Markdown content
  imageUrl?: string;
  author: string;
  date: string; // ISO string representation of date
  tags?: string[];
  imageHint?: string; // For data-ai-hint
  isFeatured?: boolean; // True if this post is to be featured on the landing page
  featuredAt?: string | null; // ISO string, time when it was marked as featured
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}
