import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Select,import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Play,
  Send,
  Brain,
  Target,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ✅ UPDATED IMPORTS
import type { Message } from "@/types/Message";
import { sendRoleplay } from "../lib/agentClient";

import { scenarios } from "@/lib/data";
import type { Scenario } from "@shared/schema";

const difficultyColors = {
  beginner: "bg-chart-4 text-white",
  intermediate: "bg-chart-2 text-white",
  advanced: "bg-destructive text-destructive-foreground",
};

export default function RolePlayPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();

  const { data: roleplayData } = useQuery<{
    messages: Message[];
    analysis?: {
      overallScore: number;
      eqMetrics: {
        empathy: number;
        activeListening: number;
        rapport: number;
        discAdaptation: number;
      };
      strengths: string[];
      improvements: string[];
    };
  }>({
    queryKey: ["/api/roleplay/session"],
    enabled: isActive,
  });

  const [history, setHistory] = useState<Message[]>([]);
  const startScenarioMutation = useMutation({
    mutationFn: async (scenarioId: string) => {
      const response = await sendRoleplay({
        action: "start",
        scenarioId,
      });
      setIsActive(true);
      setHistory(response.messages || []);
      return response;
    },
  });

  const sendResponseMutation = useMutation({
    mutationFn: async (content: string) => {
      const userMessage: Message = {
        id: `${Date.now()}`,
        role: "user",
        content,
        timestamp: Date.now(),
      };
      const newHistory = [...history, userMessage];
      setHistory(newHistory);
      const response = await sendRoleplay({
        action: "respond",
        scenarioId: selectedScenario?.id || "",
        history: newHistory,
        userInput: content,
      });
      setHistory(response.messages || newHistory);
      return response;
    },
  });

  const handleStart = () => {
    if (selectedScenario) {
      startScenarioMutation.mutate(selectedScenario.id);
    }
  };

  const handleSend = () => {
    if (!input.trim() || sendResponseMutation.isPending) return;
    sendResponseMutation.mutate(input);
    setInput("");
  };

  const handleReset = () => {
    setIsActive(false);
    setSelectedScenario(null);
    queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
  };

  const messages = roleplayData?.messages || [];
  const analysis = roleplayData?.analysis;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* the rest of your file remains unchanged */}
    </div>
  );
}

  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Play,
  Send,
  Brain,
  Target,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sendRoleplay, Message } from "../lib/agentClient";
import { scenarios } from "@/lib/data";
import type { Scenario } from "@shared/schema";

const difficultyColors = {
  beginner: "bg-chart-4 text-white",
  intermediate: "bg-chart-2 text-white",
  advanced: "bg-destructive text-destructive-foreground",
};

export default function RolePlayPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();

  const { data: roleplayData } = useQuery<{
    messages: Message[];
    analysis?: {
      overallScore: number;
      eqMetrics: {
        empathy: number;
        activeListening: number;
        rapport: number;
        discAdaptation: number;
      };
      strengths: string[];
      improvements: string[];
    };
  }>({
    queryKey: ["/api/roleplay/session"],
    enabled: isActive,
  });

  const [history, setHistory] = useState<Message[]>([]);
  const startScenarioMutation = useMutation({
    mutationFn: async (scenarioId: string) => {
      const response = await sendRoleplay({
        action: "start",
        scenarioId,
      });
      setIsActive(true);
      setHistory(response.messages || []);
      return response;
    },
  });

  const sendResponseMutation = useMutation({
    mutationFn: async (content: string) => {
      // Add user message to history
      const userMessage: Message = {
        id: `${Date.now()}`,
        role: "user",
        content,
        timestamp: Date.now(),
      };
      const newHistory = [...history, userMessage];
      setHistory(newHistory);
      const response = await sendRoleplay({
        action: "respond",
        scenarioId: selectedScenario?.id || "",
        history: newHistory,
        userInput: content,
      });
      setHistory(response.messages || newHistory);
      return response;
    },
  });

  // Remove endScenarioMutation, not needed for agentClient.ts

  const handleStart = () => {
    if (selectedScenario) {
      startScenarioMutation.mutate(selectedScenario.id);
    }
  };

  const handleSend = () => {
    if (!input.trim() || sendResponseMutation.isPending) return;
    sendResponseMutation.mutate(input);
    setInput("");
  };

  const handleReset = () => {
    setIsActive(false);
    setSelectedScenario(null);
    queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
  };

  const messages = roleplayData?.messages || [];
  const analysis = roleplayData?.analysis;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b flex-shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-chart-2 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold" data-testid="text-roleplay-title">Role-Play Simulator</h1>
              <p className="text-sm text-muted-foreground">
                Practice pharma sales scenarios with AI feedback
              </p>
            </div>
          </div>
          {isActive && (
            <Button variant="outline" size="sm" onClick={handleReset} data-testid="button-reset-roleplay">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {!isActive ? (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select a Scenario</CardTitle>
                <CardDescription>
                  Choose a pharma sales scenario to practice. Each scenario includes unique challenges and stakeholder dynamics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedScenario?.id || ""}
                  onValueChange={(value) => setSelectedScenario(scenarios.find(s => s.id === value) || null)}
                >
                  <SelectTrigger data-testid="select-scenario">
                    <SelectValue placeholder="Choose a scenario..." />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        <div className="flex items-center gap-2">
                          <span>{scenario.title}</span>
                          <Badge className={difficultyColors[scenario.difficulty]} variant="secondary">
                            {scenario.difficulty}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedScenario && (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle data-testid="text-scenario-title">{selectedScenario.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {selectedScenario.description}
                      </CardDescription>
                    </div>
                    <Badge className={difficultyColors[selectedScenario.difficulty]}>
                      {selectedScenario.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Stakeholder
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedScenario.stakeholder}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Objective
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedScenario.objective}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Context</h4>
                    <p className="text-sm text-muted-foreground">{selectedScenario.context}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        Challenges
                      </h4>
                      <ul className="space-y-1">
                        {selectedScenario.challenges.map((challenge, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-chart-4" />
                        Key Messages
                      </h4>
                      <ul className="space-y-1">
                        {selectedScenario.keyMessages.map((msg, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            {msg}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button onClick={handleStart} className="w-full" disabled={startScenarioMutation.isPending} data-testid="button-start-roleplay">
                    <Play className="h-4 w-4 mr-2" />
                    Start Role-Play
                  </Button>
                </CardContent>
              </Card>
            )}

            {!selectedScenario && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenarios.map((scenario) => (
                  <Card
                    key={scenario.id}
                    className="hover-elevate cursor-pointer"
                    onClick={() => setSelectedScenario(scenario)}
                    data-testid={`card-scenario-${scenario.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline">{scenario.category}</Badge>
                        <Badge className={difficultyColors[scenario.difficulty]}>
                          {scenario.difficulty}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-1">{scenario.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {scenario.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-6 p-6 overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            {selectedScenario && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{selectedScenario.title}</p>
                    <p className="text-xs text-muted-foreground">{selectedScenario.stakeholder}</p>
                  </div>
                  <Badge className={difficultyColors[selectedScenario.difficulty]}>
                    {selectedScenario.difficulty}
                  </Badge>
                </div>
              </div>
            )}

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-chart-2 text-white"
                      }`}
                    >
                      {message.role === "user" ? (
                        <span className="text-xs font-medium">You</span>
                      ) : (
                        <Users className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {sendResponseMutation.isPending && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-2 text-white flex items-center justify-center">
                      <Users className="h-4 w-4 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block p-3 rounded-lg bg-muted">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="pt-4 border-t space-y-2">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Your response to the stakeholder..."
                  className="min-h-[60px] resize-none"
                  data-testid="input-roleplay-response"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || sendResponseMutation.isPending}
                  className="self-end"
                  data-testid="button-send-response"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {/* End Role-Play button removed; not needed for agentClient.ts */}
            </div>
          </div>

          <Card className="w-80 flex-shrink-0 hidden xl:flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Live EQ Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {analysis ? (
                <>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">{analysis.overallScore}</div>
                    <p className="text-sm text-muted-foreground">Overall EQ Score</p>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(analysis.eqMetrics).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-medium">{value}%</span>
                        </div>
                        <Progress value={value} className="h-1.5" />
                      </div>
                    ))}
                  </div>

                  {analysis.strengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-chart-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {analysis.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground">{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.improvements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Target className="h-3 w-3 text-chart-2" />
                        Areas to Improve
                      </h4>
                      <ul className="space-y-1">
                        {analysis.improvements.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground">{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Sparkles className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    EQ analysis will appear as you progress through the conversation
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
