import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Send, RotateCcw, Brain, Lightbulb } from "lucide-react";

import reflectivAILogo from "@assets/E2ABF40D-E679-443C-A1B7-6681EF25E7E7_1764541714586.png";

import { useMutation } from "@tanstack/react-query";
import { sendChat } from "@/lib/agentClient";
import type { Message } from "@/types/Message";

const suggestedPrompts = [
  "Give me discovery questions for a first meeting with a neurologist",
  "Explain the DISC model for pharma sales",
  "How do I handle a price objection from a hospital CFO?",
];

export default function CoachPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      setIsLoading(true);

      const userMessage: Message = {
        id: `${Date.now()}`,
        role: "user",
        content,
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      const response = await sendChat(newMessages);

      const aiMessage: Message = {
        ...response,
        id: response.id || `${Date.now()}-ai`,
        role: "assistant",
        timestamp: Date.now(),
      };

      setMessages([...newMessages, aiMessage]);
      setIsLoading(false);

      return aiMessage;
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessageMutation.mutate(input);
    setInput("");
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={reflectivAILogo} alt="ReflectivAI Logo" className="h-10 w-10 rounded-md" />
          <div>
            <h1 className="text-xl font-semibold">AI Coach</h1>
            <p className="text-sm text-muted-foreground">
              Your personal pharma sales coaching assistant
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleNewChat}>
          <RotateCcw className="h-4 w-4 mr-2" /> New Chat
        </Button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* LEFT: CHAT */}
        <div className="flex-1 flex flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto pr-4">
            <div className="space-y-4 pb-4">
              {/* Loading skeleton */}
              {isLoading && messages.length === 0 && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Ask me anything about pharma sales, EQ frameworks, objection handling, or
                    clinical evidence communication.
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                    {suggestedPrompts.map((prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handlePromptClick(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "user" ? (
                      <span className="text-xs font-medium">You</span>
                    ) : (
                      <img
                        src={reflectivAILogo}
                        alt="AI"
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                  </div>

                  <div className="flex-1 max-w-[80%]">
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* Optional EQ feedback */}
                    {message.feedback && (
                      <div className="mt-2 p-3 bg-card border rounded-lg text-left space-y-2">
                        {message.feedback.eqScore !== undefined && (
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              EQ Score: {message.feedback.eqScore}
                            </span>
                          </div>
                        )}

                        {message.feedback.frameworks?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {message.feedback.frameworks.map((fw) => (
                              <Badge key={fw} variant="secondary" className="text-xs">
                                {fw}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {message.feedback.suggestions?.length > 0 && (
                          <ul className="space-y-1 text-xs text-muted-foreground">
                            {message.feedback.suggestions.map((s, i) => (
                              <li key={i}>
                                <Lightbulb className="h-3 w-3 inline mr-1" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Thinking bubble */}
              {sendMessageMutation.isPending && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img
                      src={reflectivAILogo}
                      className="h-8 w-8 rounded-full animate-pulse"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                          <div
                            className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* INPUT BAR */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about sales techniques, EQ frameworks, objection handling..."
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || sendMessageMutation.isPending}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <Card className="w-72 flex-shrink-0 hidden lg:flex">
          <CardHeader>
            <CardTitle className="text-sm">Suggested Topics</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                className="w-full text-left p-2 text-sm rounded-md hover-elevate text-muted-foreground"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
