'use client'; // Required for useSearchParams

import BlogEditor from '@/components/blog/BlogEditor';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function EditBlogContent({ blogId }: { blogId: string }) {
  const searchParams = useSearchParams();
  const title = searchParams.get('title') || '';
  const content = searchParams.get('content') || '';

  // In a real app, if blogId is not 'new', you'd fetch data based on the ID.
  // const [fetchedTitle, setFetchedTitle] = useState('');
  // const [fetchedContent, setFetchedContent] = useState('');
  // useEffect(() => { if (blogId !== 'new') { /* fetch data */ } }, [blogId]);
  
  return <BlogEditor initialTitle={title} initialContent={content} blogId={blogId} />;
}


export default function EditBlogPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight">Content Editor</h1>
        <p className="text-muted-foreground">
          {params.id === 'new' ? 'Create a new masterpiece.' : `Editing post: ${params.id}`}
        </p>
      </header>
      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <EditBlogContent blogId={params.id} />
      </Suspense>
    </div>
  );
}
