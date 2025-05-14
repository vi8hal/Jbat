import type { BlogPost } from '@/lib/types';
import AdSidebar from '@/components/layout/AdSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Tag, UserCircle } from 'lucide-react';
import Image from 'next/image';

// Mock function to get blog post by slug
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // In a real app, this would fetch from a database or CMS
  const mockBlogPosts: BlogPost[] = [
    {
      id: '1',
      slug: 'ai-in-content-creation',
      title: 'The Future of Content: How AI is Revolutionizing Creation',
      excerpt: 'Explore the transformative impact of artificial intelligence on content generation, from automated writing to personalized experiences.',
      content: `
        <p>Artificial intelligence (AI) is no longer a futuristic concept; it's a present-day reality reshaping numerous industries, and content creation is no exception. From automated journalism to AI-powered marketing copy, the landscape of how we produce and consume information is undergoing a profound transformation.</p>
        <h2 class="text-2xl font-semibold my-4">Understanding AI's Role in Content</h2>
        <p>AI algorithms can analyze vast amounts of data, understand context, and generate human-like text, images, and even video. This capability opens up a plethora of opportunities for content creators, marketers, and businesses.</p>
        <ul class="list-disc list-inside my-4 space-y-2">
          <li><strong>Automated Content Generation:</strong> Tools can now draft articles, product descriptions, and social media posts.</li>
          <li><strong>Personalization:</strong> AI can tailor content to individual user preferences, enhancing engagement.</li>
          <li><strong>Data Analysis and Insights:</strong> AI helps in understanding content performance and identifying trends.</li>
          <li><strong>Content Curation:</strong> AI can sift through massive volumes of information to find relevant content.</li>
        </ul>
        <p>While AI offers incredible efficiency, the human touch remains crucial for creativity, emotional depth, and strategic oversight. The future likely involves a synergistic relationship where AI augments human capabilities, rather than replacing them entirely.</p>
        <blockquote class="border-l-4 border-primary pl-4 italic my-6">
          "The best way to predict the future is to create it. AI gives us new tools to imagine and build that future of content."
        </blockquote>
        <p>As we move forward, ethical considerations, data privacy, and the potential for bias in AI-generated content will be critical areas to address. However, the potential for AI to democratize content creation and unlock new forms of storytelling is undeniable.</p>
      `,
      imageUrl: 'https://placehold.co/800x400.png',
      author: 'AI Insights Team',
      date: '2024-05-15T10:00:00Z',
      tags: ['AI', 'Content Creation', 'Future Tech', 'Innovation'],
    },
    // Add other mock posts if needed for testing different slugs
  ];
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
  return mockBlogPosts.find((post) => post.slug === slug) || null;
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <p className="text-muted-foreground">The blog post you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1 lg:w-2/3">
          {post.imageUrl && (
            <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={post.imageUrl}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint="article hero image"
              />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
          
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
        
        <div className="lg:w-1/3 lg:sticky lg:top-24 self-start">
          <AdSidebar />
        </div>
      </div>
    </div>
  );
}

// Optional: Generate static paths if you have a known set of blog posts
// export async function generateStaticParams() {
//   // Fetch all blog post slugs
//   const posts = [{ slug: 'ai-in-content-creation' } /* ...other slugs */];
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }
