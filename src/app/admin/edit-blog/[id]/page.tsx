
'use client'; 

import BlogEditor from '@/components/blog/BlogEditor';
import { useSearchParams, useParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function EditBlogContentWrapper() {
  const params = useParams();
  const searchParams = useSearchParams();
  const blogId = typeof params.id === 'string' ? params.id : 'new';
  
  // For new posts created via "Generate Blog", title and content might come from query params
  const initialTitle = searchParams.get('title') || '';
  const initialContent = searchParams.get('content') || '';

  return <BlogEditor 
            initialTitleProp={initialTitle} 
            initialContentProp={initialContent} 
            blogId={blogId} 
         />;
}


export default function EditBlogPage() {
  const params = useParams();
  const blogId = typeof params.id === 'string' ? params.id : 'new';

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight">Content Editor</h1>
        <p className="text-muted-foreground">
          {blogId === 'new' ? 'Create a new masterpiece.' : `Editing post`}
        </p>
      </header>
      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <EditBlogContentWrapper />
      </Suspense>
    </div>
  );
}
