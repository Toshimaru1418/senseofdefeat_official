import { useEffect, useState } from "react";

interface CharSelectScreenProps {
  onSelect: (charId: "toshi" | "yuichi" | "ramirez" | "yuj" | "mirko") => void;
}

const chars = [
  { id: "toshi" as const, name: "Toshi", img: "/toshi.png", desc: "Vo." },
  { id: "yuichi" as const, name: "Yuichi", img: "/yuichi.png", desc: "Gt." },
  {
    id: "ramirez" as const,
    name: "Ramirez",
    img: "/ramirez.png",
    desc: "Gt./Cho.",
  },
  { id: "yuj" as const, name: "Yuj", img: "/yuj.png", desc: "Ba./Cho." },
  { id: "mirko" as const, name: "Mirko", img: "/mirko.png", desc: "Dr." },
];

export function CharSelectScreen({ onSelect }: CharSelectScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") {
        setSelectedIndex(i => (i > 0 ? i - 1 : chars.length - 1));
      } else if (e.code === "ArrowRight") {
        setSelectedIndex(i => (i < chars.length - 1 ? i + 1 : 0));
      } else if (["Space", "Enter", "KeyZ"].includes(e.code)) {
        onSelect(chars[selectedIndex].id);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, onSelect]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0020 0%, #1a0040 100%)",
        color: "#fff",
      }}
    >
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(12px, 3vh, 20px)",
          color: "#00e5ff",
          textShadow: "0 0 16px #00e5ff",
          marginBottom: "clamp(20px, 4vh, 40px)",
          textAlign: "center",
        }}
      >
        SELECT YOUR HERO
      </div>

      <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center w-full max-w-5xl px-2 sm:px-4">
        {chars.map((char, i) => {
          const isSelected = i === selectedIndex;
          return (
            <div
              key={char.id}
              onClick={() => onSelect(char.id)}
              onMouseEnter={() => setSelectedIndex(i)}
              style={{
                border: `clamp(2px, 0.5vw, 4px) solid ${isSelected ? "#00e5ff" : "#ffffff33"}`,
                background: isSelected ? "#00e5ff22" : "rgba(0,0,0,0.5)",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
                transition: "all 0.2s",
                cursor: "pointer",
                padding: "clamp(4px, 1.5vw, 20px)",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "18%",
                minWidth: "40px",
              }}
            >
              <div
                style={{
                  height: "clamp(50px, 20vh, 120px)",
                  display: "flex",
                  alignItems: "flex-end",
                  marginBottom: "clamp(8px, 2vh, 20px)",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <img
                  src={char.img}
                  alt={char.name}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    imageRendering: "pixelated",
                    filter: isSelected
                      ? "drop-shadow(0 0 10px #00e5ff)"
                      : "brightness(0.5)",
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "8px",
                  color: isSelected ? "#fff" : "#888",
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
              >
                {char.name}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "clamp(20px, 4vh, 40px)",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(6px, 1.5vw, 8px)",
          color: "#ffffff66",
        }}
      >
        USE ← → TO SELECT, PRESS START
      </div>
    </div>
  );
}
