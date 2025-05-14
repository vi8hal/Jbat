import type { BlogPost } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, UserCircle } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden paper-shadow hover:shadow-lg transition-shadow duration-300">
      {post.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={post.imageUrl}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="article illustration"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl leading-tight">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-muted-foreground border-t pt-4 mt-auto">
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <UserCircle className="mr-1.5 h-4 w-4" />
            {post.author}
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            {new Date(post.date).toLocaleDateString()}
          </div>
        </div>
        <Button asChild variant="link" size="sm" className="p-0 h-auto text-primary">
          <Link href={`/blog/${post.slug}`}>Read More &rarr;</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
