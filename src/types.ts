export interface Speaker {
  id: string;
  name: string;
  role: string;
  persona: string;
  color: string; // Tailwind bg/text color, e.g., "indigo"
  avatarSeed: string; // Used for unique visual identification
  provider?: string; // Optional provider, e.g., "OpenAI"
}

export interface DebateTurn {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  speakerColor: string;
  message: string;
  round: number;
  timestamp: string;
}

export interface UserIntervention {
  id: string;
  round: number;
  message: string;
  timestamp: string;
}

export interface RoadmapStep {
  title: string;
  phase: string;
  description: string;
  priority: string;
}

export interface ConsensusReport {
  executiveSummary: string;
  consensusScore: number;
  keyAgreements: string[];
  keyDisagreements: string[];
  actionSteps: (string | RoadmapStep)[];
  finalVerdict: string;
  pros: string[];
  cons: string[];
  modelPositions: {
    modelName: string;
    coreAnswer: string;
  }[];
}

export interface FileAttachment {
  name: string;
  type: string;
  base64: string;
  size: number;
}

export interface DebateSession {
  id: string;
  topic: string;
  speakers: Speaker[];
  turns: DebateTurn[];
  userInterventions: UserIntervention[];
  status: "idle" | "running" | "paused" | "synthesizing" | "completed" | "error";
  currentRound: number;
  currentSpeakerIndex: number;
  maxRounds: number;
  consensusReport?: ConsensusReport;
  createdAt: string;
  model: string;
  error?: string;
  attachments?: FileAttachment[];
}
