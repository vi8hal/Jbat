
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
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}
