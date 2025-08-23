
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Full HTML or Markdown content
  imageUrl?: string;
  author: string;
  authorId: string; // Link to the User ID
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

// --- New Auth System Types ---

export interface User {
  id: string;
  username: string;
  email: string;
  hashedPassword?: string; // Hashed password
  password?: string; // Plain text password for mock data
  companyId: string;
  mobile?: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
}

export type SignUpData = Omit<User, 'id' | 'companyId' | 'hashedPassword'> & {
  companyName: string;
  companyAddress: string;
};
