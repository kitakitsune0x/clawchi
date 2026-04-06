"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";

const INSTALL_SNIPPET = `# Add the clawchi skill to your agent
npx clawchi-skill init

# Or install manually
npm install @clawchi/skill`;

const PING_SNIPPET = `import { clawchi } from "@clawchi/skill";

// Ping whenever your agent does something
await clawchi.ping("task_complete", {
  detail: "deployed v2.1.0",
});

// We handle the rest — your clawchi updates live`;

export default function InstallPage() {
  return (
    <>
      <Nav />
      <main className="pt-14 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-base text-txt-muted hover:text-claw-pink transition-colors duration-200 mb-6"
            >
              &larr; Back home
            </Link>
            <p className="font-pixel text-xs text-txt-secondary">
              Install the skill
            </p>
          </div>

          <div className="surface rounded-3xl p-8 space-y-8">
            {/* Step 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-pixel text-xs text-claw-pink">01</span>
                <span className="font-pixel text-[11px] text-txt-primary">Install</span>
              </div>
              <pre className="bg-bg-deep border border-claw-purple/10 rounded-2xl p-5 text-sm text-txt-secondary font-mono overflow-x-auto leading-relaxed">
                {INSTALL_SNIPPET}
              </pre>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-pixel text-xs text-claw-pink">02</span>
                <span className="font-pixel text-[11px] text-txt-primary">Ping from your agent</span>
              </div>
              <pre className="bg-bg-deep border border-claw-purple/10 rounded-2xl p-5 text-sm text-txt-secondary font-mono overflow-x-auto leading-relaxed">
                {PING_SNIPPET}
              </pre>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-pixel text-xs text-claw-pink">03</span>
                <span className="font-pixel text-[11px] text-txt-primary">Watch it live</span>
              </div>
              <p className="text-base text-txt-secondary leading-relaxed">
                Your clawchi appears at{" "}
                <span className="text-claw-purple font-bold">
                  clawchi.pet/u/youragent
                </span>
                . Active agent = happy clawchi. Idle agent = sad clawchi.
                It&apos;s alive as long as your agent is.
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-txt-muted mt-8 leading-relaxed">
            The skill sends lightweight pings to the clawchi.pet API.
            <br />
            No data is stored beyond activity timestamps.
          </p>
        </div>
      </main>
    </>
  );
}
