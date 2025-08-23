import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Newspaper, LogIn } from 'lucide-react'; // Added LogIn icon

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Newspaper className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            JBat
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          {/* Add other public navigation links here if needed */}
        </nav>
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline" size="icon" aria-label="Admin Sign In">
            <Link href="/admin/dashboard">
              <LogIn className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
