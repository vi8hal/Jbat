

import { JwtPayload } from "jsonwebtoken";
import type { users, companies, blogPosts } from './db/schema';
import type { InferSelectModel } from 'drizzle-orm';


// Raw database types
export type DbUser = InferSelectModel<typeof users>;
export type DbCompany = InferSelectModel<typeof companies>;
export type DbBlogPost = InferSelectModel<typeof blogPosts>;


export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string; // Full HTML or Markdown content
  imageUrl?: string | null;
  author: string;
  authorId: string; // Link to the User ID
  date: string; // ISO string representation of date
  tags?: string[];
  imageHint?: string | null; // For data-ai-hint
  isFeatured: boolean; // True if this post is to be featured on the landing page
  featuredAt?: string | null; // ISO string, time when it was marked as featured
}

export type CreateBlogPostData = Omit<BlogPost, 'id' | 'slug' | 'date' | 'isFeatured' | 'featuredAt'> & {
  isFeatured?: boolean;
};


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
  mobile?: string | null;
}

// Extending User to be used as JWT payload
export interface UserJwtPayload extends User, JwtPayload {}


export interface Company {
  id: string;
  name: string;
  address: string;
}

export type SignUpData = Omit<User, 'id' | 'companyId' | 'hashedPassword'> & {
  companyName: string;
  companyAddress: string;
};
