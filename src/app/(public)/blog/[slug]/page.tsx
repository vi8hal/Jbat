
import type { BlogPost } from '@/lib/types';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blogData';
import AdSidebar from '@/components/layout/AdSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Tag, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid lg:grid-cols-4 gap-8">
        <article className="lg:col-span-3">
          {post.imageUrl && (
            <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
                data-ai-hint={post.imageHint || "article hero image"}
              />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <UserCircle className="mr-1.5 h-5 w-5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-1.5 h-5 w-5" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        
        <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start">
          <AdSidebar />
        </aside>
      </div>
    </div>
  );
}

// Optional: Generate static paths if you have a known set of blog posts
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
