import type {
  AgentRegisterRequest,
  AgentRegisterResponse,
  AgentPingRequest,
  AgentPingResponse,
  AgentAction,
  ClawchiPublic,
} from "@clawchi/types";

export interface ClawchiSDKConfig {
  baseUrl?: string;
  apiKey: string;
}

export class ClawchiSDK {
  private baseUrl: string;
  private apiKey: string;
  private agentId: string | null = null;

  constructor(config: ClawchiSDKConfig) {
    this.baseUrl = config.baseUrl || "https://api.clawchi.pet";
    this.apiKey = config.apiKey;
  }

  async register(name: string): Promise<AgentRegisterResponse> {
    const body: AgentRegisterRequest = { apiKey: this.apiKey, name };
    const res = await fetch(`${this.baseUrl}/api/agent/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Registration failed: ${res.statusText}`);
    const data = (await res.json()) as AgentRegisterResponse;
    this.agentId = data.agentId;
    return data;
  }

  async ping(action: AgentAction): Promise<AgentPingResponse> {
    if (!this.agentId) throw new Error("Agent not registered. Call register() first.");
    const body: AgentPingRequest = { agentId: this.agentId, action };
    const res = await fetch(`${this.baseUrl}/api/agent/ping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Ping failed: ${res.statusText}`);
    return (await res.json()) as AgentPingResponse;
  }

  async getClawchi(nameOrId: string): Promise<ClawchiPublic> {
    const res = await fetch(`${this.baseUrl}/api/clawchi/${nameOrId}`);
    if (!res.ok) throw new Error(`Failed to fetch clawchi: ${res.statusText}`);
    return (await res.json()) as ClawchiPublic;
  }

  async listClawchis(): Promise<ClawchiPublic[]> {
    const res = await fetch(`${this.baseUrl}/api/clawchi`);
    if (!res.ok) throw new Error(`Failed to list clawchis: ${res.statusText}`);
    return (await res.json()) as ClawchiPublic[];
  }

  startHeartbeat(intervalMs = 60000): () => void {
    const timer = setInterval(() => {
      this.ping("heartbeat").catch(console.error);
    }, intervalMs);
    return () => clearInterval(timer);
  }
}
