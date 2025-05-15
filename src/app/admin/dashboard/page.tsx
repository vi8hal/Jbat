
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Edit3, Youtube, ArrowRight, ListOrdered } from 'lucide-react';
import { getBlogPosts } from '@/lib/blogData'; // To get counts
import DashboardHeaderActions from '@/components/admin/DashboardHeaderActions';

export default async function AdminDashboardPage() {
  const posts = await getBlogPosts(); // Fetch posts for stats

  const features = [
    {
      title: "Generate New Blog Post",
      description: "Use AI to create engaging blog content from news articles or your own prompts.",
      href: "/admin/generate-blog",
      icon: FileText,
      cta: "Start Generating"
    },
    {
      title: "Manage Blog Posts",
      description: "View, edit, or delete your existing blog posts.",
      href: "/admin/manage-posts", 
      icon: ListOrdered,
      cta: "View Posts",
      disabled: false,
    },
    {
      title: "YouTube Script Generator",
      description: "Transform your articles into scripts ready for your next YouTube video.",
      href: "/admin/manage-posts", // Should ideally link to a page where user selects a post first
      icon: Youtube,
      cta: "Select Post for Script", // Updated CTA
      disabled: false, // Enable if manage-posts allows selecting post for script
    }
  ];

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin! Manage your content creation workflow here.</p>
        </div>
        <DashboardHeaderActions />
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="w-8 h-8 text-primary" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Additional content or stats can go here */}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" disabled={feature.disabled}>
                <Link href={feature.href}>
                  {feature.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{posts.length}</p>
              {/* <p className="text-xs text-muted-foreground">+2 this month</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Last Post Date</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {posts.length > 0 ? new Date(posts[0].date).toLocaleDateString() : 'N/A'}
              </p>
               <Link href="/admin/manage-posts" className="text-xs text-primary hover:underline">View all posts</Link>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scripts (Coming Soon)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p> 
               <p className="text-xs text-muted-foreground">Functionality under development</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
