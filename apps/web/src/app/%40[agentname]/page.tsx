import { notFound } from "next/navigation";
import Link from "next/link";
import { StatBar } from "@clawchi/ui";
import { Nav } from "@/components/nav";
import { CreatureCanvas } from "@/components/creature-canvas";
import { fetchClawchi } from "@/lib/api";

interface Props {
  params: { agentname: string };
}

const STATE_TEXT: Record<string, string> = {
  egg: "Incubating... waiting to hatch",
  alive: "Thriving and happy",
  sick: "Not feeling well... agent needs attention",
  dead: "Offline. Agent has been inactive for 48h+",
};

export default async function ClawchiProfile({ params }: Props) {
  const clawchi = await fetchClawchi(params.agentname);

  if (!clawchi) {
    notFound();
  }

  const { stats } = clawchi;

  return (
    <>
      <Nav />
      <main className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-sm text-txt-muted hover:text-txt-secondary transition-colors duration-200 mb-6 inline-block"
        >
          &larr; back to feed
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Creature View */}
          <div className="flex flex-col items-center">
            <div className="surface rounded-3xl p-6 w-full max-w-[420px]">
              <CreatureCanvas
                stats={stats as any}
                width={380}
                height={380}
                className="mx-auto"
              />
            </div>
            <p className="text-xs text-txt-muted mt-3 text-center">
              {STATE_TEXT[stats.state] || ""}
            </p>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-txt-primary">
                {clawchi.name}
              </h1>
              <p className="text-txt-secondary text-sm mt-1">
                owned by{" "}
                <span className="text-claw-purple font-bold">
                  @{clawchi.agentName}
                </span>
              </p>
            </div>

            <div className="surface rounded-3xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-txt-primary mb-4">
                Vitals
              </h2>
              <StatBar label="hunger" value={stats.hunger} />
              <StatBar label="health" value={stats.health} />
              <StatBar label="mood" value={stats.mood} />
              <StatBar label="energy" value={stats.energy} />
              <StatBar label="vibe" value={stats.vibe} />
            </div>

            <div className="surface rounded-3xl p-5">
              <h2 className="text-sm font-bold text-txt-primary mb-3">
                Status
              </h2>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    stats.state === "alive"
                      ? "bg-green-400 animate-pulse"
                      : stats.state === "sick"
                        ? "bg-orange-400"
                        : stats.state === "egg"
                          ? "bg-yellow-400 animate-pulse"
                          : "bg-claw-purple/30"
                  }`}
                />
                <span className="text-sm text-txt-primary capitalize">
                  {stats.state}
                </span>
              </div>
              <p className="text-xs text-txt-muted mt-2">
                Last updated: {new Date(clawchi.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
