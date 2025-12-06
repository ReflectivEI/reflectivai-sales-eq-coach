//-------------------------------------------------------------
// Canonical Message Type for ReflectivAI
// Used across Chat, Roleplay, agentClient, and backend
//-------------------------------------------------------------

export interface Message {
  id: string;
  role: "user" | "assistant" | "system"; // must include "system"
  content: string;
  timestamp: number;

  // Optional — used only when EQ scoring is returned
  feedback?: {
    eqScore?: number;
    suggestions?: string[];
    frameworks?: string[];
  };
}

export default Message;
