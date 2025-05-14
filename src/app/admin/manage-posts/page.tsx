
'use client';

import type { BlogPost } from '@/lib/types';
import { getBlogPosts, deleteBlogPost } from '@/lib/blogData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Eye, MoreHorizontal, PlusCircle, YoutubeIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store ID of post being deleted
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await getBlogPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch posts.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    setIsDeleting(postId);
    try {
      const success = await deleteBlogPost(postId);
      if (success) {
        toast({ title: "Success", description: "Post deleted successfully." });
        startTransition(() => {
          fetchPosts(); // Re-fetch posts
        });
      } else {
        toast({ title: "Error", description: "Failed to delete post.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred while deleting the post.", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Blog Posts</h1>
          <p className="text-muted-foreground">View, edit, and delete your blog content.</p>
        </div>
        <Button asChild>
          <Link href="/admin/generate-blog">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
          </Link>
        </Button>
      </header>

      <Card className="paper-shadow">
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>A list of all blog posts in your system.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No posts found. <Link href="/admin/generate-blog" className="text-primary hover:underline">Create one now!</Link></p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="hover:underline" title={post.title}>
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 2).map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                        {post.tags && post.tags.length > 2 && <Badge variant="outline" className="text-xs">+{post.tags.length - 2}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting === post.id || isPending}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${post.slug}`} target="_blank"><Eye className="mr-2 h-4 w-4" />View Post</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/edit-blog/${post.id}`}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/youtube-script/${post.id}?title=${encodeURIComponent(post.title)}&content=${encodeURIComponent(post.content)}`}>
                               <YoutubeIcon className="mr-2 h-4 w-4" />Generate Script
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 px-2 py-1.5 h-auto text-sm font-normal" disabled={isDeleting === post.id || isPending}>
                                <Trash2 className="mr-2 h-4 w-4" />Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the blog post titled "{post.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting === post.id}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePost(post.id)}
                                  disabled={isDeleting === post.id}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  {isDeleting === post.id ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {posts.length > 0 && (
          <CardFooter className="text-xs text-muted-foreground">
            Showing {posts.length} post{posts.length === 1 ? '' : 's'}.
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
