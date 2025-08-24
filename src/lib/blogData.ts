
'use server';

import type { BlogPost, CreateBlogPostData } from './types';
import { db } from './db';
import { blogPosts, users } from './db/schema';
import { desc, eq, and, gt, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { subHours } from 'date-fns';

// Function to generate a simple slug
const generateSlug = async (title: string, idToExclude?: string): Promise<string> => {
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

  let finalSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existingPost = await db.query.blogPosts.findFirst({
        where: (posts, { and, eq, ne }) => and(
            eq(posts.slug, finalSlug),
            idToExclude ? ne(posts.id, idToExclude) : undefined
        )
    });
    if (!existingPost) {
      break;
    }
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  return finalSlug;
};

export async function getBlogPosts(authorId?: string): Promise<BlogPost[]> {
  const conditions = authorId ? eq(blogPosts.authorId, authorId) : undefined;
  
  const posts = await db.query.blogPosts.findMany({
    where: conditions,
    orderBy: [desc(blogPosts.date)],
  });

  return posts.map(post => ({
    ...post,
    date: post.date.toISOString(),
    isFeatured: post.isFeatured ?? false,
    featuredAt: post.featuredAt ? post.featuredAt.toISOString() : null,
  }));
}

export async function getLandingPageNews(): Promise<BlogPost | null> {
  const twentyFourHoursAgo = subHours(new Date(), 24);

  const featuredPost = await db.query.blogPosts.findFirst({
    where: and(
        eq(blogPosts.isFeatured, true),
        gt(blogPosts.featuredAt, twentyFourHoursAgo)
    ),
    orderBy: [desc(blogPosts.featuredAt)],
  });

  if (!featuredPost) {
    return null;
  }
  
  return {
    ...featuredPost,
    date: featuredPost.date.toISOString(),
    isFeatured: featuredPost.isFeatured ?? false,
    featuredAt: featuredPost.featuredAt ? featuredPost.featuredAt.toISOString() : null,
  };
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.id, id),
  });
  if (!post) return null;
  return {
    ...post,
    date: post.date.toISOString(),
    isFeatured: post.isFeatured ?? false,
    featuredAt: post.featuredAt ? post.featuredAt.toISOString() : null,
  };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.slug, slug),
  });
  if (!post) return null;
  return {
    ...post,
    date: post.date.toISOString(),
    isFeatured: post.isFeatured ?? false,
    featuredAt: post.featuredAt ? post.featuredAt.toISOString() : null,
  };
}

export async function addBlogPost(postData: CreateBlogPostData): Promise<BlogPost> {
  const slug = await generateSlug(postData.title);

  const newPostId = createId();

  const finalPostData = {
    id: newPostId,
    slug,
    title: postData.title,
    content: postData.content,
    excerpt: postData.excerpt || postData.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...',
    imageUrl: postData.imageUrl || `https://placehold.co/600x400.png`,
    imageHint: postData.imageHint || 'placeholder image',
    author: postData.author,
    authorId: postData.authorId,
    tags: JSON.stringify(postData.tags || []),
    isFeatured: postData.isFeatured || false,
    featuredAt: postData.isFeatured ? new Date() : null,
  };

  if (finalPostData.isFeatured) {
    // Unfeature all other posts
    await db.update(blogPosts).set({ isFeatured: false, featuredAt: null });
  }

  const [savedPost] = await db.insert(blogPosts).values(finalPostData).returning();

  return {
    ...savedPost,
    tags: JSON.parse(savedPost.tags as string),
    date: savedPost.date.toISOString(),
    isFeatured: savedPost.isFeatured ?? false,
    featuredAt: savedPost.featuredAt ? savedPost.featuredAt.toISOString() : null,
  };
}

type UpdateBlogPostData = Partial<Omit<BlogPost, 'id' | 'slug' | 'tags'> & { tags?: string[] }>;

export async function updateBlogPost(id: string, postData: UpdateBlogPostData): Promise<BlogPost | null> {
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
        return null;
    }

    const updatedValues: Record<string, any> = { ...postData };

    if (postData.title && postData.title !== existingPost.title) {
        updatedValues.slug = await generateSlug(postData.title, id);
    }
    
    if (postData.content && !postData.excerpt) {
        updatedValues.excerpt = postData.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';
    }

    if (postData.tags) {
        updatedValues.tags = JSON.stringify(postData.tags);
    }

    if (postData.isFeatured && !existingPost.isFeatured) {
        updatedValues.featuredAt = new Date();
        // Unfeature all other posts
        await db.update(blogPosts).set({ isFeatured: false, featuredAt: null }).where(ne(blogPosts.id, id));
    } else if (postData.isFeatured === false) {
        updatedValues.featuredAt = null;
    }

    const [updatedPost] = await db.update(blogPosts).set(updatedValues).where(eq(blogPosts.id, id)).returning();
    
    if (!updatedPost) return null;

    return {
        ...updatedPost,
        tags: JSON.parse(updatedPost.tags as string),
        date: updatedPost.date.toISOString(),
        isFeatured: updatedPost.isFeatured ?? false,
        featuredAt: updatedPost.featuredAt ? updatedPost.featuredAt.toISOString() : null,
    };
}


export async function deleteBlogPost(id: string): Promise<boolean> {
  const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
  // In Drizzle, `result` for delete might not give a clear success indicator,
  // so we assume success if no error is thrown.
  return true; 
}
