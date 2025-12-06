import type { Message } from "@/types/Message";
import reflectivAILogo from "@assets/E2ABF40D-E679-443C-A1B7-6681EF25E7E7_1764541714586.png";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      data-testid={`message-${message.id}`}
    >
      <div
        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
          isUser ? "bg-primary text-primary-foreground" : ""
        }`}
      >
        {isUser ? (
          <span className="text-sm font-medium">You</span>
        ) : (
          <img src={reflectivAILogo} alt="AI" className="h-8 w-8 rounded-full" />
        )}
      </div>

      <div className={`flex-1 max-w-[80%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block p-3 rounded-lg ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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

            {message.feedback.frameworks?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {message.feedback.frameworks.map((fw) => (
                  <Badge key={fw} variant="secondary" className="text-xs">
                    {fw}
                  </Badge>
                ))}
              </div>
            )}

            {message.feedback.suggestions?.length > 0 && (
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
  );
}
