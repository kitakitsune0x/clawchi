"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavProps {
  transparent?: boolean;
}

export function Nav({ transparent = false }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const solid = !transparent || scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "glass-strong shadow-lg shadow-black/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[4.5rem] sm:min-h-20 py-2 flex items-center justify-between gap-4">
        <Link href="/" className="hover:opacity-80 transition-opacity duration-200 shrink-0">
          <Image
            src="/clawchi_logo.png"
            alt="Clawchi!"
            width={280}
            height={112}
            className="h-14 sm:h-16 md:h-[4.5rem] w-auto max-w-[min(52vw,280px)]"
            priority
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <Link
            href="/install"
            className="btn-rainbow px-5 sm:px-6 py-2.5 text-white rounded-full text-sm font-bold hover:shadow-lg hover:shadow-claw-pink/15 hover:scale-105 transition-all duration-200 whitespace-nowrap"
          >
            Install Skill
          </Link>
        </div>
      </div>
    </nav>
  );
}
