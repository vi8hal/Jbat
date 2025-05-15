
import type { BlogPost } from './types';

// Function to generate a simple slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

let mockBlogPosts: BlogPost[] = [
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
    imageHint: 'article hero image',
    author: 'AI Insights Team',
    date: '2024-05-15T10:00:00Z',
    tags: ['AI', 'Content Creation', 'Future Tech', 'Innovation'],
    isFeatured: false,
    featuredAt: null,
  },
  {
    id: '2',
    slug: 'mastering-youtube-scripts',
    title: 'From Blog to Blockbuster: Crafting Engaging YouTube Scripts',
    excerpt: 'Learn the art of transforming your blog posts into captivating YouTube scripts that keep your audience hooked.',
    content: '<p>Full content here about YouTube scripts...</p>',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'video production',
    author: 'Video Virtuoso',
    date: '2024-05-10T14:30:00Z',
    tags: ['YouTube', 'Video Scripting', 'Content Marketing'],
    isFeatured: true,
    featuredAt: new Date().toISOString(), // Featured for demo
  },
  {
    id: '3',
    slug: 'the-power-of-prompts',
    title: 'Unlocking Creativity: The Power of Effective AI Prompts',
    excerpt: 'Discover how well-crafted prompts can unleash the full potential of AI content generators, leading to more relevant and engaging articles.',
    content: '<p>Full content here about AI prompts...</p>',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'creative lightbulb',
    author: 'Prompt Engineer Pro',
    date: '2024-05-05T09:15:00Z',
    tags: ['AI Prompts', 'Creativity', 'Content Generation'],
    isFeatured: false,
    featuredAt: null,
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getBlogPosts(): Promise<BlogPost[]> {
  await delay(100); // Simulate network delay
  return [...mockBlogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getLandingPageNews(): Promise<BlogPost | null> {
  await delay(50);
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const featuredPosts = mockBlogPosts
    .filter(post => post.isFeatured && post.featuredAt && new Date(post.featuredAt) > twentyFourHoursAgo)
    .sort((a, b) => new Date(b.featuredAt!).getTime() - new Date(a.featuredAt!).getTime());
  
  return featuredPosts.length > 0 ? { ...featuredPosts[0] } : null;
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  await delay(50);
  const post = mockBlogPosts.find((post) => post.id === id);
  return post ? {...post} : null;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  await delay(50);
  const post = mockBlogPosts.find((post) => post.slug === slug);
  return post ? {...post} : null;
}

type CreateBlogPostData = Omit<BlogPost, 'id' | 'slug' | 'date'> & { date?: string };

export async function addBlogPost(postData: CreateBlogPostData): Promise<BlogPost> {
  await delay(200);
  const newId = String(Date.now() + Math.random()); 
  const slug = generateSlug(postData.title);
  let finalSlug = slug;
  let counter = 1;
  while (mockBlogPosts.some(p => p.slug === finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  
  const newPost: BlogPost = {
    id: newId,
    slug: finalSlug,
    title: postData.title,
    content: postData.content,
    excerpt: postData.excerpt || postData.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...',
    imageUrl: postData.imageUrl || `https://placehold.co/600x400.png`,
    imageHint: postData.imageHint || 'placeholder image',
    author: postData.author || 'Admin',
    date: postData.date || new Date().toISOString(),
    tags: postData.tags || [],
    isFeatured: postData.isFeatured || false,
    featuredAt: postData.featuredAt || null,
  };

  // If this post is being featured, unfeature any other currently featured posts
  if (newPost.isFeatured) {
    mockBlogPosts.forEach(p => {
      if (p.id !== newPost.id) p.isFeatured = false;
    });
  }

  mockBlogPosts.unshift(newPost);
  return {...newPost};
}

type UpdateBlogPostData = Partial<Omit<BlogPost, 'id' | 'slug'>> & { title?: string };

export async function updateBlogPost(id: string, postData: UpdateBlogPostData): Promise<BlogPost | null> {
  await delay(200);
  const postIndex = mockBlogPosts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    return null;
  }

  const existingPost = mockBlogPosts[postIndex];
  const updatedPostData = { ...existingPost, ...postData };

  if (postData.title && postData.title !== existingPost.title) {
    const newSlug = generateSlug(postData.title);
    let finalSlug = newSlug;
    let counter = 1;
    while (mockBlogPosts.some(p => p.id !== id && p.slug === finalSlug)) {
      finalSlug = `${newSlug}-${counter}`;
      counter++;
    }
    updatedPostData.slug = finalSlug;
  }
  
  if (postData.content && !postData.excerpt) {
    updatedPostData.excerpt = postData.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';
  }

  // If this post is being featured, unfeature any other currently featured posts
  if (updatedPostData.isFeatured && updatedPostData.id) {
     mockBlogPosts.forEach(p => {
      if (p.id !== updatedPostData.id) {
        p.isFeatured = false; 
        // p.featuredAt = null; // Optionally reset featuredAt for others
      }
    });
  }

  mockBlogPosts[postIndex] = updatedPostData;
  return {...updatedPostData};
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  await delay(200);
  const initialLength = mockBlogPosts.length;
  mockBlogPosts = mockBlogPosts.filter((post) => post.id !== id);
  return mockBlogPosts.length < initialLength;
}
