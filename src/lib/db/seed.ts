
import 'dotenv/config';
import { db } from './index';
import { users, companies, blogPosts } from './schema';
import bcrypt from 'bcryptjs';
import { createId } from '@paralleldrive/cuid2';

const mockCompanies = [
  { id: 'company-01', name: 'Innovate Inc.', address: '123 Tech Ave' },
  { id: 'company-02', name: 'Quantum Finance', address: '456 Wall St' },
  { id: 'company-03', name: 'Vitality Health', address: '789 Wellness Blvd' },
  { id: 'company-04', name: 'Eco Solutions', address: '101 Green Way' },
  { id: 'company-05', name: 'RetailNext', address: '212 Market St' },
  { id: 'company-06', name: 'Wanderlust Travels', address: '303 Adventure Rd' },
  { id: 'company-07', name: 'Gourmet Group', address: '404 Eatery Ln' },
  { id: 'company-08', name: 'AutoMotion', address: '505 Piston Dr' },
  { id: 'company-09', name: 'Homestead Realty', address: '606 Property Plz' },
  { id: 'company-10', name: 'Media Stream', address: '707 Broadcast Bld' },
];

const mockUsersRaw = [
  { id: 'user-01', username: 'tech_writer', email: 'tech@innovate.com', password: 'password123', companyId: 'company-01', mobile: '111-222-3333' },
  { id: 'user-02', username: 'finance_guru', email: 'fin@quantum.com', password: 'password123', companyId: 'company-02', mobile: '222-333-4444' },
  { id: 'user-03', username: 'health_expert', email: 'health@vitality.com', password: 'password123', companyId: 'company-03', mobile: '333-444-5555' },
  { id: 'user-04', username: 'green_advocate', email: 'eco@solutions.com', password: 'password123', companyId: 'company-04', mobile: '444-555-6666' },
  { id: 'user-05', username: 'retail_innovator', email: 'shop@retailnext.com', password: 'password123', companyId: 'company-05', mobile: '555-666-7777' },
  { id: 'user-06', username: 'travel_blogger', email: 'go@wanderlust.com', password: 'password123', companyId: 'company-06', mobile: '666-777-8888' },
  { id: 'user-07', username: 'food_critic', email: 'eat@gourmet.com', password: 'password123', companyId: 'company-07', mobile: '777-888-9999' },
  { id: 'user-08', username: 'auto_enthusiast', email: 'drive@automotion.com', password: 'password123', companyId: 'company-08', mobile: '888-999-0000' },
  { id: 'user-09', username: 'realestate_pro', email: 'sell@homestead.com', password: 'password123', companyId: 'company-09', mobile: '999-000-1111' },
  { id: 'user-10', username: 'media_maven', email: 'watch@mediastream.com', password: 'password123', companyId: 'company-10', mobile: '000-111-2222' },
];

const mockBlogPostsRaw = [
    { id: '1', slug: 'the-future-of-ai-in-tech', title: 'The Future of AI in the Tech Industry', excerpt: 'A deep dive into how Artificial Intelligence is shaping the future of technology, from development to deployment.', content: '<p>The tech industry is on the brink of a massive transformation, all thanks to AI...</p>', authorId: 'user-01', author: 'tech_writer', date: '2024-05-20T10:00:00Z', tags: ['AI', 'Tech', 'Innovation'], imageUrl: 'https://placehold.co/800x400.png', imageHint: 'futuristic technology', isFeatured: true, featuredAt: new Date().toISOString() },
    { id: '2', slug: 'cloud-computing-trends-2024', title: 'Top Cloud Computing Trends to Watch in 2024', excerpt: 'Cloud computing continues to evolve. Here are the top trends that businesses should be paying attention to this year.', content: '<p>Cloud computing is more than just storage; it\'s a paradigm for modern business operations...</p>', authorId: 'user-01', author: 'tech_writer', date: '2024-04-15T11:00:00Z', tags: ['Cloud', 'SaaS', 'Infrastructure'], imageUrl: 'https://placehold.co/800x400.png', imageHint: 'cloud data', isFeatured: false },
    { id: '3', slug: 'fintech-disruption', title: 'How FinTech is Disrupting Traditional Banking', excerpt: 'FinTech startups are changing the financial landscape with innovative solutions. Are traditional banks ready to adapt?', content: '<p>The world of finance is experiencing a seismic shift, driven by technology...</p>', authorId: 'user-02', author: 'finance_guru', date: '2024-05-18T14:00:00Z', tags: ['FinTech', 'Banking', 'Investment'], imageUrl: 'https://placehold.co/800x400.png', imageHint: 'financial technology', isFeatured: false },
    { id: '4', slug: 'navigating-market-volatility', title: 'Strategies for Navigating Market Volatility', excerpt: 'In times of economic uncertainty, a sound investment strategy is more important than ever. Here’s how to navigate the waves.', content: '<p>Market volatility can be daunting, but with the right approach, it can also present opportunities...</p>', authorId: 'user-02', author: 'finance_guru', date: '2024-04-22T09:30:00Z', tags: ['Markets', 'Investing', 'Strategy'], imageUrl: 'https://placehold.co/800x400.png', imageHint: 'stock market chart', isFeatured: false },
    { id: '5', slug: 'telemedicine-revolution', title: 'The Telemedicine Revolution: Healthcare from Home', excerpt: 'The pandemic accelerated the adoption of telemedicine. What does the future hold for virtual healthcare?', content: '<p>Access to healthcare is being redefined by digital platforms...</p>', authorId: 'user-03', author: 'health_expert', date: '2024-05-19T08:00:00Z', tags: ['Telemedicine', 'HealthTech', 'Wellness'], imageUrl: 'https://placehold.co/800x400.png', imageHint: 'doctor online', isFeatured: false },
];


async function main() {
    console.log("Seeding database...");

    // Clear existing data
    await db.delete(blogPosts);
    await db.delete(users);
    await db.delete(companies);
    console.log("Cleared existing data.");

    // Seed companies
    await db.insert(companies).values(mockCompanies);
    console.log(`Seeded ${mockCompanies.length} companies.`);

    // Hash passwords and seed users
    const hashedUsers = await Promise.all(
        mockUsersRaw.map(async (user) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            hashedPassword: await bcrypt.hash(user.password, 10),
            companyId: user.companyId,
            mobile: user.mobile,
        }))
    );
    await db.insert(users).values(hashedUsers);
    console.log(`Seeded ${hashedUsers.length} users.`);

    // Seed blog posts
    const postsToInsert = mockBlogPostsRaw.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        authorId: p.authorId,
        author: p.author,
        date: new Date(p.date),
        tags: JSON.stringify(p.tags),
        imageUrl: p.imageUrl,
        imageHint: p.imageHint,
        isFeatured: p.isFeatured,
        featuredAt: p.featuredAt ? new Date(p.featuredAt) : null,
    }));
    await db.insert(blogPosts).values(postsToInsert);
    console.log(`Seeded ${postsToInsert.length} blog posts.`);


    console.log("Database seeding complete!");
}

main().catch((e) => {
    console.error("Failed to seed database:", e);
    process.exit(1);
});
