import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, BookOpen, Lightbulb } from "lucide-react";

import {
  eqFrameworks,
  coachingModules,
  heuristicTemplates,
  knowledgeArticles,
  sampleSqlQueries,
} from "@/lib/data";

export default function InsightsPage() {
  const [search, setSearch] = useState("");

  const filter = (text: string) =>
    text.toLowerCase().includes(search.toLowerCase());

  const filteredFrameworks = eqFrameworks.filter((f) =>
    filter(f.name + f.description)
  );
  const filteredModules = coachingModules.filter((m) =>
    filter(m.title + m.description)
  );
  const filteredHeuristics = heuristicTemplates.filter((h) =>
    filter(h.name + h.category + h.useCase)
  );
  const filteredArticles = knowledgeArticles.filter(
    (a) => filter(a.title + a.summary) || a.tags.some(filter)
  );
  const filteredSql = sampleSqlQueries.filter(
    (q) => filter(q.natural) || filter(q.sql)
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Insights Library</h1>
            <p className="text-sm text-muted-foreground">
              Frameworks, clinical knowledge, heuristics & sales strategy
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="p-4 border-b">
        <div className="relative max-w-lg">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search frameworks, heuristics, clinical topics…"
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-10">

          {/* FRAMEWORKS */}
          <section>
            <h2 className="text-lg font-semibold mb-3">EQ Frameworks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredFrameworks.map((fw) => (
                <Card key={fw.id} className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {fw.name}
                      <Badge variant="secondary">{fw.id}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {fw.description}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {fw.principles.length} principles · {fw.techniques.length} techniques
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* COACHING MODULES */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Coaching Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredModules.map((mod) => (
                <Card key={mod.id} className="hover-elevate">
                  <CardHeader>
                    <CardTitle>{mod.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {mod.description}
                    </p>
                    <Badge variant="outline">{mod.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* HEURISTICS */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Sales Heuristics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredHeuristics.map((h) => (
                <Card key={h.id} className="hover-elevate">
                  <CardHeader>
                    <CardTitle>{h.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {h.useCase}
                    </p>
                    <Badge variant="outline">{h.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* KNOWLEDGE ARTICLES */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Clinical Knowledge</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredArticles.map((a) => (
                <Card key={a.id} className="hover-elevate">
                  <CardHeader>
                    <CardTitle>{a.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                      {a.summary}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {a.tags.slice(0, 4).map((t) => (
                        <Badge key={t} className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* SQL EXAMPLES */}
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Data & SQL Examples
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSql.map((q, i) => (
                <Card key={i} className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-sm">{q.natural}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                      {q.sql}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
