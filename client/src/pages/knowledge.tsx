import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, BookOpen, Search } from "lucide-react";
import { knowledgeArticles } from "@/lib/data";
import type { KnowledgeArticle } from "@shared/schema";

export default function KnowledgePage() {
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [search, setSearch] = useState("");

  const filtered = knowledgeArticles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.summary.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedArticle) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setSelectedArticle(null)}
            data-testid="button-back-knowledge"
          >
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Knowledge Base
          </Button>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl" data-testid="text-knowledge-article-title">
                  {selectedArticle.title}
                </CardTitle>
                <CardDescription>{selectedArticle.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap">
                    {selectedArticle.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-knowledge-title">
            Knowledge Base
          </h1>
          <p className="text-muted-foreground">
            Explore regulatory, clinical, and access-related insights
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 p-2 border rounded-lg">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-knowledge-search"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((article) => (
            <Card
              key={article.id}
              className="hover-elevate cursor-pointer"
              onClick={() => setSelectedArticle(article)}
              data-testid={`card-knowledge-${article.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-3">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1">
                      {article.category}
                    </Badge>
                    <h3 className="font-semibold mb-1">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button variant="ghost" size="sm">
                    Read More
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center mt-10 text-muted-foreground">
            No articles found.
          </div>
        )}
      </div>
    </div>
  );
}
