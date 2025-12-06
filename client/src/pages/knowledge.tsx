import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, Tag, Lightbulb } from "lucide-react";
import { knowledgeArticles } from "@/lib/data";
import type { KnowledgeArticle } from "@shared/schema";

export default function KnowledgePage() {
  const [selected, setSelected] = useState<KnowledgeArticle | null>(null);

  if (selected) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setSelected(null)}
            data-testid="button-back-knowledge"
          >
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Knowledge Library
          </Button>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl" data-testid="text-knowledge-detail-title">
                      {selected.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {selected.summary}
                    </CardDescription>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {selected.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" /> {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {selected.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // LIST VIEW --------------------------------------------------------
  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-knowledge-title">
            Knowledge Library
          </h1>
          <p className="text-muted-foreground">
            Clinical, regulatory, engagement, and market access insights for pharma sales excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {knowledgeArticles.map((article) => (
            <Card
              key={article.id}
              className="hover-elevate cursor-pointer"
              onClick={() => setSelected(article)}
              data-testid={`card-knowledge-${article.id}`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button variant="ghost" size="sm">
                  Read More <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Why This Library Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-1">Clinical Credibility</h4>
              <p className="text-sm text-muted-foreground">
                Master key scientific and regulatory concepts to speak confidently with providers.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Compliance Awareness</h4>
              <p className="text-sm text-muted-foreground">
                Understand the limits of promotional interactions and avoid violations.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Market Access Insight</h4>
              <p className="text-sm text-muted-foreground">
                Navigate payers, formulary tiers, and reimbursement barriers like an expert.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
