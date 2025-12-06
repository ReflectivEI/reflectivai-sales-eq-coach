import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Lightbulb, Brain, MessageSquare, Target } from "lucide-react";
import { heuristicTemplates } from "@/lib/data";
import type { HeuristicTemplate } from "@shared/schema";

const categoryLabels: Record<string, string> = {
  objection: "Objection Handling",
  "value-proposition": "Value Proposition",
  discovery: "Discovery",
  rapport: "Rapport Building",
  closing: "Closing",
};

export default function HeuristicsPage() {
  const [selected, setSelected] = useState<HeuristicTemplate | null>(null);

  if (selected) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setSelected(null)}
            data-testid="button-back-heuristics"
          >
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Heuristics
          </Button>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {categoryLabels[selected.category] || selected.category}
                    </Badge>
                    <CardTitle className="text-2xl" data-testid="text-heuristic-title">
                      {selected.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {selected.useCase}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">

                <div>
                  <h4 class御="font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Template
                  </h4>
                  <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-line">
                    {selected.template}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Example
                  </h4>
                  <div className="bg-muted p-4 rounded-lg text-sm italic">
                    "{selected.example}"
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    EQ Principles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.eqPrinciples.map((p, i) => (
                      <Badge key={i} variant="secondary">
                        {p.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
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
        <h1 className="text-2xl font-bold mb-2" data-testid="text-heuristics-title">
          Heuristics Playbook
        </h1>
        <p className="text-muted-foreground mb-6">
          Proven conversation structures for objection handling, value messaging, and closing
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heuristicTemplates.map((h) => (
            <Card
              key={h.id}
              onClick={() => setSelected(h)}
              className="hover-elevate cursor-pointer"
              data-testid={`card-heuristic-${h.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">
                      {categoryLabels[h.category] || h.category}
                    </Badge>
                    <h3 className="font-semibold">{h.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {h.useCase}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  {h.template.slice(0, 120)}...
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
