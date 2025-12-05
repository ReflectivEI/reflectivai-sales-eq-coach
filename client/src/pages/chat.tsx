import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Send,
  Brain,
  Lightbulb,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import reflectivAILogo from "@assets/E2ABF40D-E679-443C-A1B7-6681EF25E7E7_1764541714586.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sendChat, Message } from "../lib/agentClient";
// Removed duplicate Message import; using Message from agentClient.ts

function formatMessageContent(content: string | undefined | null) {
  if (!content) return [""];
  const lines = content.split("\n");
  return lines.map((line, lineIndex) => (
    <span key={lineIndex}>{line}</span>
  ));
}

const suggestedPrompts = [
  "How do I handle a price objection from a hospital CFO?",
  "What's the best way to build rapport with a skeptical KOL?",
  "Explain the DISC model for pharma sales",
  "How should I present clinical data to a high-C personality?",
  "Give me discovery questions for a first meeting with a neurologist",
];

export default function ChatPage() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  // Local-only message state, since agentClient.ts is the only gateway
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const clearChatMutation = useMutation({
    mutationFn: async () => {
      setMessages([]);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b flex-shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <img 
              src={reflectivAILogo} 
              alt="ReflectivAI Logo" 
              className="h-10 w-10 rounded-md"
            />
            <div>
              <h1 className="text-xl font-semibold" data-testid="text-chat-title">AI Coach</h1>
              <p className="text-sm text-muted-foreground">
                Your personal pharma sales coaching assistant
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearChatMutation.mutate()}
            disabled={clearChatMutation.isPending}
            data-testid="button-clear-chat"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto pr-4">
            <div className="space-y-4 pb-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Ask me anything about pharma sales, emotional intelligence frameworks,
                    objection handling, or clinical evidence communication.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                    {suggestedPrompts.slice(0, 3).map((prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handlePromptClick(prompt)}
                        data-testid={`button-prompt-${prompt.slice(0, 20).replace(/\s+/g, '-')}`}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    data-testid={`message-${message.id}`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      {message.role === "user" ? (
                        <span className="text-sm font-medium">You</span>
                      ) : (
                        <img src={reflectivAILogo} alt="AI" className="h-8 w-8 rounded-full" />
                      )}
                    </div>
                    <div
                      className={`flex-1 max-w-[80%] ${
                        message.role === "user" ? "text-right" : ""
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{formatMessageContent(message.content)}</p>
                      </div>
                      {message.feedback && (
                        <div className="mt-2 p-3 bg-card border rounded-lg text-left">
                          {message.feedback.eqScore !== undefined && (
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">
                                EQ Score: {message.feedback.eqScore}
                              </span>
                            </div>
                          )}
                          {message.feedback.frameworks && message.feedback.frameworks.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {message.feedback.frameworks.map((fw) => (
                                <Badge key={fw} variant="secondary" className="text-xs">
                                  {fw}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {message.feedback.suggestions && message.feedback.suggestions.length > 0 && (
                            <div className="space-y-1">
                              {message.feedback.suggestions.map((s, i) => (
                                <p key={i} className="text-xs text-muted-foreground">
                                  <Lightbulb className="h-3 w-3 inline mr-1" />
                                  {s}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {sendMessageMutation.isPending && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img src={reflectivAILogo} alt="AI" className="h-8 w-8 rounded-full animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about sales techniques, EQ frameworks, objection handling..."
                className="min-h-[60px] resize-none"
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || sendMessageMutation.isPending}
                className="self-end"
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Card className="w-72 flex-shrink-0 hidden lg:block">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggested Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="w-full text-left p-2 text-sm rounded-md hover-elevate text-muted-foreground"
                data-testid={`button-suggested-${prompt.slice(0, 15).replace(/\s+/g, '-')}`}
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
