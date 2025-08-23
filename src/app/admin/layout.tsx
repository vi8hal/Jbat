
'use client'; // Required for useEffect and useRouter, and SidebarProvider
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { checkAuth } from '@/lib/auth-client';
import { Toaster } from '@/components/ui/toaster';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isAuthenticated = checkAuth();

  useEffect(() => {
    // This effect ensures that client-specific logic runs only after mounting
    setIsClient(true);
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [router, isAuthenticated]);
  
  // While waiting for the client to mount and check auth, show a loader or skeleton.
  // This ensures the server render and initial client render are the same.
  if (!isClient || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        {/* You can use a more sophisticated skeleton loader here */}
        <div className="space-y-4 w-1/2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 md:hidden">
            {/* Mobile header content if needed, e.g., burger for sidebar */}
          </header>
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
