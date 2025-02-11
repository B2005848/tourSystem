"use client";

import {
  Grid,
  Mail,
  FileText,
  Send,
  Clock,
  Headphones,
  Settings,
  User2,
} from "lucide-react";
import { SidebarProvider } from "@/context/sidebar-context";
import { EnhancedSidebar } from "@/components/reuse/sidebar/sidebar";
import type { SidebarConfig } from "@/types/sidebar";

const sidebarConfig: SidebarConfig = {
  logo: <span className="text-xl font-bold">Logo</span>,
  navigation: [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: Grid,
          isActive: true,
        },
        {
          title: "Inbox",
          href: "/inbox",
          icon: Mail,
          badge: "5",
        },
        {
          title: "Documents",
          href: "/documents",
          icon: FileText,
        },
      ],
    },
    {
      title: "Tools",
      items: [
        {
          title: "Send",
          href: "/send",
          icon: Send,
        },
        {
          title: "History",
          href: "/history",
          icon: Clock,
        },
        {
          title: "Support",
          href: "/support",
          icon: Headphones,
          external: true,
        },
      ],
    },
  ],
  footer: {
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
      {
        title: "Profile",
        href: "/profile",
        icon: User2,
      },
    ],
  },
  theme: {
    background: "hsl(240 10% 3.9%)",
    foreground: "hsl(0 0% 98%)",
    muted: "hsl(240 3.7% 15.9%)",
    mutedForeground: "hsl(240 5% 64.9%)",
    border: "hsl(240 3.7% 15.9%)",
    active: "hsl(240 3.7% 15.9%)",
    activeText: "hsl(0 0% 98%)",
    hover: "hsl(240 3.7% 15.9%)",
  },
  collapsible: true,
  defaultCollapsed: false,
  width: {
    expanded: "240px",
    collapsed: "70px",
  },
};

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <EnhancedSidebar config={sidebarConfig} />
        <main className="flex-1 p-6">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          {/* Add your dashboard content here */}
        </main>
      </div>
    </SidebarProvider>
  );
}
