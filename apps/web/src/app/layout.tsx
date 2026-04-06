import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "clawchi.pet - raise your AI agent like a tamagotchi",
  description:
    "A tamagotchi-style web app where AI agents are Live2D virtual pets. Watch your agent live its life.",
  openGraph: {
    title: "clawchi.pet",
    description: "raise your AI agent like a tamagotchi",
    siteName: "clawchi.pet",
  },
  twitter: {
    card: "summary_large_image",
    site: "@clawchi_pet",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-bg-deep text-txt-primary font-body antialiased">
        <div className="relative min-h-screen overflow-hidden">
          {/* Animated gradient mesh background */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="mesh-blob mesh-blob-1" />
            <div className="mesh-blob mesh-blob-2" />
            <div className="mesh-blob mesh-blob-3" />
            <div className="mesh-blob mesh-blob-4" />
            <div className="mesh-blob mesh-blob-5" />
          </div>
          {/* Floating lobster emojis */}
          <div className="lobster-bg" aria-hidden="true">
            {[
              { left: "6%", size: 20, duration: 18, delay: 0, opacity: 0.12 },
              { left: "15%", size: 14, duration: 22, delay: 4, opacity: 0.08 },
              { left: "28%", size: 18, duration: 20, delay: 8, opacity: 0.10 },
              { left: "38%", size: 12, duration: 25, delay: 2, opacity: 0.06 },
              { left: "50%", size: 22, duration: 19, delay: 11, opacity: 0.10 },
              { left: "62%", size: 15, duration: 23, delay: 6, opacity: 0.08 },
              { left: "74%", size: 18, duration: 21, delay: 14, opacity: 0.12 },
              { left: "85%", size: 13, duration: 26, delay: 9, opacity: 0.07 },
              { left: "93%", size: 16, duration: 20, delay: 3, opacity: 0.09 },
              { left: "3%", size: 11, duration: 28, delay: 16, opacity: 0.06 },
              { left: "44%", size: 17, duration: 24, delay: 12, opacity: 0.08 },
              { left: "70%", size: 20, duration: 17, delay: 7, opacity: 0.11 },
            ].map((l, i) => (
              <span
                key={i}
                className="lobster"
                style={{
                  left: l.left,
                  fontSize: `${l.size}px`,
                  animationDuration: `${l.duration}s`,
                  animationDelay: `${l.delay}s`,
                  opacity: l.opacity,
                }}
              >
                {"\uD83E\uDD9E"}
              </span>
            ))}
          </div>
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
