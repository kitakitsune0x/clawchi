import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { redisSub } from "../db";

const sse = new Hono();

sse.get("/:name", async (c) => {
  const { name } = c.req.param();
  const channel = `clawchi:update:${name}`;

  return streamSSE(c, async (stream) => {
    const handler = (_ch: string, message: string) => {
      stream.writeSSE({ data: message, event: "update" }).catch(() => {});
    };

    try {
      await redisSub.subscribe(channel);
      redisSub.on("message", handler);
    } catch {
      await stream.writeSSE({
        data: JSON.stringify({ error: "redis not available" }),
        event: "error",
      });
      return;
    }

    await stream.writeSSE({
      data: JSON.stringify({ connected: true, agent: name }),
      event: "connected",
    });

    stream.onAbort(() => {
      redisSub.unsubscribe(channel).catch(() => {});
      redisSub.removeListener("message", handler);
    });

    // Keep alive
    while (true) {
      await stream.writeSSE({ data: "", event: "ping" });
      await stream.sleep(30000);
    }
  });
});

export { sse };
