// --- Model pool ---

export type ModelId = "haru" | "hiyori" | "mao" | "mark" | "natori" | "rice";

export const MODEL_IDS: ModelId[] = ["haru", "hiyori", "mao", "mark", "natori", "rice"];

export const MODEL_LABELS: Record<ModelId, string> = {
  haru: "Haru",
  hiyori: "Hiyori",
  mao: "Mao",
  mark: "Mark",
  natori: "Natori",
  rice: "Rice",
};

// --- Appearance customization ---

export type BodyType = "girl" | "boy" | "creature";

export type ColorPalette = "pink" | "purple" | "blue" | "green" | "red";

export type Accessory = "none" | "hat" | "bow" | "glasses" | "crown";

export const BODY_TYPES: BodyType[] = ["girl", "boy", "creature"];
export const COLOR_PALETTES: ColorPalette[] = ["pink", "purple", "blue", "green", "red"];
export const ACCESSORIES: Accessory[] = ["none", "hat", "bow", "glasses", "crown"];

export const COLOR_HEX: Record<ColorPalette, string> = {
  pink: "#F77EB3",
  purple: "#B98FD4",
  blue: "#7EB8F7",
  green: "#7EF7A0",
  red: "#F77E7E",
};

export interface ClawchiAppearance {
  bodyType: BodyType;
  colorPalette: ColorPalette;
  accessory: Accessory;
}

// --- Core types ---

export type AgentAction =
  | "task_complete"
  | "reply"
  | "message"
  | "post"
  | "error"
  | "heartbeat"
  | "idle"
  | "active";

export interface ClawchiStats {
  mood: number;
  energy: number;
  social: number;
  activity: number;
}

export type AgentStatus = "active" | "idle" | "sleeping";

export type ClawchiState = "egg" | "alive" | "sick" | "dead";

export type ClawchiMood = "idle" | "happy" | "sad" | "excited";

export type ActivityType =
  | "task_complete"
  | "reply"
  | "message"
  | "error"
  | "went_idle"
  | "came_online";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  detail?: string;
  timestamp: string;
  relativeTime: string;
}

export interface ClawchiProfile {
  agentName: string;
  clawchiName: string;
  modelId: ModelId;
  appearance: ClawchiAppearance;
  level: number;
  xp: number;
  xpToNext: number;
  age: number;
  stats: ClawchiStats;
  status: AgentStatus;
  mood: ClawchiMood;
  activity: ActivityEntry[];
}

export interface FeaturedClawchi {
  agentName: string;
  clawchiName: string;
  modelId: ModelId;
  appearance: ClawchiAppearance;
  level: number;
  stats: ClawchiStats;
  status: AgentStatus;
  mood: ClawchiMood;
}

// --- API request/response types ---

export interface RegisterRequest {
  agentName: string;
  clawchiName: string;
  appearance: ClawchiAppearance;
}

export interface RegisterResponse {
  agentId: string;
  apiKey: string;
}

export interface PingRequest {
  agentId: string;
  action: AgentAction;
  detail?: string;
}

export interface PingResponse {
  ok: boolean;
  stats: ClawchiStats;
}
