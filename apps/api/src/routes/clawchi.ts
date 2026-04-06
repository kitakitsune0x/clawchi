import { Hono } from "hono";
import { prisma, cacheGet, cacheSet } from "../db";

function deriveStatus(lastSeen: Date): "active" | "idle" | "sleeping" {
  const diff = Date.now() - lastSeen.getTime();
  if (diff < 5 * 60 * 1000) return "active";
  if (diff < 30 * 60 * 1000) return "idle";
  return "sleeping";
}

function deriveMood(moodStat: number): "idle" | "happy" | "sad" | "excited" {
  if (moodStat >= 85) return "excited";
  if (moodStat >= 55) return "happy";
  if (moodStat < 30) return "sad";
  return "idle";
}

function xpForLevel(level: number): number {
  return level * 500;
}

const clawchi = new Hono();

clawchi.get("/", async (c) => {
  try {
    const all = await prisma.clawchi.findMany({
      include: { agent: { select: { name: true, lastSeen: true } } },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    return c.json(
      all.map((cl) => ({
        agentName: cl.agent.name,
        clawchiName: cl.name,
        modelId: cl.modelId,
        appearance: {
          bodyType: cl.bodyType,
          colorPalette: cl.colorPalette,
          accessory: cl.accessory,
        },
        level: cl.level,
        stats: {
          mood: cl.mood,
          energy: cl.energy,
          social: cl.social,
          activity: cl.activity,
        },
        status: deriveStatus(cl.agent.lastSeen),
        mood: deriveMood(cl.mood),
        lastSeen: cl.agent.lastSeen,
      }))
    );
  } catch (err) {
    console.error("list error:", err);
    return c.json([], 200);
  }
});

clawchi.get("/:name", async (c) => {
  const { name } = c.req.param();

  const cached = await cacheGet<any>(`clawchi:profile:${name}`);
  if (cached) return c.json(cached);

  try {
    const agent = await prisma.agent.findUnique({
      where: { name },
      include: {
        clawchi: true,
        activityLogs: {
          orderBy: { timestamp: "desc" },
          take: 20,
        },
      },
    });

    if (!agent || !agent.clawchi) {
      return c.json({ error: "clawchi not found" }, 404);
    }

    const cl = agent.clawchi;
    const now = Date.now();

    const profile = {
      agentName: agent.name,
      clawchiName: cl.name,
      modelId: cl.modelId,
      appearance: {
        bodyType: cl.bodyType,
        colorPalette: cl.colorPalette,
        accessory: cl.accessory,
      },
      level: cl.level,
      xp: cl.xp,
      xpToNext: xpForLevel(cl.level),
      stats: {
        mood: cl.mood,
        energy: cl.energy,
        social: cl.social,
        activity: cl.activity,
      },
      status: deriveStatus(agent.lastSeen),
      mood: deriveMood(cl.mood),
      age: Math.floor(
        (now - agent.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      ),
      lastSeen: agent.lastSeen,
      activity: agent.activityLogs.map((log) => ({
        id: log.id,
        type: log.action,
        detail: log.detail,
        timestamp: log.timestamp.toISOString(),
        relativeTime: formatRelative(log.timestamp, now),
      })),
    };

    await cacheSet(`clawchi:profile:${name}`, profile);
    return c.json(profile);
  } catch (err) {
    console.error("profile error:", err);
    return c.json({ error: "failed to load profile" }, 500);
  }
});

function formatRelative(date: Date, now: number): string {
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export { clawchi };
