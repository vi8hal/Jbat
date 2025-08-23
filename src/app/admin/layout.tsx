
'use client'; // Required for useEffect and useRouter, and SidebarProvider
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { checkAuth } from '@/lib/auth-client';
import { Toaster } from '@/components/ui/toaster';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !checkAuth()) {
      router.replace('/login');
    }
  }, [router]);
  
  // Prevent rendering children if redirecting or not authenticated on client
  if (typeof window !== 'undefined' && !checkAuth()) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirecting to login...</p>
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
