import { Link, useLocation } from "wouter";
import {
  MessageSquare,
  Users,
  Database,
  Layers,
  Brain,
  BookOpen,
  Puzzle,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarItem } from "@/components/ui/sidebar";

const navItems = [
  { href: "/", label: "Dashboard", icon: Layers },
  { href: "/chat", label: "AI Coach", icon: MessageSquare },
  { href: "/roleplay", label: "Role-Play", icon: Users },
  { href: "/modules", label: "Modules", icon: BookOpen },
  { href: "/frameworks", label: "Frameworks", icon: Brain },
  { href: "/heuristics", label: "Heuristics", icon: Puzzle },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/sql", label: "SQL Translator", icon: Database },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = location === href;
            return (
              <SidebarItem key={href} active={isActive}>
                <Link href={href} className="flex items-center gap-3 p-2">
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              </SidebarItem>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
