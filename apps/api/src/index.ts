import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { agent } from "./routes/agent";
import { clawchi } from "./routes/clawchi";
import { sse } from "./routes/sse";
import { connectRedis } from "./db";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://clawchi.pet"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (c) => c.json({ name: "clawchi.pet API", version: "0.1.0" }));
app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/agent", agent);
app.route("/api/clawchi", clawchi);
app.route("/api/sse", sse);

const port = parseInt(process.env.PORT || "3001", 10);

async function start() {
  await connectRedis();
  console.log(`clawchi API starting on port ${port}`);
  serve({ fetch: app.fetch, port });
}

start();
