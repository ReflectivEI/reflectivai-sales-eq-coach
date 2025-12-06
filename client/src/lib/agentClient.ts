//-------------------------------------------------------------
// Unified Cloudflare Worker Client for ReflectivAI
//-------------------------------------------------------------

const WORKER_URL =
  (typeof window !== "undefined" && (window as any).WORKER_URL) ||
  "https://my-chat-agent-v2.tonyabdelmalak.workers.dev";

const CHAT_ENDPOINT = WORKER_URL.replace(/\/+$/, "") + "/chat";

//-------------------------------------------------------------
// TYPES
//-------------------------------------------------------------
import type { Message } from "@/types/Message";

//-------------------------------------------------------------
// NORMALIZER (prevents content.split undefined errors)
//-------------------------------------------------------------
function normalizeMessage(raw: any): Message {
  return {
    id: raw?.id ?? crypto.randomUUID(),
    role: raw?.role ?? "assistant",
    content:
      typeof raw?.content === "string"
        ? raw.content
        : JSON.stringify(raw ?? {}),
    createdAt: raw?.createdAt ?? Date.now(),
  };
}

//-------------------------------------------------------------
// AI COACH
//-------------------------------------------------------------
export async function sendChat(messages: Message[]): Promise<Message> {
  const payload = {
    mode: "coach",
    agent: "chat",
    messages,
  };

  const res = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("AI Coach error:", res.status, res.statusText, err);
    throw new Error(err);
  }

  const result = await res.json();
  return normalizeMessage(result);
}

//-------------------------------------------------------------
// ROLE-PLAY
//-------------------------------------------------------------
export interface RoleplayPayload {
  action: "start" | "respond" | "analyze";
  scenarioId: string;
  history?: Message[];
  userInput?: string;
}

export async function sendRoleplay({
  action,
  scenarioId,
  history = [],
  userInput = "",
}: RoleplayPayload): Promise<Message> {
  const payload: any = {
    mode: "roleplay",
    action,
    scenarioId,
  };

  if (history.length > 0) payload.history = history;
  if (userInput) payload.userInput = userInput;

  const res = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(
      `RolePlay error (${action}):`,
      res.status,
      res.statusText,
      err
    );
    throw new Error(err);
  }

  const result = await res.json();
  return normalizeMessage(result);
}

//-------------------------------------------------------------
// END
//-------------------------------------------------------------
