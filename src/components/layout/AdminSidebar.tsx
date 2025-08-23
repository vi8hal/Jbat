
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, FileText, Edit3, Youtube, LogOut, NewspaperIcon, ListOrdered } from 'lucide-react';
import type { NavItem } from '@/lib/types';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { title: 'Generate Blog', href: '/admin/generate-blog', icon: FileText },
  { title: 'Manage Posts', href: '/admin/manage-posts', icon: ListOrdered },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/'); // Changed from /login to /
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
           <NewspaperIcon className="h-7 w-7 text-primary group-data-[collapsible=icon]:mx-auto" />
           <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">ContentGenius</span>
        </Link>
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href === '/admin/manage-posts' && pathname.startsWith('/admin/edit-blog'))}
                  tooltip={item.title}
                  className="justify-start"
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         {/* Logout button removed as requested */}
      </SidebarFooter>
    </Sidebar>
  );
}
