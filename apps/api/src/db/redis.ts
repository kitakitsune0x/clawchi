import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 5) return null;
    return Math.min(times * 200, 2000);
  },
  lazyConnect: true,
});

export const redisSub = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on("error", (err) => {
  console.error("[redis] error:", err.code || err.message);
});

redisSub.on("error", (err) => {
  console.error("[redis-sub] error:", err.code || err.message);
});

const CACHE_TTL = 300; // 5 minutes

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttl = CACHE_TTL
): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
  } catch {
    // cache write failure is non-fatal
  }
}

export async function cacheInvalidate(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // cache invalidation failure is non-fatal
  }
}

export async function publishUpdate(
  agentName: string,
  data: unknown
): Promise<void> {
  try {
    await redis.publish(
      `clawchi:update:${agentName}`,
      JSON.stringify(data)
    );
  } catch {
    // pub/sub failure is non-fatal
  }
}

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
    await redisSub.connect();
    console.log("[redis] connected");
  } catch (err: any) {
    console.warn("[redis] not available, running without cache:", err.message);
  }
}
