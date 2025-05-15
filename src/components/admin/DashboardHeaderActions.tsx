
'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function DashboardHeaderActions() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/'); // Changed from /login to /
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
