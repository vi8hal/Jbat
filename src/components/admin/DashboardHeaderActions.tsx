
'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function DashboardHeaderActions() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
    router.refresh(); // Force a refresh to clear server-side state
  };

  return (
    <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Logout">
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
