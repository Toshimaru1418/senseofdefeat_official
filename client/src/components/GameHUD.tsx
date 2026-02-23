/**
 * SENSE OF DEFEAT - Game HUD
 * Design: Retro Neo Arcade - NES-style HUD overlay
 * Shows HP bar, score, stage name, controls guide
 */

interface GameHUDProps {
  hp: number;
  maxHp: number;
  score: number;
  stageLabel?: string;
}

export function GameHUD({ hp, maxHp, score, stageLabel = "STAGE 1" }: GameHUDProps) {
  const hpPercent = hp / maxHp;
  const hpColor = hpPercent > 0.5 ? "#00e676" : hpPercent > 0.25 ? "#ffdd00" : "#ff1744";

  return (
    <div
      className="absolute top-0 left-0 right-0 pointer-events-none"
      style={{
        padding: "8px 12px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
        zIndex: 10,
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left: HP */}
        <div className="flex items-center gap-2">
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "8px",
              color: "#ffffff",
              textShadow: "1px 1px 0 #000",
              whiteSpace: "nowrap",
            }}
          >
            HP
          </div>
          <div
            style={{
              width: 120,
              height: 12,
              background: "#111",
              border: "2px solid #555",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${hpPercent * 100}%`,
                height: "100%",
                background: hpColor,
                boxShadow: `0 0 6px ${hpColor}`,
                transition: "width 0.2s, background 0.3s",
              }}
            />
            {/* HP tick marks */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${((i + 1) / 8) * 100}%`,
                  width: 1,
                  height: "100%",
                  background: "#00000066",
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "7px",
              color: hpColor,
              textShadow: `0 0 4px ${hpColor}`,
              minWidth: 32,
            }}
          >
            {hp}/{maxHp}
          </div>
        </div>

        {/* Center: Stage name */}
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "9px",
            color: "#00e5ff",
            textShadow: "0 0 8px #00e5ff, 1px 1px 0 #000",
            letterSpacing: "1px",
          }}
        >
          {stageLabel}
        </div>

        {/* Right: Score */}
        <div className="flex items-center gap-2">
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "8px",
              color: "#ffdd00",
              textShadow: "0 0 6px #ffdd00, 1px 1px 0 #000",
            }}
          >
            SCORE
          </div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "10px",
              color: "#ffffff",
              textShadow: "1px 1px 0 #000",
              minWidth: 60,
              textAlign: "right",
            }}
          >
            {String(score).padStart(6, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ControlsGuide() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none"
      style={{
        padding: "6px 12px",
        background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
        zIndex: 10,
      }}
    >
      <div className="flex items-center justify-center gap-6">
        {[
          { key: "← →", label: "MOVE" },
          { key: "↑ / SPACE", label: "JUMP" },
          { key: "Z", label: "SHOOT" },
        ].map((ctrl) => (
          <div key={ctrl.key} className="flex items-center gap-2">
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "7px",
                color: "#00e5ff",
                border: "1px solid #00e5ff66",
                padding: "2px 4px",
                background: "#00e5ff11",
              }}
            >
              {ctrl.key}
            </span>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "6px",
                color: "#ffffff66",
              }}
            >
              {ctrl.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MobileControls({ onLeft, onRight, onJump, onShoot, onLeftEnd, onRightEnd }: {
  onLeft: () => void;
  onRight: () => void;
  onJump: () => void;
  onShoot: () => void;
  onLeftEnd: () => void;
  onRightEnd: () => void;
}) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-auto"
      style={{
        padding: "12px 16px",
        background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
        zIndex: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      {/* D-pad */}
      <div className="flex gap-2">
        <button
          onTouchStart={onLeft}
          onTouchEnd={onLeftEnd}
          onMouseDown={onLeft}
          onMouseUp={onLeftEnd}
          style={{
            width: 52,
            height: 52,
            background: "rgba(0,229,255,0.15)",
            border: "2px solid #00e5ff66",
            color: "#00e5ff",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "16px",
            cursor: "pointer",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          ◀
        </button>
        <button
          onTouchStart={onRight}
          onTouchEnd={onRightEnd}
          onMouseDown={onRight}
          onMouseUp={onRightEnd}
          style={{
            width: 52,
            height: 52,
            background: "rgba(0,229,255,0.15)",
            border: "2px solid #00e5ff66",
            color: "#00e5ff",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "16px",
            cursor: "pointer",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          ▶
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onTouchStart={onShoot}
          onMouseDown={onShoot}
          style={{
            width: 52,
            height: 52,
            background: "rgba(0,229,255,0.15)",
            border: "2px solid #00e5ff66",
            color: "#00e5ff",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "8px",
            cursor: "pointer",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          SHOT
        </button>
        <button
          onTouchStart={onJump}
          onMouseDown={onJump}
          style={{
            width: 52,
            height: 52,
            background: "rgba(255,109,0,0.2)",
            border: "2px solid #ff6d0066",
            color: "#ff6d00",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "8px",
            cursor: "pointer",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          JUMP
        </button>
      </div>
    </div>
  );
}
