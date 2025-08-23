
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Youtube, Loader2, Trash2, Eye, Megaphone } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addBlogPost, getBlogPostById, updateBlogPost, deleteBlogPost } from '@/lib/blogData';
import type { BlogPost } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { checkAuth } from '@/lib/auth-client';

interface BlogEditorProps {
  initialTitleProp?: string;
  initialContentProp?: string;
  blogId: string; // 'new' or an actual ID
}

export default function BlogEditor({ initialTitleProp = '', initialContentProp = '', blogId }: BlogEditorProps) {
  const [title, setTitle] = useState(initialTitleProp);
  const [content, setContent] = useState(initialContentProp);
  const [author, setAuthor] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageHint, setImageHint] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredAt, setFeaturedAt] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const user = checkAuth();
    if (user) {
      setAuthor(user.username);
      setAuthorId(user.id);
    } else {
      // Redirect if not authenticated
      router.push('/login');
    }

    if (blogId !== 'new') {
      setIsLoading(true);
      getBlogPostById(blogId)
        .then(post => {
          if (post) {
            // Optional: Check if user is the author of the post
            setCurrentPost(post);
            setTitle(post.title);
            setContent(post.content);
            setAuthor(post.author);
            setAuthorId(post.authorId);
            setTagsString(post.tags?.join(', ') || '');
            setImageUrl(post.imageUrl || '');
            setImageHint(post.imageHint || '');
            setIsFeatured(post.isFeatured || false);
            setFeaturedAt(post.featuredAt || null);
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
      setTitle(initialTitleProp);
      setContent(initialContentProp);
      setIsFeatured(false);
      setFeaturedAt(null);
    }
  }, [blogId, initialTitleProp, initialContentProp, router, toast]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Validation Error", description: "Title and Content cannot be empty.", variant: "destructive" });
      return;
    }
    if (!authorId || !author) {
      toast({ title: "Authentication Error", description: "Could not identify the author.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    
    let postIsFeatured = isFeatured;
    let postFeaturedAt = featuredAt;

    if (isFeatured && !featuredAt) {
        postFeaturedAt = new Date().toISOString();
    } else if (!isFeatured) {
        postFeaturedAt = null;
    }

    const postData = {
      title,
      content,
      author,
      authorId,
      tags: tagsString.split(',').map(tag => tag.trim()).filter(tag => tag),
      imageUrl: imageUrl.trim() || undefined, 
      imageHint: imageHint.trim() || undefined,
      isFeatured: postIsFeatured,
      featuredAt: postFeaturedAt,
    };

    try {
      let savedPost;
      if (blogId === 'new') {
        savedPost = await addBlogPost(postData);
        toast({ title: "Blog Post Created!", description: `"${savedPost.title}" has been saved successfully.` });
        router.push(`/admin/edit-blog/${savedPost.id}`); 
      } else {
        savedPost = await updateBlogPost(blogId, postData);
        toast({ title: "Blog Post Updated!", description: `"${savedPost?.title}" has been updated successfully.` });
        setCurrentPost(savedPost); 
        if (savedPost) {
            setIsFeatured(savedPost.isFeatured || false);
            setFeaturedAt(savedPost.featuredAt || null);
        }
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

  const handleFeatureToggle = (checked: boolean) => {
    setIsFeatured(checked);
    if (checked) {
      setFeaturedAt(new Date().toISOString());
    } else {
      setFeaturedAt(null);
    }
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
              disabled={true} // Author should not be changed, it's the logged-in user
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
        <div className="flex items-center space-x-2 py-4 border-t border-b">
          <Switch
            id="feature-on-landing"
            checked={isFeatured}
            onCheckedChange={handleFeatureToggle}
            disabled={isSaving || isDeleting}
          />
          <Label htmlFor="feature-on-landing" className="flex items-center">
            <Megaphone className="mr-2 h-4 w-4 text-primary" />
            Feature this post on the landing page (for 24 hours)
          </Label>
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
