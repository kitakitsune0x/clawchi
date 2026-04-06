-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clawchis" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model_id" TEXT NOT NULL DEFAULT 'haru',
    "body_type" TEXT NOT NULL DEFAULT 'girl',
    "color_palette" TEXT NOT NULL DEFAULT 'pink',
    "accessory" TEXT NOT NULL DEFAULT 'none',
    "mood" INTEGER NOT NULL DEFAULT 50,
    "energy" INTEGER NOT NULL DEFAULT 50,
    "social" INTEGER NOT NULL DEFAULT 50,
    "activity" INTEGER NOT NULL DEFAULT 50,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clawchis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "detail" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agents_name_key" ON "agents"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clawchis_agent_id_key" ON "clawchis"("agent_id");

-- CreateIndex
CREATE INDEX "activity_logs_agent_id_timestamp_idx" ON "activity_logs"("agent_id", "timestamp");

-- AddForeignKey
ALTER TABLE "clawchis" ADD CONSTRAINT "clawchis_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
