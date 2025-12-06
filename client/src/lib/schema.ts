//-------------------------------------------------------------
// Shared Type Definitions for ReflectivAI Frontend
//-------------------------------------------------------------

export interface EQFramework {
  id: string;
  name: string;
  description: string;
  principles: string[];
  techniques: {
    name: string;
    description: string;
    example: string;
  }[];
  color: string;
}

export interface CoachingExercise {
  id: string;
  title: string;
  description: string;
  type: "practice" | "quiz" | "roleplay";
}

export interface CoachingModule {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  frameworks: string[];
  exercises: CoachingExercise[];
  progress: number;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  stakeholder: string;
  objective: string;
  context: string;
  challenges: string[];
  keyMessages: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface HeuristicTemplate {
  id: string;
  category: string;
  name: string;
  template: string;
  example: string;
  useCase: string;
  eqPrinciples: string[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  summary: string;
  tags: string[];
}

export interface SqlExample {
  natural: string;
  sql: string;
}
