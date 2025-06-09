
"use client";

import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/navigation/SidebarNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut } from "lucide-react"; // Assuming a theme toggle might be added
import { Separator } from "@/components/ui/separator";

// Simple Theme Toggle (conceptual, full implementation would use context/localStorage)
function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark");
      setIsDarkMode(!isDarkMode);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarRail />
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
            <path d="M12 2C8.686 2 6 6.477 6 11c0 4.97 2.539 8.261 6 9.5 3.461-1.239 6-4.53 6-9.5C18 6.477 15.314 2 12 2z" />
          </svg>
          <div className="font-headline text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
            Happy Chicks
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav />
        </SidebarContent>
        <Separator className="my-2" />
        <SidebarFooter className="p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
             <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="person face" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium text-sidebar-foreground">Farm Manager</span>
              <span className="text-xs text-muted-foreground">manager@happychicks.com</span>
            </div>
          </div>
          <div className="flex items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2">
             <ThemeToggle />
            <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:text-destructive" aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-headline text-lg font-semibold">Welcome to Happy chicks</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
         <footer className="border-t p-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Happy Chicks. All rights reserved.
          </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
