import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  GraduationCap,
  BookOpen,
  Brain,
  Terminal,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const quickLinks = [
    {
      title: "AI Coach",
      description: "Ask questions, get feedback, and improve your pharma sales skills.",
      icon: MessageSquare,
      href: "/chat",
      color: "text-primary",
    },
    {
      title: "Role-Play Simulator",
      description: "Practice realistic sales conversations with live EQ scoring.",
      icon: Users,
      href: "/roleplay",
      color: "text-chart-2",
    },
    {
      title: "Coaching Modules",
      description: "Structured learning paths to build core competencies.",
      icon: GraduationCap,
      href: "/modules",
      color: "text-chart-1",
    },
    {
      title: "EQ Frameworks",
      description: "Master DISC, Active Listening, Empathy Mapping, and Rapport.",
      icon: Brain,
      href: "/frameworks",
      color: "text-chart-4",
    },
    {
      title: "Knowledge Library",
      description: "Regulatory, clinical, HCP engagement, pricing, and market access topics.",
      icon: BookOpen,
      href: "/knowledge",
      color: "text-chart-3",
    },
    {
      title: "SQL Translator",
      description: "Convert natural language questions into SQL queries.",
      icon: Terminal,
      href: "/sql",
      color: "text-muted-foreground",
    },
    {
      title: "Heuristic Library",
      description: "Proven communication templates for objections, value, and closing.",
      icon: Lightbulb,
      href: "/heuristics",
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
            Welcome to ReflectivAI
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Your complete coaching companion for pharmaceutical sales mastery —
            powered by adaptive emotional intelligence and real-world scenario training.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="hover-elevate cursor-pointer" data-testid={`card-dashboard-${link.title.replace(/\s+/g, '-').toLowerCase()}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${link.color}`} />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{link.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {link.description}
                        </p>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          Enter
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

