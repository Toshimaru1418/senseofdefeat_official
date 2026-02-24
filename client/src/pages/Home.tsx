/**
 * SENSE OF DEFEAT - Main Game Page
 * Design: Retro Neo Arcade / Mega Man inspired
 * Colors: Deep purple/magenta sky, blue platforms, red enemies, yellow items
 * Font: Press Start 2P (UI) + Noto Sans JP (content)
 * Layout: Full-screen canvas game with HUD overlay
 */

import { useRef, useEffect, useCallback, useState } from "react";
import { useGameEngine } from "@/hooks/useGameEngine";
import { useGameRenderer } from "@/hooks/useGameRenderer";
import { GameHUD, ControlsGuide, MobileControls } from "@/components/GameHUD";
import { GameModal } from "@/components/GameModal";
import { TitleScreen } from "@/components/TitleScreen";
import { CharSelectScreen } from "@/components/CharSelectScreen";

const BG_URL =
  "https://private-us-east-1.manuscdn.com/sessionFile/OF4owkOAOtXCBr8PZSv4fO/sandbox/BnViflfwys8UwLHFLJ6rtl-img-1_1771547719000_na1fn_YmctY2l0eS1kdXNr.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT0Y0b3drT0FPdFhDQnI4UFpTdjRmTy9zYW5kYm94L0JuVmlmbGZ3eXM4VXdMSEZMSjZydGwtaW1nLTFfMTc3MTU0NzcxOTAwMF9uYTFmbl9ZbWN0WTJsMGVTMWtkWE5yLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=VPRrtSejcJXwIWI~fJr90Y07uq8z6MLLEEmcICeKf~~R36VeWDUZwSelsHMdc4TysR3t1~4dAW6VeAu9hbKQtS4GLzxTT7-xjTNTGmCFEttHWK0r0QKqpl8BVGc0EOwSb9f2BiZCEMBt9yqBBReI9S1~Hwb3cXAHNx0mPnG-rzh2~dVwaUD4MdPMBrEjvPBIql73HBWXUBkRP6v58KLnca7V9ISp98czxsr2fNFppCstOQZqUxsPqLlt37Np3K6GdEw56VO8vWQb~nUtYBFJ19ocrH15g~FwltOVrtV~oqu0bnkINKiL~17DsIefklvA31SG2gd9xmc1db0jtyN0Gw__";

const BGM_URL =
  "https://files.manuscdn.com/user_upload_by_module/session_file/95086222/zOXpmUuVBfGMvdze.mp3";

// Minimap component
function Minimap({
  cameraX,
  playerX,
  worldWidth,
}: {
  cameraX: number;
  playerX: number;
  worldWidth: number;
}) {
  const MINIMAP_W = 200;
  const MINIMAP_H = 12;
  const sections = [
    { start: 0, end: 700, color: "#1565c0", label: "" },
    { start: 700, end: 1500, color: "#00e5ff", label: "P" },
    { start: 1500, end: 2500, color: "#aa00ff", label: "D" },
    { start: 2500, end: 3600, color: "#ff6d00", label: "L" },
    { start: 3600, end: 5000, color: "#ff1744", label: "F" },
  ];
  const gimmicks = [
    { x: 1280, color: "#00e5ff" },
    { x: 2450, color: "#aa00ff" },
    { x: 3550, color: "#ff6d00" },
    { x: 4850, color: "#00e676" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 28,
        right: 12,
        zIndex: 15,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "6px",
          color: "#ffffff66",
          marginBottom: 3,
          textAlign: "right",
        }}
      >
        MAP
      </div>
      <div
        style={{
          width: MINIMAP_W,
          height: MINIMAP_H,
          background: "#000000aa",
          border: "1px solid #ffffff22",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Section colors */}
        {sections.map(s => (
          <div
            key={s.start}
            style={{
              position: "absolute",
              left: `${(s.start / worldWidth) * 100}%`,
              width: `${((s.end - s.start) / worldWidth) * 100}%`,
              top: 0,
              height: "100%",
              background: `${s.color}44`,
              borderRight: `1px solid ${s.color}66`,
            }}
          />
        ))}
        {/* Gimmick markers */}
        {gimmicks.map(g => (
          <div
            key={g.x}
            style={{
              position: "absolute",
              left: `${(g.x / worldWidth) * 100}%`,
              top: 0,
              width: 2,
              height: "100%",
              background: g.color,
              boxShadow: `0 0 4px ${g.color}`,
            }}
          />
        ))}
        {/* Player position */}
        <div
          style={{
            position: "absolute",
            left: `${(playerX / worldWidth) * 100}%`,
            top: 0,
            width: 3,
            height: "100%",
            background: "#ffffff",
            boxShadow: "0 0 4px #ffffff",
            transform: "translateX(-50%)",
          }}
        />
        {/* Viewport indicator */}
        <div
          style={{
            position: "absolute",
            left: `${(cameraX / worldWidth) * 100}%`,
            top: 0,
            width: `${(800 / worldWidth) * 100}%`,
            height: "100%",
            border: "1px solid #ffffff44",
            background: "#ffffff11",
          }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [bgmEnabled, setBgmEnabled] = useState(true);

  // Initialize BGM audio element
  useEffect(() => {
    const audio = new Audio(BGM_URL);
    audio.loop = true;
    audio.volume = 0.5;
    bgmRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const {
    stateRef,
    gamePhase,
    modalContent,
    playerHp,
    maxHp,
    score,
    startCharSelect,
    selectCharacter,
    startGame,
    openModal,
    closeModal,
    resetGame,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
  } = useGameEngine(canvasRef);

  useGameRenderer(canvasRef, stateRef, bgImageRef);

  // Preload background image
  useEffect(() => {
    const img = new Image();
    img.src = BG_URL;
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, []);

  // Detect mobile and orientation
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mobile controls: inject keyboard events
  // repeat: false ensures justPressed is registered correctly (same as physical key first press)
  const pressKey = useCallback((code: string) => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { code, bubbles: true, repeat: false })
    );
  }, []);
  const releaseKey = useCallback((code: string) => {
    window.dispatchEvent(new KeyboardEvent("keyup", { code, bubbles: true }));
  }, []);

  // Wrap startCharSelect to also start BGM (requires user gesture)
  const handleStartTitle = useCallback(() => {
    startCharSelect();
    if (bgmRef.current && bgmEnabled) {
      bgmRef.current.play().catch(() => {
        // Autoplay blocked - will try again on next user interaction
      });
    }
    setTimeout(() => {
      canvasRef.current?.focus();
    }, 50);
  }, [startCharSelect, bgmEnabled]);

  const handleSelectCharacter = useCallback(
    (charId: "toshi" | "yuichi" | "ramirez" | "yuj" | "mirko") => {
      selectCharacter(charId);
      setTimeout(() => {
        canvasRef.current?.focus();
      }, 50);
    },
    [selectCharacter]
  );

  // Toggle BGM on/off
  const toggleBgm = useCallback(() => {
    setBgmEnabled(prev => {
      const next = !prev;
      if (bgmRef.current) {
        if (next) {
          bgmRef.current.play().catch(() => { });
        } else {
          bgmRef.current.pause();
        }
      }
      return next;
    });
  }, []);

  // Wrap closeModal to restore canvas focus after modal closes
  const handleCloseModal = useCallback(() => {
    closeModal();
    // Restore keyboard focus to canvas after a short delay
    setTimeout(() => {
      canvasRef.current?.focus();
    }, 50);
  }, [closeModal]);

  // Stage label
  const cameraX = stateRef.current.cameraX;
  const playerX = stateRef.current.player.x;
  let stageLabel = "STAGE 1";
  if (playerX > 4000) stageLabel = "FINAL STAGE";
  else if (playerX > 2500) stageLabel = "STAGE 3 - LIVE";
  else if (playerX > 1300) stageLabel = "STAGE 2 - DISCO";
  else if (playerX > 600) stageLabel = "STAGE 1 - PROFILE";

  const isGameOver = gamePhase === "playing" && playerHp <= 0;

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: "8px",
      }}
    >
      {/* Portrait mode warning for mobile */}
      {isMobile && isPortrait && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#050010",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            padding: "24px",
            textAlign: "center",
            fontFamily: "'Press Start 2P', monospace",
          }}
        >
          <div
            style={{
              fontSize: "clamp(12px, 4vw, 24px)",
              color: "#00e5ff",
              marginBottom: "32px",
              lineHeight: 1.5,
            }}
          >
            SENSE OF DEFEAT
          </div>
          <div
            style={{
              fontSize: "clamp(8px, 2.5vw, 14px)",
              lineHeight: 2,
              color: "#aaa",
            }}
          >
            このゲームは<span style={{ color: "#fff" }}>横画面プレイ</span>を想定しています。
            <br />
            <br />
            スマートフォンの画面を横向きに<br />持ち替えてお楽しみください。
            <br />
            <br />
            <div style={{ fontSize: "32px", marginTop: "16px" }}>📱 🔄</div>
          </div>
        </div>
      )}

      {/* Game container - fits viewport without scrolling */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "min(100%, calc((100dvh - 52px) * 16 / 9))",
          aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
          overflow: "hidden",
          boxShadow:
            "0 0 40px #00e5ff18, 0 0 80px #aa00ff0c, 0 4px 32px rgba(0,0,0,0.8)",
          border: "2px solid #00e5ff18",
          flexShrink: 0,
        }}
      >
        {/* Game canvas - tabIndex=0 allows focus for keyboard events */}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          tabIndex={0}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            imageRendering: "pixelated",
            outline: "none",
          }}
        />

        {/* HUD overlay */}
        {gamePhase === "playing" && !isGameOver && (
          <>
            <GameHUD
              hp={playerHp}
              maxHp={maxHp}
              score={score}
              stageLabel={stageLabel}
            />
            {!isMobile && <ControlsGuide />}
            <Minimap cameraX={cameraX} playerX={playerX} worldWidth={5000} />
          </>
        )}

        {/* Mobile controls */}
        {gamePhase === "playing" && isMobile && !isGameOver && (
          <MobileControls
            onLeft={() => pressKey("ArrowLeft")}
            onRight={() => pressKey("ArrowRight")}
            onJump={() => pressKey("Space")}
            onShoot={() => pressKey("KeyZ")}
            onLeftEnd={() => releaseKey("ArrowLeft")}
            onRightEnd={() => releaseKey("ArrowRight")}
            onJumpEnd={() => releaseKey("Space")}
            onShootEnd={() => releaseKey("KeyZ")}
          />
        )}

        {/* Title screen */}
        {gamePhase === "title" && <TitleScreen onStart={handleStartTitle} />}

        {/* Character Select screen */}
        {gamePhase === "charSelect" && (
          <CharSelectScreen onSelect={handleSelectCharacter} />
        )}

        {/* BGM toggle button - placed below HUD score row to avoid overlap */}
        {gamePhase === "playing" && !isGameOver && (
          <button
            onClick={toggleBgm}
            style={{
              position: "absolute",
              top: 36,
              right: 8,
              zIndex: 20,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "7px",
              color: bgmEnabled ? "#ffdd00" : "#ffffff33",
              border: `1px solid ${bgmEnabled ? "#ffdd0055" : "#ffffff22"}`,
              background: bgmEnabled ? "#ffdd0012" : "transparent",
              padding: "3px 7px",
              cursor: "pointer",
              transition: "all 0.15s",
              pointerEvents: "auto",
            }}
            title={bgmEnabled ? "BGMをオフにする" : "BGMをオンにする"}
          >
            {bgmEnabled ? "\u266a ON" : "\u266a OFF"}
          </button>
        )}

        {/* Modal */}
        {gamePhase === "modal" && modalContent && (
          <GameModal type={modalContent} onClose={handleCloseModal} />
        )}

        {/* Game Over overlay */}
        {isGameOver && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: "rgba(0,0,0,0.9)", zIndex: 30 }}
          >
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(16px, 4vw, 28px)",
                color: "#ff1744",
                textShadow: "0 0 20px #ff1744, 0 0 40px #ff174488",
                marginBottom: 8,
                animation: "gameOverPulse 1s ease-in-out infinite",
              }}
            >
              GAME OVER
            </div>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "10px",
                color: "#ffffff44",
                marginBottom: 32,
              }}
            >
              SCORE: {String(score).padStart(6, "0")}
            </div>
            <button
              onClick={() => {
                resetGame();
                if (bgmRef.current && bgmEnabled) {
                  bgmRef.current.currentTime = 0;
                  bgmRef.current.play().catch(() => { });
                }
                setTimeout(() => canvasRef.current?.focus(), 50);
              }}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "12px",
                color: "#ffffff",
                border: "3px solid #ffffff",
                background: "transparent",
                padding: "14px 32px",
                cursor: "pointer",
                animation: "blinkAnim 0.8s step-end infinite",
                boxShadow: "0 0 20px #ffffff44",
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.background = "#ffffff";
                (e.target as HTMLButtonElement).style.color = "#000";
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.background =
                  "transparent";
                (e.target as HTMLButtonElement).style.color = "#ffffff";
              }}
            >
              CONTINUE?
            </button>
          </div>
        )}
      </div>

      {/* Below game: quick nav buttons + footer - compact row */}
      <div
        style={{
          marginTop: 6,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "0 8px",
          flexShrink: 0,
        }}
      >
        {[
          { label: "PROFILE", color: "#00e5ff", type: "profile" },
          { label: "DISCOGRAPHY", color: "#aa00ff", type: "discography" },
          { label: "LIVE", color: "#ff6d00", type: "live" },
          { label: "CONTACT", color: "#00e676", type: "info" },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => openModal(item.type)}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "6px",
              color: item.color,
              border: `2px solid ${item.color}55`,
              background: `${item.color}10`,
              padding: "5px 10px",
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "1px",
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.background =
                `${item.color}30`;
              (e.target as HTMLButtonElement).style.boxShadow =
                `0 0 12px ${item.color}55`;
              (e.target as HTMLButtonElement).style.borderColor = item.color;
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.background =
                `${item.color}10`;
              (e.target as HTMLButtonElement).style.boxShadow = "none";
              (e.target as HTMLButtonElement).style.borderColor =
                `${item.color}55`;
            }}
          >
            {item.label}
          </button>
        ))}
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "5px",
            color: "#ffffff18",
            letterSpacing: "1px",
            marginLeft: 4,
          }}
        >
          © 2024 SENSE OF DEFEAT
        </span>
      </div>

      <style>{`
        @keyframes gameOverPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.04); }
        }
        @keyframes blinkAnim {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
