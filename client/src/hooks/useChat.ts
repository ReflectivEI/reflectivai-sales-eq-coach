//-------------------------------------------------------------
// useChat — Centralized Chat State + Message Pipeline Hook
//-------------------------------------------------------------

import { useState, useEffect, useRef } from "react";
import type { Message } from "@/types/Message";
import { sendChat } from "@/lib/agentClient";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll whenever a new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send a new user message + get AI response
  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;

    setIsLoading(true);

    const userMessage: Message = {
      id: `${Date.now()}`,
      role: "user",
      content,
      timestamp: Date.now(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    try {
      const aiResponse = await sendChat(nextMessages);

      const aiMessage: Message = {
        ...aiResponse,
        id: aiResponse.id || `${Date.now()}-ai`,
        role: "assistant",
        timestamp: Date.now(),
      };

      setMessages([...nextMessages, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    scrollRef,
  };
}
