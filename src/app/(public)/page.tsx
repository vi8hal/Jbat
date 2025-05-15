
import type { BlogPost } from '@/lib/types';
import { getBlogPosts, getLandingPageNews } from '@/lib/blogData';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Megaphone, CalendarDays, UserCircle } from 'lucide-react';

export default async function HomePage() {
  const featuredPost = await getLandingPageNews();
  const allPosts = await getBlogPosts();

  let latestPostsForGrid: BlogPost[];
  if (featuredPost) {
    latestPostsForGrid = allPosts.filter(p => p.id !== featuredPost.id).slice(0, 3);
  } else {
    latestPostsForGrid = allPosts.slice(0, 3);
  }

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

      {featuredPost && (
        <section className="mb-16 p-6 bg-secondary/50 rounded-lg shadow-lg paper-shadow">
          <div className="flex items-center text-primary mb-4">
            <Megaphone className="h-6 w-6 mr-2" />
            <h2 className="text-2xl font-semibold">Featured News (Live for 24hrs)</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {featuredPost.imageUrl && (
              <div className="md:w-1/3 relative h-60 w-full md:h-auto md:aspect-[4/3] rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  data-ai-hint={featuredPost.imageHint || "featured news"}
                  priority
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-2 leading-tight hover:text-primary transition-colors">
                <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
                <div className="flex items-center">
                  <UserCircle className="mr-1 h-4 w-4" />
                  <span>{featuredPost.author}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  <span>{new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                 {featuredPost.featuredAt && (
                  <div className="flex items-center text-primary-focus font-medium">
                     <Megaphone className="mr-1 h-4 w-4" /> 
                    Featured: {new Date(featuredPost.featuredAt).toLocaleTimeString()}
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mb-4 line-clamp-4">{featuredPost.excerpt}</p>
              <Button asChild variant="link" className="px-0 text-primary">
                <Link href={`/blog/${featuredPost.slug}`}>Read Full Story &rarr;</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center border-b pb-4">
          {featuredPost ? "More Latest Articles" : "Latest Articles"}
        </h2>
        {latestPostsForGrid.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPostsForGrid.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            {allPosts.length > 0 && featuredPost ? "No other articles to display right now." : "No articles yet. Check back soon!"}
          </p>
        )}
         {allPosts.length === 0 && !featuredPost && (
             <p className="text-center text-muted-foreground">No articles yet. Check back soon!</p>
         )}
      </section>
    </div>
  );
}
