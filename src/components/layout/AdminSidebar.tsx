
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
import { Home, FileText, ListOrdered, NewspaperIcon } from 'lucide-react';
import type { NavItem } from '@/lib/types';
import { logout } from '@/lib/auth-client';
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
    router.push('/');
    router.refresh();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
           <NewspaperIcon className="h-7 w-7 text-primary group-data-[collapsible=icon]:mx-auto" />
           <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">JBat</span>
        </Link>
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && item.href !== '/admin/dashboard' || pathname === item.href}
                tooltip={item.title}
                className="justify-start"
              >
                <Link href={item.href}>
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         {/* Logout button moved to header */}
      </SidebarFooter>
    </Sidebar>
  );
}
