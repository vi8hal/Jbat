
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ListOrdered, Youtube, ArrowRight } from 'lucide-react';
import { getBlogPosts } from '@/lib/blogData';
import DashboardHeaderActions from '@/components/admin/DashboardHeaderActions';
import { checkAuth } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import type { User, BlogPost } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


export default function AdminDashboardPage() {
  const [user, setUser] = useState<Omit<User, 'hashedPassword' | 'password'> | null>(null);
  const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticatedUser = checkAuth();
    if (!authenticatedUser) {
      redirect('/login');
    } else {
      setUser(authenticatedUser);
      const fetchPosts = async () => {
        setIsLoading(true);
        const [userPostsData, allPostsData] = await Promise.all([
            getBlogPosts(authenticatedUser.id),
            getBlogPosts()
        ]);
        setUserPosts(userPostsData);
        setAllPosts(allPostsData);
        setIsLoading(false);
      };
      fetchPosts();
    }
  }, []);
  
  if (isLoading || !user) {
    return (
        <div className="space-y-8">
            <header className="pb-4 border-b flex justify-between items-start">
                <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <Skeleton className="h-10 w-10" />
            </header>
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-60 w-full" />)}
            </section>
             <section>
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </section>
        </div>
    );
  }

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
      href: "/admin/manage-posts", 
      icon: Youtube,
      cta: "Select Post for Script", 
      disabled: false, 
    }
  ];

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.username}! Manage your content here.</p>
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
              <CardTitle className="text-lg">Your Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userPosts.length}</p>
              <p className="text-xs text-muted-foreground">You have {userPosts.length} published articles.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="text-lg">Total Posts on Platform</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{allPosts.length}</p>
                <Link href="/blog" target="_blank" className="text-xs text-primary hover:underline">View all posts</Link>
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
