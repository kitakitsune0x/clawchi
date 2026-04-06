import Link from "next/link";
import { Logo } from "@clawchi/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Logo size="md" className="mb-6" />
      <h1 className="font-pixel text-2xl text-txt-primary mb-3">
        404
      </h1>
      <p className="text-txt-secondary text-base mb-8">
        This clawchi doesn&apos;t exist... yet.
      </p>
      <Link
        href="/"
        className="px-7 py-3 bg-gradient-to-r from-claw-pink to-claw-purple text-white font-bold rounded-full hover:opacity-90 hover:scale-105 transition-all duration-200 text-base"
      >
        Back home
      </Link>
    </div>
  );
}
