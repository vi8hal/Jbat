import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function AdSidebar() {
  return (
    <aside className="w-full lg:w-64 space-y-6">
      <Card className="paper-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Sponsored Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
            <Image 
              src="https://placehold.co/300x250.png" 
              alt="Advertisement" 
              width={300} 
              height={250} 
              className="rounded-md"
              data-ai-hint="advertisement banner"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Promote your product here! Reach thousands of readers.
          </p>
          <a href="#" className="text-primary text-sm font-medium hover:underline">Learn More</a>
        </CardContent>
      </Card>
      <Card className="paper-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Another Ad Spot</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
             <Image 
                src="https://placehold.co/250x250.png" 
                alt="Advertisement 2" 
                width={250} 
                height={250} 
                className="rounded-md"
                data-ai-hint="product advertisement"
              />
           </div>
          <p className="text-sm text-muted-foreground mt-2">
            Your ad could be here. Contact us for rates.
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}
