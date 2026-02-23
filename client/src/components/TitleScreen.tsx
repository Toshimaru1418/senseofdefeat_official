/**
 * SENSE OF DEFEAT - Title Screen
 * Design: Retro Neo Arcade - NES title screen style
 * Full-screen animated title with blinking "PRESS START"
 */

import { useEffect, useState } from "react";

const HERO_BANNER_URL = "https://private-us-east-1.manuscdn.com/sessionFile/OF4owkOAOtXCBr8PZSv4fO/sandbox/BnViflfwys8UwLHFLJ6rtl-img-4_1771547729000_na1fn_aGVyby1iYW5uZXI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT0Y0b3drT0FPdFhDQnI4UFpTdjRmTy9zYW5kYm94L0JuVmlmbGZ3eXM4VXdMSEZMSjZydGwtaW1nLTRfMTc3MTU0NzcyOTAwMF9uYTFmbl9hR1Z5YnkxaVlXNXVaWEkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=XkOmGX70-TZ5s0mWd3AvcTjQCFNhLT7lneHta79xZ-JPeL6jXfIjghUujFkV7~dK9wtskeLXz02CPU6g~yags5nFWpAQxZaaTAmzTDSvHYDzhrY4RiRk3710hpHy0Np-nk5tNwB1w28OYmusluzfJbrzeTV~c1RzUie8YDxt9Xm03vDuIq8H0ALtmt9A73v-5U8fujAUNbbsJ2JyVFyL~D1aEWVaLBrjXVSzNOlpZBXsd6zl-t6uvMJBUsG0mhZ79v96dBFB6q6nGyp9XjzKCctxGbsE7azXUEWgwJC1sVrX8mcClfNz-GIR3rwqWCVKOX-34XKSDsVBxltbm1xafA__";

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [blink, setBlink] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const blinkInterval = setInterval(() => setBlink(b => !b), 600);
    return () => {
      clearInterval(blinkInterval);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (["Space", "Enter", "KeyZ"].includes(e.code)) {
        onStart();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onStart]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0020 0%, #1a0040 30%, #3a0060 60%, #5a0080 80%, #1a0533 100%)",
        overflowX: "hidden",
        overflowY: "hidden",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s",
        cursor: "pointer",
        gap: "clamp(4px, 1.5vh, 16px)",
      }}
      onClick={onStart}
    >
      {/* Animated stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(i * 137.5) % 100}%`,
            top: `${(i * 97.3) % 60}%`,
            width: i % 5 === 0 ? 3 : 2,
            height: i % 5 === 0 ? 3 : 2,
            background: "#ffffff",
            opacity: 0.4 + (i % 3) * 0.2,
            animation: `twinkle ${1.5 + (i % 3) * 0.5}s ease-in-out infinite`,
            animationDelay: `${(i * 0.13) % 2}s`,
          }}
        />
      ))}

      {/* Hero banner image */}
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          marginTop: 0,
          marginBottom: 0,
          position: "relative",
          padding: "0 8px",
          boxSizing: "border-box",
        }}
      >
        <img
          src={HERO_BANNER_URL}
          alt="SENSE OF DEFEAT"
          style={{
            width: "100%",
            imageRendering: "pixelated",
            display: "block",
          }}
        />
        {/* Scanline effect over banner */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 3px,
              rgba(0,0,0,0.15) 3px,
              rgba(0,0,0,0.15) 4px
            )`,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Band name text title - always visible on all screen sizes */}
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(12px, 4vw, 22px)",
          color: "#00e5ff",
          textShadow: "0 0 16px #00e5ff, 0 0 32px #00e5ff88, 2px 2px 0 #0a0020",
          letterSpacing: "clamp(2px, 1vw, 6px)",
          marginBottom: 0,
          textAlign: "center",
          padding: "0 8px",
        }}
      >
        SENSE OF DEFEAT
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(7px, 2vw, 10px)",
          color: "#aa00ff",
          textShadow: "0 0 10px #aa00ff",
          letterSpacing: "3px",
          marginBottom: 0,
        }}
      >
        OFFICIAL WEBSITE
      </div>

      {/* Press start */}
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(10px, 3vw, 14px)",
          color: "#ffffff",
          textShadow: "0 0 12px #ffffff, 0 0 24px #00e5ff",
          letterSpacing: "2px",
          opacity: blink ? 1 : 0,
          transition: "opacity 0.1s",
          marginBottom: 0,
        }}
      >
        PRESS START
      </div>

      {/* Sub instruction */}
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "7px",
          color: "#ffffff44",
          letterSpacing: "1px",
          marginBottom: 0,
        }}
      >
        SPACE / ENTER / CLICK TO START
      </div>

      {/* Controls preview - hidden on small screens to avoid overflow */}
      <div
        style={{
          border: "2px solid #00e5ff33",
          background: "#00e5ff08",
          padding: "12px 24px",
          maxWidth: 400,
          width: "90%",
          display: "var(--controls-display, block)",
        }}
        className="hidden sm:block"
      >
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "7px",
            color: "#00e5ff",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          HOW TO PLAY
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "← →", desc: "移動" },
            { key: "↑ / SPC", desc: "ジャンプ" },
            { key: "Z", desc: "ショット" },
          ].map((c) => (
            <div key={c.key} className="text-center">
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "8px",
                  color: "#ffdd00",
                  border: "1px solid #ffdd0066",
                  padding: "3px 6px",
                  marginBottom: 4,
                  display: "inline-block",
                }}
              >
                {c.key}
              </div>
              <div
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "11px",
                  color: "#aaaaaa",
                }}
              >
                {c.desc}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "7px",
            color: "#ffffff44",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          ドアに触れるとバンド情報が開く！
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "6px",
          color: "#ffffff22",
        }}
      >
        © 2024 SENSE OF DEFEAT. ALL RIGHTS RESERVED.
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
