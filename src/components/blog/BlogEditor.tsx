
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Youtube, Loader2, Trash2, Eye, TagsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addBlogPost, getBlogPostById, updateBlogPost, deleteBlogPost } from '@/lib/blogData';
import type { BlogPost } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface BlogEditorProps {
  initialTitleProp?: string;
  initialContentProp?: string;
  blogId: string; // 'new' or an actual ID
}

export default function BlogEditor({ initialTitleProp = '', initialContentProp = '', blogId }: BlogEditorProps) {
  const [title, setTitle] = useState(initialTitleProp);
  const [content, setContent] = useState(initialContentProp);
  const [author, setAuthor] = useState('Admin'); // Default author
  const [tagsString, setTagsString] = useState(''); // Comma-separated tags
  const [imageUrl, setImageUrl] = useState('');
  const [imageHint, setImageHint] = useState('');
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (blogId !== 'new') {
      setIsLoading(true);
      getBlogPostById(blogId)
        .then(post => {
          if (post) {
            setCurrentPost(post);
            setTitle(post.title);
            setContent(post.content);
            setAuthor(post.author);
            setTagsString(post.tags?.join(', ') || '');
            setImageUrl(post.imageUrl || '');
            setImageHint(post.imageHint || '');
          } else {
            toast({ title: "Error", description: "Blog post not found.", variant: "destructive" });
            router.push('/admin/manage-posts');
          }
        })
        .catch(err => {
          toast({ title: "Error", description: "Failed to load post data.", variant: "destructive" });
        })
        .finally(() => setIsLoading(false));
    } else {
      // For new posts, use props if available (e.g., from generate form)
      setTitle(initialTitleProp);
      setContent(initialContentProp);
    }
  }, [blogId, initialTitleProp, initialContentProp, router, toast]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Validation Error", description: "Title and Content cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const postData = {
      title,
      content,
      author,
      tags: tagsString.split(',').map(tag => tag.trim()).filter(tag => tag),
      imageUrl: imageUrl.trim() || undefined, // Make undefined if empty to use default
      imageHint: imageHint.trim() || undefined,
    };

    try {
      let savedPost;
      if (blogId === 'new') {
        savedPost = await addBlogPost(postData);
        toast({ title: "Blog Post Created!", description: `"${savedPost.title}" has been saved successfully.` });
        router.push(`/admin/edit-blog/${savedPost.id}`); // Redirect to edit page of new post
      } else {
        savedPost = await updateBlogPost(blogId, postData);
        toast({ title: "Blog Post Updated!", description: `"${savedPost?.title}" has been updated successfully.` });
        setCurrentPost(savedPost); // Update current post state
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({ title: "Save Failed", description: (error as Error).message || "Could not save the blog post.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (blogId === 'new' || !currentPost) {
      toast({title: "Cannot delete", description: "This post has not been saved yet.", variant: "destructive"});
      return;
    }
    setIsDeleting(true);
    try {
      await deleteBlogPost(blogId);
      toast({ title: "Post Deleted", description: `"${title}" has been deleted.`});
      router.push('/admin/manage-posts');
    } catch (error) {
       toast({ title: "Deletion Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateYoutubeScript = () => {
    if (!title || !content) {
      toast({ title: "Missing content", description: "Please provide title and content before generating a script.", variant: "destructive"});
      return;
    }
    const query = new URLSearchParams({
        title: title,
        content: content,
      }).toString();
    router.push(`/admin/youtube-script/${blogId || 'new'}?${query}`);
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <Card className="w-full paper-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{blogId === 'new' ? 'Create New Post' : 'Edit Blog Post'}</CardTitle>
            <CardDescription>
              {blogId !== 'new' && currentPost ? `Editing: ${currentPost.title}` : 'Refine your blog content and save your changes.'}
            </CardDescription>
          </div>
          {blogId !== 'new' && currentPost && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/blog/${currentPost.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" /> View Live Post
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="blogTitle">Title</Label>
          <Input
            id="blogTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog post title"
            className="text-lg font-semibold"
            disabled={isSaving || isDeleting}
          />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="blogAuthor">Author</Label>
            <Input
              id="blogAuthor"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              disabled={isSaving || isDeleting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blogTags">Tags (comma-separated)</Label>
            <Input
              id="blogTags"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="e.g., AI, Tech, Writing"
              disabled={isSaving || isDeleting}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="blogImageUrl">Image URL (optional)</Label>
            <Input
              id="blogImageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://placehold.co/800x400.png"
              disabled={isSaving || isDeleting}
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="blogImageHint">Image AI Hint (optional, 1-2 words)</Label>
            <Input
              id="blogImageHint"
              value={imageHint}
              onChange={(e) => setImageHint(e.target.value)}
              placeholder="e.g. tech abstract"
              disabled={isSaving || isDeleting}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="blogContent">Content (HTML or Markdown supported by your renderer)</Label>
          <Textarea
            id="blogContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post here..."
            rows={20}
            className="min-h-[400px] text-base leading-relaxed"
            disabled={isSaving || isDeleting}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-6 border-t">
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving || isDeleting || isLoading}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {blogId === 'new' ? 'Create Post' : 'Save Changes'}
          </Button>
          <Button onClick={handleGenerateYoutubeScript} variant="outline" disabled={isSaving || isDeleting || isLoading || !title || !content}>
            <Youtube className="mr-2 h-4 w-4" />
            Generate YouTube Script
          </Button>
        </div>
        {blogId !== 'new' && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isSaving || isDeleting || isLoading}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Post
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the post titled "{currentPost?.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                  {isDeleting ? "Deleting..." : "Yes, delete it"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}
