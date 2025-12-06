//-------------------------------------------------------------
// Shared Message Type for ReflectivAI Chat & Roleplay Systems
//-------------------------------------------------------------

export interface Message {
    id: string | number;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
    feedback?: {
        eqScore?: number;
        suggestions?: string[];
        frameworks?: string[];
    };
}
