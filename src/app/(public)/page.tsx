
import type { BlogPost } from '@/lib/types';
import { getBlogPosts } from '@/lib/blogData';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function HomePage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="container mx-auto py-8 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight lg:text-5xl">Welcome to ContentGenius</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Your AI-powered partner for creating compelling blog content and YouTube scripts effortlessly.
        </p>
        <Button size="lg" asChild>
          <Link href="/admin/dashboard">Get Started</Link>
        </Button>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center border-b pb-4">Latest Articles</h2>
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => ( // Show only latest 3 on homepage
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No articles yet. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
