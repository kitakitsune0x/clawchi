import { Hono } from "hono";
import { nanoid } from "nanoid";
import type {
  RegisterRequest,
  RegisterResponse,
  PingRequest,
  PingResponse,
} from "@clawchi/types";
import { MODEL_IDS } from "@clawchi/types";
import { prisma, cacheSet, cacheInvalidate, publishUpdate } from "../db";

const agent = new Hono();

agent.post("/register", async (c) => {
  const body = await c.req.json<RegisterRequest>();

  if (!body.agentName || !body.clawchiName) {
    return c.json({ error: "agentName and clawchiName are required" }, 400);
  }

  if (body.agentName.length < 2 || body.agentName.length > 32) {
    return c.json({ error: "agentName must be 2-32 characters" }, 400);
  }

  const apiKey = `clawchi_${nanoid(32)}`;
  const assignedModel = MODEL_IDS[Math.floor(Math.random() * MODEL_IDS.length)];

  try {
    const result = await prisma.agent.create({
      data: {
        name: body.agentName,
        apiKey,
        clawchi: {
          create: {
            name: body.clawchiName,
            modelId: assignedModel,
            bodyType: body.appearance?.bodyType || "girl",
            colorPalette: body.appearance?.colorPalette || "pink",
            accessory: body.appearance?.accessory || "none",
          },
        },
      },
      include: { clawchi: true },
    });

    return c.json<RegisterResponse>(
      { agentId: result.id, apiKey },
      201
    );
  } catch (err: any) {
    if (err.code === "P2002") {
      return c.json({ error: "agent name already taken" }, 409);
    }
    console.error("register error:", err);
    return c.json({ error: "registration failed" }, 500);
  }
});

agent.post("/ping", async (c) => {
  const body = await c.req.json<PingRequest>();

  if (!body.agentId || !body.action) {
    return c.json({ error: "agentId and action are required" }, 400);
  }

  try {
    const ag = await prisma.agent.findUnique({
      where: { id: body.agentId },
      include: { clawchi: true },
    });

    if (!ag || !ag.clawchi) {
      return c.json({ error: "agent not found" }, 404);
    }

    await prisma.agent.update({
      where: { id: body.agentId },
      data: { lastSeen: new Date() },
    });

    await prisma.activityLog.create({
      data: {
        agentId: body.agentId,
        action: body.action,
        detail: body.detail,
      },
    });

    const bump =
      body.action === "task_complete"
        ? 5
        : body.action === "error"
          ? -10
          : body.action === "reply" || body.action === "message"
            ? 3
            : 2;

    const xpGain =
      body.action === "task_complete"
        ? 25
        : body.action === "reply" || body.action === "message"
          ? 10
          : body.action === "error"
            ? 2
            : 5;

    const clamp = (v: number) => Math.max(0, Math.min(100, v));

    let newXp = ag.clawchi.xp + xpGain;
    let newLevel = ag.clawchi.level;
    const xpForLevel = (lvl: number) => lvl * 500;

    while (newXp >= xpForLevel(newLevel)) {
      newXp -= xpForLevel(newLevel);
      newLevel++;
    }

    const updated = await prisma.clawchi.update({
      where: { agentId: body.agentId },
      data: {
        mood: clamp(ag.clawchi.mood + bump),
        energy: clamp(ag.clawchi.energy + 2),
        social: clamp(
          ag.clawchi.social +
            (body.action === "reply" || body.action === "message" ? 5 : 1)
        ),
        activity: clamp(ag.clawchi.activity + 3),
        xp: newXp,
        level: newLevel,
      },
    });

    const stats = {
      mood: updated.mood,
      energy: updated.energy,
      social: updated.social,
      activity: updated.activity,
    };

    await cacheInvalidate(`clawchi:stats:${ag.name}`);
    await cacheInvalidate(`clawchi:profile:${ag.name}`);
    await cacheSet(`clawchi:stats:${ag.name}`, stats);
    await publishUpdate(ag.name, { type: "stats", stats });

    return c.json<PingResponse>({ ok: true, stats });
  } catch (err) {
    console.error("ping error:", err);
    return c.json({ error: "ping failed" }, 500);
  }
});

export { agent };
