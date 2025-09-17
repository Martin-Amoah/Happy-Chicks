
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { EggIcon } from "@/components/icons/EggIcon";
import { FeedIcon } from "@/components/icons/FeedIcon";
import { BirdIcon } from "@/components/icons/BirdIcon";
import { LayoutDashboard, FileText, Settings2, Users, ShoppingCart } from "lucide-react";

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    roles: string[]; // 'Manager', 'Worker', 'Sales Rep'
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ['Manager', 'Worker', 'Sales Rep'] },
  { href: "/inventory", label: "Feed Management", icon: FeedIcon, roles: ['Manager', 'Worker'] },
  { href: "/egg-collection", label: "Egg Collection", icon: EggIcon, roles: ['Manager', 'Worker'] },
  { href: "/dead-birds", label: "Dead Birds Record", icon: BirdIcon, roles: ['Manager', 'Worker'] },
  { href: "/sales", label: "Sales Tracking", icon: ShoppingCart, roles: ['Manager', 'Sales Rep'] },
  { href: "/reports", label: "Reports", icon: FileText, roles: ['Manager'] },
  { href: "/settings", label: "Settings", icon: Settings2, roles: ['Manager', 'Worker', 'Sales Rep'] },
  { href: "/users", label: "User Management", icon: Users, roles: ['Manager'] },
];

export function SidebarNav({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        if (!item.roles.includes(userRole)) {
            return null;
        }

        const Icon = item.icon;
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard") || (item.href === "/dashboard" && pathname === "/");
        
        return (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                variant="default"
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                )}
                isActive={isActive}
                tooltip={item.label}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
