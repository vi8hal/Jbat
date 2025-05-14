import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Edit3, Youtube, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const features = [
    {
      title: "Generate New Blog Post",
      description: "Use AI to create engaging blog content from news articles or your own prompts.",
      href: "/admin/generate-blog",
      icon: FileText,
      cta: "Start Generating"
    },
    {
      title: "Content Editor",
      description: "Refine and edit your generated or existing blog posts before publishing.",
      href: "#", // Placeholder, will link to a list of posts or last edited
      icon: Edit3,
      cta: "Edit Content",
      disabled: true,
    },
    {
      title: "YouTube Script Generator",
      description: "Transform your articles into scripts ready for your next YouTube video.",
      href: "#", // Placeholder
      icon: Youtube,
      cta: "Create Script",
      disabled: true,
    }
  ];

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin! Manage your content creation workflow here.</p>
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

      {/* Placeholder for recent activity or stats */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12</p> {/* Mock Data */}
              <p className="text-xs text-muted-foreground">+2 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Edits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3</p> {/* Mock Data */}
               <Link href="#" className="text-xs text-primary hover:underline">View pending</Link>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scripts Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">5</p> {/* Mock Data */}
               <p className="text-xs text-muted-foreground">Last generated: 2 days ago</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
