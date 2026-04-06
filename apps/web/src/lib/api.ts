import type { FeaturedClawchi, ClawchiProfile } from "@clawchi/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchClawchis(): Promise<FeaturedClawchi[]> {
  const res = await fetch(`${API_URL}/api/clawchi`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch clawchis");
  return res.json();
}

export async function fetchClawchi(name: string): Promise<ClawchiProfile | null> {
  const res = await fetch(`${API_URL}/api/clawchi/${name}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}
