
import type { BlogPost } from './types';
import { mockUsers } from './auth'; // Import mock users to get author info

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
    // Posts for User 1 (tech_writer)
    {
        id: '1',
        slug: 'the-future-of-ai-in-tech',
        title: 'The Future of AI in the Tech Industry',
        excerpt: 'A deep dive into how Artificial Intelligence is shaping the future of technology, from development to deployment.',
        content: '<p>The tech industry is on the brink of a massive transformation, all thanks to AI...</p>',
        authorId: 'user-01',
        author: 'Tech Writer',
        date: '2024-05-20T10:00:00Z',
        tags: ['AI', 'Tech', 'Innovation'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'futuristic technology',
        isFeatured: true,
        featuredAt: new Date().toISOString(),
    },
    {
        id: '2',
        slug: 'cloud-computing-trends-2024',
        title: 'Top Cloud Computing Trends to Watch in 2024',
        excerpt: 'Cloud computing continues to evolve. Here are the top trends that businesses should be paying attention to this year.',
        content: '<p>Cloud computing is more than just storage; it\'s a paradigm for modern business operations...</p>',
        authorId: 'user-01',
        author: 'Tech Writer',
        date: '2024-04-15T11:00:00Z',
        tags: ['Cloud', 'SaaS', 'Infrastructure'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'cloud data',
    },
    // Posts for User 2 (finance_guru)
    {
        id: '3',
        slug: 'fintech-disruption',
        title: 'How FinTech is Disrupting Traditional Banking',
        excerpt: 'FinTech startups are changing the financial landscape with innovative solutions. Are traditional banks ready to adapt?',
        content: '<p>The world of finance is experiencing a seismic shift, driven by technology...</p>',
        authorId: 'user-02',
        author: 'Finance Guru',
        date: '2024-05-18T14:00:00Z',
        tags: ['FinTech', 'Banking', 'Investment'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'financial technology',
    },
    {
        id: '4',
        slug: 'navigating-market-volatility',
        title: 'Strategies for Navigating Market Volatility',
        excerpt: 'In times of economic uncertainty, a sound investment strategy is more important than ever. Here’s how to navigate the waves.',
        content: '<p>Market volatility can be daunting, but with the right approach, it can also present opportunities...</p>',
        authorId: 'user-02',
        author: 'Finance Guru',
        date: '2024-04-22T09:30:00Z',
        tags: ['Markets', 'Investing', 'Strategy'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'stock market chart',
    },
    // Posts for User 3 (health_expert)
    {
        id: '5',
        slug: 'telemedicine-revolution',
        title: 'The Telemedicine Revolution: Healthcare from Home',
        excerpt: 'The pandemic accelerated the adoption of telemedicine. What does the future hold for virtual healthcare?',
        content: '<p>Access to healthcare is being redefined by digital platforms...</p>',
        authorId: 'user-03',
        author: 'Health Expert',
        date: '2024-05-19T08:00:00Z',
        tags: ['Telemedicine', 'HealthTech', 'Wellness'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'doctor online',
    },
    {
        id: '6',
        slug: 'mental-health-in-the-workplace',
        title: 'Prioritizing Mental Health in the Modern Workplace',
        excerpt: 'Companies are beginning to understand the importance of mental wellness. Here’s how to create a supportive work environment.',
        content: '<p>A healthy workforce is a productive workforce. This includes mental well-being...</p>',
        authorId: 'user-03',
        author: 'Health Expert',
        date: '2024-04-25T16:00:00Z',
        tags: ['Mental Health', 'Workplace', 'HR'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'calm office',
    },
    // Posts for User 4 (green_advocate)
    {
        id: '7',
        slug: 'sustainable-energy-solutions',
        title: 'The Rise of Sustainable Energy Solutions',
        excerpt: 'From solar to wind, renewable energy is becoming more accessible and affordable. What’s driving this green transition?',
        content: '<p>The global shift towards sustainability is powering innovation in the energy sector...</p>',
        authorId: 'user-04',
        author: 'Green Advocate',
        date: '2024-05-17T12:00:00Z',
        tags: ['Sustainability', 'Renewable Energy', 'Climate'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'wind turbines',
    },
    {
        id: '8',
        slug: 'eco-friendly-business-practices',
        title: 'Eco-Friendly Practices for Modern Businesses',
        excerpt: 'Sustainability isn’t just good for the planet; it’s good for business. Here are some practices to implement.',
        content: '<p>Integrating sustainability into your business model can lead to long-term success...</p>',
        authorId: 'user-04',
        author: 'Green Advocate',
        date: '2024-04-28T14:00:00Z',
        tags: ['Eco-Friendly', 'Business', 'CSR'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'green office',
    },
    // Posts for User 5 (retail_innovator)
    {
        id: '9',
        slug: 'future-of-e-commerce',
        title: 'The Future of E-commerce: AI and Personalization',
        excerpt: 'AI-driven personalization is the next frontier in e-commerce. How can retailers leverage it to boost sales?',
        content: '<p>The online shopping experience is becoming smarter, faster, and more personal...</p>',
        authorId: 'user-05',
        author: 'Retail Innovator',
        date: '2024-05-16T15:00:00Z',
        tags: ['E-commerce', 'Retail', 'AI'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'online shopping',
    },
    {
        id: '10',
        slug: 'brick-and-mortar-reimagined',
        title: 'Reimagining the Brick-and-Mortar Experience',
        excerpt: 'Physical retail isn’t dead; it’s evolving. Discover how stores are using technology to create immersive experiences.',
        content: '<p>In an age of e-commerce, physical stores must offer more than just products...</p>',
        authorId: 'user-05',
        author: 'Retail Innovator',
        date: '2024-04-30T10:00:00Z',
        tags: ['Retail', 'CX', 'Technology'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'modern store',
    },
    // Posts for User 6 (travel_blogger)
    {
        id: '11',
        slug: 'hidden-gems-of-southeast-asia',
        title: 'Hidden Gems of Southeast Asia',
        excerpt: 'Beyond the tourist hotspots lies a world of adventure. Here are some of the best-kept secrets of Southeast Asia.',
        content: '<p>Looking for a unique travel experience? Let\'s explore off the beaten path...</p>',
        authorId: 'user-06',
        author: 'Travel Blogger',
        date: '2024-05-14T18:00:00Z',
        tags: ['Travel', 'Adventure', 'Asia'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'tropical beach',
    },
    {
        id: '12',
        slug: 'sustainable-tourism',
        title: 'How to Be a More Sustainable Tourist',
        excerpt: 'Travel is a privilege. Here’s how you can explore the world while minimizing your impact on the environment and local communities.',
        content: '<p>Sustainable tourism is about making conscious choices to protect the places we love...</p>',
        authorId: 'user-06',
        author: 'Travel Blogger',
        date: '2024-04-20T13:00:00Z',
        tags: ['Sustainable Travel', 'Ecotourism', 'Responsible Tourism'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'nature trail',
    },
    // Posts for User 7 (food_critic)
    {
        id: '13',
        slug: 'the-rise-of-ghost-kitchens',
        title: 'The Rise of Ghost Kitchens and Virtual Restaurants',
        excerpt: 'The restaurant industry is adapting with delivery-only models. What does this mean for diners and chefs?',
        content: '<p>Ghost kitchens are changing the way we eat, one delivery at a time...</p>',
        authorId: 'user-07',
        author: 'Food Critic',
        date: '2024-05-12T20:00:00Z',
        tags: ['Food', 'Restaurants', 'FoodTech'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'food delivery',
    },
    {
        id: '14',
        slug: 'plant-based-diet-trends',
        title: 'The Hottest Trends in Plant-Based Dining',
        excerpt: 'From gourmet vegan cheese to mushroom steaks, the plant-based food scene has never been more exciting.',
        content: '<p>Plant-based eating has gone mainstream, and chefs are getting creative...</p>',
        authorId: 'user-07',
        author: 'Food Critic',
        date: '2024-04-18T19:00:00Z',
        tags: ['Vegan', 'Plant-Based', 'Food Trends'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'vegan dish',
    },
    // Posts for User 8 (auto_enthusiast)
    {
        id: '15',
        slug: 'electric-vehicle-revolution',
        title: 'The EV Revolution: Are We There Yet?',
        excerpt: 'Electric vehicles are the future, but what challenges remain for mass adoption? We look at the state of the EV market.',
        content: '<p>The shift to electric vehicles is accelerating, but roadblocks remain...</p>',
        authorId: 'user-08',
        author: 'Auto Enthusiast',
        date: '2024-05-10T11:00:00Z',
        tags: ['EV', 'Automotive', 'Technology'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'electric car',
    },
    {
        id: '16',
        slug: 'classic-cars-in-the-modern-age',
        title: 'The Allure of Classic Cars in the Modern Age',
        excerpt: 'Why do classic cars continue to captivate us? A look at the culture and community behind these timeless machines.',
        content: '<p>In an era of high-tech vehicles, the appeal of classic cars is stronger than ever...</p>',
        authorId: 'user-08',
        author: 'Auto Enthusiast',
        date: '2024-04-12T15:00:00Z',
        tags: ['Classic Cars', 'Culture', 'Automotive'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'classic car',
    },
    // Posts for User 9 (realestate_pro)
    {
        id: '17',
        slug: 'proptech-innovations',
        title: 'PropTech: How Technology is Shaping Real Estate',
        excerpt: 'From virtual tours to blockchain transactions, technology is transforming the real estate industry.',
        content: '<p>The real estate market is undergoing a digital revolution, thanks to PropTech...</p>',
        authorId: 'user-09',
        author: 'RealEstate Pro',
        date: '2024-05-08T09:00:00Z',
        tags: ['PropTech', 'Real Estate', 'Technology'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'modern house',
    },
    {
        id: '18',
        slug: 'housing-market-forecast-2024',
        title: '2024 Housing Market Forecast',
        excerpt: 'Interest rates, inventory, and economic factors: what can we expect from the housing market for the rest of the year?',
        content: '<p>Predicting the housing market is never easy, but certain indicators can give us a clue...</p>',
        authorId: 'user-09',
        author: 'RealEstate Pro',
        date: '2024-04-05T17:00:00Z',
        tags: ['Housing Market', 'Forecast', 'Real Estate'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'house for sale',
    },
    // Posts for User 10 (media_maven)
    {
        id: '19',
        slug: 'future-of-streaming-wars',
        title: 'The Future of the Streaming Wars',
        excerpt: 'With so many services competing for our attention, what does the future hold for streaming media?',
        content: '<p>The battle for streaming supremacy is heating up, and consumers are caught in the middle...</p>',
        authorId: 'user-10',
        author: 'Media Maven',
        date: '2024-05-05T14:00:00Z',
        tags: ['Streaming', 'Media', 'Entertainment'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'tv streaming',
    },
    {
        id: '20',
        slug: 'the-creator-economy',
        title: 'Navigating the Creator Economy',
        excerpt: 'The creator economy has opened up new career paths. What does it take to succeed in this dynamic field?',
        content: '<p>From YouTubers to podcasters, creators are the new entrepreneurs...</p>',
        authorId: 'user-10',
        author: 'Media Maven',
        date: '2024-04-01T12:00:00Z',
        tags: ['Creator Economy', 'Social Media', 'Digital Marketing'],
        imageUrl: 'https://placehold.co/800x400.png',
        imageHint: 'social media icons',
    }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getBlogPosts(authorId?: string): Promise<BlogPost[]> {
  await delay(100);
  let posts = [...mockBlogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (authorId) {
    posts = posts.filter(p => p.authorId === authorId);
  }
  return posts;
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
    authorId: postData.authorId,
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
