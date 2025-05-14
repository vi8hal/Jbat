import type { BlogPost } from '@/lib/types';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data for blog posts
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'ai-in-content-creation',
    title: 'The Future of Content: How AI is Revolutionizing Creation',
    excerpt: 'Explore the transformative impact of artificial intelligence on content generation, from automated writing to personalized experiences.',
    content: '<p>Full content here...</p>',
    imageUrl: 'https://placehold.co/600x400.png',
    author: 'AI Insights Team',
    date: '2024-05-15T10:00:00Z',
    tags: ['AI', 'Content Creation', 'Future Tech'],
  },
  {
    id: '2',
    slug: 'mastering-youtube-scripts',
    title: 'From Blog to Blockbuster: Crafting Engaging YouTube Scripts',
    excerpt: 'Learn the art of transforming your blog posts into captivating YouTube scripts that keep your audience hooked.',
    content: '<p>Full content here...</p>',
    imageUrl: 'https://placehold.co/600x400.png',
    author: 'Video Virtuoso',
    date: '2024-05-10T14:30:00Z',
    tags: ['YouTube', 'Video Scripting', 'Content Marketing'],
  },
  {
    id: '3',
    slug: 'the-power-of-prompts',
    title: 'Unlocking Creativity: The Power of Effective AI Prompts',
    excerpt: 'Discover how well-crafted prompts can unleash the full potential of AI content generators, leading to more relevant and engaging articles.',
    content: '<p>Full content here...</p>',
    imageUrl: 'https://placehold.co/600x400.png',
    author: 'Prompt Engineer Pro',
    date: '2024-05-05T09:15:00Z',
    tags: ['AI Prompts', 'Creativity', 'Content Generation'],
  },
];


export default function HomePage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
