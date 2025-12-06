//-------------------------------------------------------------
// Unified Cloudflare Worker Client for ReflectivAI
// Fully normalized + UI-safe response handling
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
// Helpers
//-------------------------------------------------------------

/**
 * Ensures every message coming from the backend is UI-safe
 * and always includes the required fields.
 */
function normalizeMessage(raw: any): Message {
  return {
    id: raw?.id ?? crypto.randomUUID(),
    role: raw?.role ?? "assistant",
    content:
      typeof raw?.content === "string"
        ? raw.content
        : JSON.stringify(raw?.content ?? ""),
    timestamp: raw?.timestamp ?? Date.now(),
    feedback: raw?.feedback ?? undefined,
  };
}

/**
 * The backend may return:
 *   { messages: [...] }
 *   { message: {...} }
 *   { id, role, content }
 * This unwraps all formats into a single Message.
 */
function extractMessageResponse(json: any): Message {
  // Messages array → return last assistant message
  if (Array.isArray(json?.messages)) {
    const last = json.messages[json.messages.length - 1];
    return normalizeMessage(last);
  }

  // Message object
  if (json?.message) {
    return normalizeMessage(json.message);
  }

  // Raw message
  return normalizeMessage(json);
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

  const json = await res.json();

  // 🔥 DIAGNOSTIC LOG (required to debug your run-time failures)
  console.log("🔥 RAW WORKER RESPONSE (coach):", json);

  return extractMessageResponse(json);
}

//-------------------------------------------------------------
// ROLEPLAY
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
}: RoleplayPayload): Promise<any> {
  const payload: any = {
    mode: "roleplay",
    action,
    scenarioId,
  };

  if (Array.isArray(history) && history.length > 0) {
    payload.history = history;
  }

  if (userInput) {
    payload.userInput = userInput;
  }

  const res = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`RolePlay error (${action}):`, res.status, res.statusText, err);
    throw new Error(err);
  }

  const json = await res.json();

  // 🔥 DIAGNOSTIC LOG (required to debug RP flow)
  console.log(`🔥 RAW WORKER RESPONSE (${action}):`, json);

  // Normalize returned messages when roleplay returns many
  if (Array.isArray(json?.messages)) {
    json.messages = json.messages.map((m: any) => normalizeMessage(m));
  }

  return json;
}

//-------------------------------------------------------------
// END
//-------------------------------------------------------------
