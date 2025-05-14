'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Youtube, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface BlogEditorProps {
  initialTitle?: string;
  initialContent?: string;
  blogId?: string; // 'new' or an actual ID
}

export default function BlogEditor({ initialTitle = '', initialContent = '', blogId }: BlogEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving to a backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({ title: "Blog Post Saved!", description: `"${title}" has been saved successfully.` });
    // In a real app, you might redirect or update UI based on blogId (new vs existing)
  };

  const handleGenerateYoutubeScript = () => {
    // Pass content to YouTube script page
    // For simplicity, using query params.
    const query = new URLSearchParams({
        title: title,
        content: content,
      }).toString();
    router.push(`/admin/youtube-script/${blogId || 'new'}?${query}`);
  };

  return (
    <Card className="w-full paper-shadow">
      <CardHeader>
        <CardTitle className="text-2xl">{blogId === 'new' ? 'Create New Post' : 'Edit Blog Post'}</CardTitle>
        <CardDescription>Refine your blog content and save your changes.</CardDescription>
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blogContent">Content</Label>
          <Textarea
            id="blogContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post here..."
            rows={20}
            className="min-h-[400px] text-base leading-relaxed"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Post
        </Button>
        <Button onClick={handleGenerateYoutubeScript} variant="outline">
          <Youtube className="mr-2 h-4 w-4" />
          Generate YouTube Script
        </Button>
      </CardFooter>
    </Card>
  );
}
