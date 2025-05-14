'use client'; // Required for useSearchParams

import YoutubeScriptDisplay from '@/components/blog/YoutubeScriptDisplay';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function YoutubeScriptContent({ blogId }: { blogId: string }) {
  const searchParams = useSearchParams();
  // Retrieve blog content passed via query params (simplified for demo)
  const title = searchParams.get('title') || 'Untitled Blog Post';
  const content = searchParams.get('content') || 'No content provided.';

  // In a real app, you might fetch content by blogId if not passed or if it's an existing post.
  return <YoutubeScriptDisplay blogTitle={title} blogContent={content} />;
}


export default function YoutubeScriptPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
       <header className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight">YouTube Script Generator</h1>
        <p className="text-muted-foreground">
          Transform your blog post into a video script.
        </p>
      </header>
      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <YoutubeScriptContent blogId={params.id} />
      </Suspense>
    </div>
  );
}
