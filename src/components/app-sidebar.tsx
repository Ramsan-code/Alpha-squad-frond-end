"use client"

import * as React from "react"
import {
  BookOpen,
  Search,
  LayoutDashboard,
  LineChart,
  ShieldCheck,
  TrendingUp,
  User,
  Zap,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

import Link from "next/link"
import Image from "next/image"

import { useAuth } from "@/components/auth/auth-provider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();

  const role = user?.role || "STUDENT";

  const data = {
    user: {
      name: user?.name || "Guest User",
      email: user?.email || "guest@lms.ai",
      avatar: user?.avatar || "",
    },
    navMain: role === "INSTRUCTOR" ? [
      { title: "Studio Home", url: "/teach/dashboard", icon: LayoutDashboard },
      { title: "My Courses", url: "/teach/courses", icon: BookOpen },
      { title: "Explore Catalog", url: "/search", icon: Search },
      { title: "Student Analytics", url: "/analytics", icon: LineChart },
    ] : role === "PARENT" ? [
      { title: "Parent Home", url: "/parent/dashboard", icon: LayoutDashboard },
      { title: "Student Reports", url: "/parent/reports", icon: BookOpen },
      { title: "Explore Catalog", url: "/search", icon: Search },
      { title: "Subscription", url: "/parent/subscription", icon: ShieldCheck },
    ] : [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Explore Catalog", url: "/search", icon: Search },
      { title: "My Courses", url: "/courses", icon: BookOpen },
    ],
    insights: role === "INSTRUCTOR" ? [
      { title: "Revenue", url: "/revenue", icon: TrendingUp },
      { title: "Lesson Planning", url: "/teach/planning", icon: BookOpen },
      { title: "Grading", url: "/teach/grading", icon: ShieldCheck },
      { title: "Content Builder", url: "/teach/courses/create", icon: Zap },
    ] : role === "PARENT" ? [
      { title: "Progress Trends", url: "/analytics", icon: LineChart },
      { title: "AI Recommendations", url: "/ai-insights", icon: Zap },
    ] : [
      { title: "Learning Paths", url: "/paths", icon: Zap, badge: "AI" },
      { title: "AI Insights", url: "/ai-insights", icon: Zap },
      { title: "Analytics", url: "/analytics", icon: LineChart },
      { title: "Compliance", url: "/compliance", icon: ShieldCheck },
    ],
  }

  return (
    <Sidebar collapsible="icon" className="glass border-none" {...props}>
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 px-4 outline-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-vibrant text-white">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
            Alpha.<span className="text-accent-vibrant">LMS</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role === "INSTRUCTOR" ? "Teaching" : "Learning"}</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild className="hover:bg-accent-vibrant/10 hover:text-accent-vibrant transition-all">
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarMenu>
            {data.insights.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild className="hover:bg-accent-cyan/10 hover:text-accent-cyan transition-all">
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {('badge' in item) && item.badge && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent-vibrant text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Profile" className="h-12 w-full justify-start p-0!">
              <div className="flex items-center gap-3 px-2 w-full">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted overflow-hidden">
                  {user?.avatar ? <Image src={user.avatar} alt={data.user.name} width={32} height={32} className="h-full w-full object-cover" /> : <User className="h-4 w-4" />}
                </div>
                <div className="flex flex-col items-start text-xs group-data-[collapsible=icon]:hidden flex-1 truncate">
                  <span className="font-semibold truncate">{data.user.name}</span>
                  <span className="text-muted-foreground truncate">{data.user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 group-data-[collapsible=icon]:hidden hover:bg-red-500/10 hover:text-red-500"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  <ArrowRight className="h-3 w-3 rotate-180" />
                </Button>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

import { ArrowRight } from "lucide-react"
