/**
 * SENSE OF DEFEAT - Game Renderer
 * Handles all Canvas 2D drawing for the game
 * Design: Pixel art retro arcade style
 * Colors: Deep purple/magenta sky, blue platforms, red enemies, yellow items
 */

import { useEffect, useRef } from "react";
import type { GameState } from "./useGameEngine";

const BG_URL =
  "https://private-us-east-1.manuscdn.com/sessionFile/OF4owkOAOtXCBr8PZSv4fO/sandbox/BnViflfwys8UwLHFLJ6rtl-img-1_1771547719000_na1fn_YmctY2l0eS1kdXNr.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT0Y0b3drT0FPdFhDQnI4UFpTdjRmTy9zYW5kYm94L0JuVmlmbGZ3eXM4VXdMSEZMSjZydGwtaW1nLTFfMTc3MTU0NzcxOTAwMF9uYTFmbl9ZbWN0WTJsMGVTMWtkWE5yLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=VPRrtSejcJXwIWI~fJr90Y07uq8z6MLLEEmcICeKf~~R36VeWDUZwSelsHMdc4TysR3t1~4dAW6VeAu9hbKQtS4GLzxTT7-xjTNTGmCFEttHWK0r0QKqpl8BVGc0EOwSb9f2BiZCEMBt9yqBBReI9S1~Hwb3cXAHNx0mPnG-rzh2~dVwaUD4MdPMBrEjvPBIql73HBWXUBkRP6v58KLnca7V9ISp98czxsr2fNFppCstOQZqUxsPqLlt37Np3K6GdEw56VO8vWQb~nUtYBFJ19ocrH15g~FwltOVrtV~oqu0bnkINKiL~17DsIefklvA31SG2gd9xmc1db0jtyN0Gw__";

// Stage section definitions
const STAGE_SECTIONS = [
  { start: 0, end: 700, name: "STAGE 1", color: "#1565c0", bgColor: "#1a0533" },
  {
    start: 700,
    end: 1500,
    name: "PROFILE",
    color: "#00e5ff",
    bgColor: "#0a1a3a",
  },
  {
    start: 1500,
    end: 2500,
    name: "DISCOGRAPHY",
    color: "#aa00ff",
    bgColor: "#1a0a3a",
  },
  {
    start: 2500,
    end: 3600,
    name: "LIVE",
    color: "#ff6d00",
    bgColor: "#2a0a0a",
  },
  {
    start: 3600,
    end: 5000,
    name: "FINAL",
    color: "#ff1744",
    bgColor: "#1a0020",
  },
];

function getSectionColor(cameraX: number): string {
  for (const s of STAGE_SECTIONS) {
    if (cameraX >= s.start && cameraX < s.end) return s.color;
  }
  return "#00e5ff";
}

function getSectionBg(cameraX: number): string {
  for (const s of STAGE_SECTIONS) {
    if (cameraX >= s.start && cameraX < s.end) return s.bgColor;
  }
  return "#1a0533";
}

function drawPixelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  glow = false
) {
  ctx.font = `${size}px 'Press Start 2P', monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
  }
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: 1 | -1,
  animState: string,
  animFrame: number,
  invincible: boolean,
  hurtTimer: number
) {
  const px = Math.round(x);
  const py = Math.round(y);

  if (invincible && Math.floor(Date.now() / 80) % 2 === 0) return;

  ctx.save();
  if (dir === -1) {
    ctx.translate(px + 32, py);
    ctx.scale(-1, 1);
    ctx.translate(-px, -py);
  }

  const bodyColor = hurtTimer > 0 ? "#ff6666" : "#1565c0";
  const helmetColor = hurtTimer > 0 ? "#ff4444" : "#0d47a1";
  const visorColor = "#00e5ff";
  const skinColor = "#ffccaa";

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(px + 4, py + 46, 24, 4);

  // Helmet
  ctx.fillStyle = helmetColor;
  ctx.fillRect(px + 8, py, 16, 12);
  ctx.fillRect(px + 6, py + 4, 20, 10);

  // Helmet highlight
  ctx.fillStyle = "#1e88e5";
  ctx.fillRect(px + 8, py, 8, 3);

  // Visor
  ctx.fillStyle = visorColor;
  ctx.fillRect(px + 10, py + 6, 12, 6);
  // Visor shine
  ctx.fillStyle = "#ffffff88";
  ctx.fillRect(px + 10, py + 6, 4, 2);

  // Face
  ctx.fillStyle = skinColor;
  ctx.fillRect(px + 8, py + 14, 16, 8);

  // Eyes
  ctx.fillStyle = "#333";
  ctx.fillRect(px + 11, py + 16, 4, 4);
  ctx.fillRect(px + 17, py + 16, 4, 4);
  // Eye shine
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(px + 12, py + 16, 2, 2);
  ctx.fillRect(px + 18, py + 16, 2, 2);

  // Body
  ctx.fillStyle = bodyColor;
  ctx.fillRect(px + 6, py + 22, 20, 14);
  // Body detail
  ctx.fillStyle = "#ffffff22";
  ctx.fillRect(px + 8, py + 24, 6, 4);

  // Arms
  ctx.fillStyle = bodyColor;
  if (animState === "shoot") {
    ctx.fillRect(px + 26, py + 22, 12, 8);
    // Buster cannon
    ctx.fillStyle = "#0d47a1";
    ctx.fillRect(px + 34, py + 22, 8, 10);
    ctx.fillStyle = visorColor;
    ctx.fillRect(px + 38, py + 24, 6, 6);
    // Muzzle flash
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(px + 42, py + 25, 4, 4);
  } else {
    ctx.fillRect(px + 26, py + 22, 6, 10);
    ctx.fillRect(px, py + 22, 6, 10);
  }

  // Legs
  ctx.fillStyle = helmetColor;
  if (animState === "run") {
    const legOffset = animFrame % 2 === 0 ? 5 : -5;
    ctx.fillRect(px + 8, py + 36, 8, 12 + legOffset);
    ctx.fillRect(px + 16, py + 36, 8, 12 - legOffset);
    // Feet
    ctx.fillStyle = "#1a237e";
    ctx.fillRect(px + 6, py + 44 + legOffset, 12, 4);
    ctx.fillRect(px + 14, py + 44 - legOffset, 12, 4);
  } else if (animState === "jump") {
    ctx.fillRect(px + 8, py + 36, 8, 8);
    ctx.fillRect(px + 16, py + 36, 8, 8);
    ctx.fillStyle = "#1a237e";
    ctx.fillRect(px + 6, py + 40, 12, 4);
    ctx.fillRect(px + 16, py + 40, 12, 4);
  } else {
    ctx.fillRect(px + 8, py + 36, 8, 12);
    ctx.fillRect(px + 16, py + 36, 8, 12);
    ctx.fillStyle = "#1a237e";
    ctx.fillRect(px + 6, py + 44, 12, 4);
    ctx.fillRect(px + 16, py + 44, 12, 4);
  }

  ctx.restore();
}

function drawEnemy(
  ctx: CanvasRenderingContext2D,
  enemy: {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    direction: 1 | -1;
    animFrame: number;
    flashTimer: number;
    hp: number;
    maxHp: number;
    animTimer: number;
  }
) {
  const { x, y, width, height, type, direction, animFrame, flashTimer } = enemy;
  const px = Math.round(x);
  const py = Math.round(y);

  if (flashTimer > 0 && Math.floor(flashTimer / 2) % 2 === 0) {
    ctx.globalAlpha = 0.3;
  }

  ctx.save();
  if (direction === -1) {
    ctx.translate(px + width, py);
    ctx.scale(-1, 1);
    ctx.translate(-px, -py);
  }

  if (type === "bat") {
    const wingFlap = animFrame % 2 === 0 ? -5 : 5;
    // Body
    ctx.fillStyle = "#7b1fa2";
    ctx.fillRect(px + 8, py + 8, 16, 14);
    // Head
    ctx.fillStyle = "#9c27b0";
    ctx.fillRect(px + 10, py + 2, 12, 10);
    // Ears
    ctx.fillStyle = "#7b1fa2";
    ctx.fillRect(px + 10, py - 2, 4, 6);
    ctx.fillRect(px + 18, py - 2, 4, 6);
    // Wings
    ctx.fillStyle = "#4a148c";
    ctx.fillRect(px, py + wingFlap, 10, 10);
    ctx.fillRect(px + 22, py + wingFlap, 10, 10);
    ctx.fillRect(px - 4, py + wingFlap + 4, 8, 6);
    ctx.fillRect(px + 28, py + wingFlap + 4, 8, 6);
    // Eyes
    ctx.fillStyle = "#ff1744";
    ctx.fillRect(px + 11, py + 4, 4, 4);
    ctx.fillRect(px + 17, py + 4, 4, 4);
    ctx.fillStyle = "#ff6d00";
    ctx.fillRect(px + 12, py + 5, 2, 2);
    ctx.fillRect(px + 18, py + 5, 2, 2);
    // Fangs
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(px + 12, py + 20, 2, 4);
    ctx.fillRect(px + 18, py + 20, 2, 4);
  } else if (type === "skull") {
    // Skull - bouncing with glow
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(px + 4, py, 24, 22);
    ctx.fillRect(px + 2, py + 4, 28, 18);
    // Highlight
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(px + 6, py + 2, 8, 4);
    // Eye sockets
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(px + 6, py + 6, 8, 8);
    ctx.fillRect(px + 18, py + 6, 8, 8);
    // Eye glow
    ctx.fillStyle = "#ff1744";
    ctx.fillRect(px + 8, py + 8, 4, 4);
    ctx.fillRect(px + 20, py + 8, 4, 4);
    // Nose
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(px + 13, py + 14, 6, 4);
    // Teeth
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(px + 4, py + 22, 6, 6);
    ctx.fillRect(px + 12, py + 22, 6, 6);
    ctx.fillRect(px + 20, py + 22, 6, 6);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(px + 10, py + 22, 2, 6);
    ctx.fillRect(px + 18, py + 22, 2, 6);
  } else if (type === "boss") {
    // Boss - large menacing robot
    const bossAnim = animFrame % 4;
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(px + 4, py + 62, 56, 6);
    // Main body
    ctx.fillStyle = "#b71c1c";
    ctx.fillRect(px + 8, py + 20, 48, 30);
    // Chest armor
    ctx.fillStyle = "#c62828";
    ctx.fillRect(px + 14, py + 24, 36, 22);
    // Chest detail
    ctx.fillStyle = "#ff1744";
    ctx.fillRect(px + 20, py + 28, 24, 10);
    ctx.fillStyle = "#ff6d00";
    ctx.fillRect(px + 24, py + 30, 16, 6);
    // Head
    ctx.fillStyle = "#b71c1c";
    ctx.fillRect(px + 10, py + 2, 44, 20);
    ctx.fillRect(px + 6, py + 8, 52, 16);
    // Visor
    ctx.fillStyle = "#ff1744";
    ctx.fillRect(px + 12, py + 6, 40, 12);
    ctx.fillStyle = "#ff6d00";
    ctx.fillRect(px + 14, py + 8, 36, 8);
    // Eyes
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(px + 16, py + 9, 10, 6);
    ctx.fillRect(px + 38, py + 9, 10, 6);
    // Horns
    ctx.fillStyle = "#7f0000";
    ctx.fillRect(px + 14, py - 6, 6, 10);
    ctx.fillRect(px + 44, py - 6, 6, 10);
    // Arms
    ctx.fillStyle = "#b71c1c";
    ctx.fillRect(px, py + 22, 10, 26);
    ctx.fillRect(px + 54, py + 22, 10, 26);
    // Fists
    ctx.fillStyle = "#7f0000";
    ctx.fillRect(px - 2, py + 44 + (bossAnim < 2 ? 2 : 0), 14, 10);
    ctx.fillRect(px + 52, py + 44 + (bossAnim >= 2 ? 2 : 0), 14, 10);
    // Legs
    ctx.fillStyle = "#b71c1c";
    ctx.fillRect(px + 12, py + 50, 16, 12);
    ctx.fillRect(px + 36, py + 50, 16, 12);
    // Feet
    ctx.fillStyle = "#7f0000";
    ctx.fillRect(px + 8, py + 58, 22, 6);
    ctx.fillRect(px + 34, py + 58, 22, 6);
    // HP bar
    const barW = 60;
    const hpRatio = enemy.hp / enemy.maxHp;
    ctx.fillStyle = "#111";
    ctx.fillRect(px + 2, py - 18, barW, 10);
    ctx.fillStyle =
      hpRatio > 0.5 ? "#4caf50" : hpRatio > 0.25 ? "#ff9800" : "#f44336";
    ctx.fillRect(px + 2, py - 18, barW * hpRatio, 10);
    ctx.strokeStyle = "#ffffff66";
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 2, py - 18, barW, 10);
    ctx.font = "6px 'Press Start 2P', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("BOSS", px + barW / 2 + 2, py - 10);
  } else {
    // Robot enemy - patrol guard
    ctx.fillStyle = "#e53935";
    ctx.fillRect(px + 4, py + 2, 24, 14);
    ctx.fillRect(px + 2, py + 8, 28, 18);
    // Visor
    ctx.fillStyle = "#ff6d00";
    ctx.fillRect(px + 6, py + 4, 20, 8);
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(px + 8, py + 5, 8, 6);
    ctx.fillRect(px + 18, py + 5, 8, 6);
    // Arms
    ctx.fillStyle = "#c62828";
    ctx.fillRect(px, py + 10, 4, 14);
    ctx.fillRect(px + 28, py + 10, 4, 14);
    // Legs
    const legOff = animFrame % 2 === 0 ? 2 : -2;
    ctx.fillStyle = "#b71c1c";
    ctx.fillRect(px + 6, py + 26, 8, 12 + legOff);
    ctx.fillRect(px + 18, py + 26, 8, 12 - legOff);
    // Feet
    ctx.fillStyle = "#7f0000";
    ctx.fillRect(px + 4, py + 34 + legOff, 12, 4);
    ctx.fillRect(px + 16, py + 34 - legOff, 12, 4);
  }

  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawGimmick(
  ctx: CanvasRenderingContext2D,
  gimmick: {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    label: string;
  }
) {
  const { x, y, width, height, type, label } = gimmick;
  const px = Math.round(x);
  const py = Math.round(y);
  const t = Date.now();
  const pulse = Math.sin(t * 0.003) * 0.4 + 0.6;
  const bounce = Math.sin(t * 0.004) * 3;

  const colors: Record<string, string> = {
    profile: "#00e5ff",
    discography: "#aa00ff",
    live: "#ff6d00",
    info: "#00e676",
    music_note: "#ffeb3b",
  };
  const color = colors[type] || "#ffffff";

  // Door shadow
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(px + 4, py + height, width, 6);

  // Door frame outer
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(px, py, width, height);

  // Door frame glow
  ctx.shadowColor = color;
  ctx.shadowBlur = 16 * pulse;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(px + 2, py + 2, width - 4, height - 4);
  ctx.shadowBlur = 0;

  // Inner door
  ctx.fillStyle = `${color}18`;
  ctx.fillRect(px + 4, py + 4, width - 8, height - 8);

  // Animated scanlines inside door
  for (let i = 0; i < height; i += 6) {
    const lineAlpha = 0.1 + 0.05 * Math.sin(t * 0.005 + i * 0.2);
    ctx.fillStyle = `rgba(255,255,255,${lineAlpha})`;
    ctx.fillRect(px + 4, py + 4 + i, width - 8, 2);
  }

  // Icon
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.85 + 0.15 * pulse;
  const cx = px + width / 2;
  const cy = py + height / 2 - 6;

  if (type === "profile") {
    // Person silhouette
    ctx.beginPath();
    ctx.arc(cx, cy - 8, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - 10, cy + 2, 20, 16);
  } else if (type === "discography") {
    // Vinyl record
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0a0a2e";
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    // Record grooves
    ctx.strokeStyle = `${color}44`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.stroke();
  } else if (type === "live") {
    // Lightning bolt (concert energy)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx + 4, cy - 14);
    ctx.lineTo(cx - 4, cy);
    ctx.lineTo(cx + 2, cy);
    ctx.lineTo(cx - 4, cy + 14);
    ctx.lineTo(cx + 4, cy);
    ctx.lineTo(cx - 2, cy);
    ctx.closePath();
    ctx.fill();
  } else if (type === "music_note") {
    // Musical note
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx - 3, cy + 4, 3, 0, Math.PI * 2);
    ctx.arc(cx + 5, cy + 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - 1, cy - 6, 2, 11);
    ctx.fillRect(cx + 7, cy - 8, 2, 11);
    ctx.fillRect(cx - 1, cy - 8, 10, 3);
  } else {
    // Star / info
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const outerR = 12;
      const innerR = 5;
      const x1 = cx + Math.cos(angle) * outerR;
      const y1 = cy + Math.cos(angle) * outerR;
      const x2 = cx + Math.cos(angle + Math.PI / 5) * innerR;
      const y2 = cy + Math.sin(angle + Math.PI / 5) * innerR;
      if (i === 0) ctx.beginPath();
      ctx.lineTo(x1, cy + Math.sin(angle) * outerR);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Label above with glow
  ctx.font = "bold 7px 'Press Start 2P', monospace";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.shadowColor = color;
  ctx.shadowBlur = 8 * pulse;
  ctx.fillText(label, cx, py - 12 + bounce);
  ctx.shadowBlur = 0;

  // Bouncing arrow
  const arrowY = py - 26 + bounce;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cx - 4, arrowY, 8, 4);
  ctx.fillRect(cx - 6, arrowY + 4, 12, 4);
  ctx.fillRect(cx - 2, arrowY + 8, 4, 4);
}

function drawBullet(
  ctx: CanvasRenderingContext2D,
  bullet: { x: number; y: number; vx: number; isCharged?: boolean }
) {
  const dir = bullet.vx > 0 ? 1 : -1;
  const bx = Math.round(bullet.x);
  const by = Math.round(bullet.y);
  const isC = !!bullet.isCharged;

  // Glow
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = isC ? 20 : 12;

  // Trail
  ctx.fillStyle = "#00e5ff44";
  ctx.fillRect(
    bx - (isC ? 20 : 12) * dir,
    by - (isC ? 4 : 2),
    isC ? 20 : 12,
    isC ? 8 : 4
  );

  // Main bullet
  ctx.fillStyle = "#00e5ff";
  ctx.fillRect(
    bx - (isC ? 12 : 8) * (dir === -1 ? 1 : 0),
    by - (isC ? 8 : 4),
    isC ? 24 : 16,
    isC ? 16 : 8
  );

  // Core
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(
    bx - (isC ? 6 : 4) * (dir === -1 ? 1 : 0),
    by - (isC ? 4 : 2),
    isC ? 12 : 8,
    isC ? 8 : 4
  );

  ctx.shadowBlur = 0;
}

function drawPlatform(
  ctx: CanvasRenderingContext2D,
  plat: {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    color?: string;
  },
  camX: number
) {
  const px = Math.round(plat.x - camX);
  const py = Math.round(plat.y);

  if (plat.type === "ground") {
    const blockSize = 32;
    for (let bx = 0; bx < plat.width; bx += blockSize) {
      const screenX = px + bx;
      if (screenX > 900 || screenX + blockSize < -10) continue;
      // Block body
      ctx.fillStyle = "#1565c0";
      ctx.fillRect(screenX, py, blockSize, plat.height);
      // Top highlight
      ctx.fillStyle = "#1976d2";
      ctx.fillRect(screenX, py, blockSize, 6);
      // Left highlight
      ctx.fillStyle = "#1e88e5";
      ctx.fillRect(screenX, py, 4, plat.height);
      // Dark right/bottom
      ctx.fillStyle = "#0d47a1";
      ctx.fillRect(screenX + blockSize - 3, py, 3, plat.height);
      ctx.fillRect(screenX, py + plat.height - 3, blockSize, 3);
      // Grid line
      ctx.fillStyle = "#0a3d9188";
      ctx.fillRect(screenX, py, 1, plat.height);
      // Pixel detail on top
      if (bx % 64 === 0) {
        ctx.fillStyle = "#2196f3";
        ctx.fillRect(screenX + 8, py + 2, 4, 2);
        ctx.fillRect(screenX + 20, py + 2, 4, 2);
      }
    }
  } else {
    // Floating platform
    const color = plat.color || "#1565c0";
    ctx.fillStyle = color;
    ctx.fillRect(px, py, plat.width, plat.height);
    // Top highlight
    ctx.fillStyle = "#ffffff44";
    ctx.fillRect(px, py, plat.width, 4);
    // Bottom shadow
    ctx.fillStyle = "#00000066";
    ctx.fillRect(px, py + plat.height - 4, plat.width, 4);
    // Pixel notches
    ctx.fillStyle = "#ffffff22";
    for (let i = 0; i < plat.width; i += 12) {
      ctx.fillRect(px + i, py, 6, 4);
    }
    // Glow edge
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
    ctx.strokeStyle = `${color}88`;
    ctx.lineWidth = 1;
    ctx.strokeRect(px, py, plat.width, plat.height);
    ctx.shadowBlur = 0;
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  W: number,
  H: number,
  bgImg: HTMLImageElement | null
) {
  // Dynamic sky based on section
  const bgColor = getSectionBg(cameraX);
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, bgColor);
  skyGrad.addColorStop(0.35, "#3a0060");
  skyGrad.addColorStop(0.65, "#c2185b");
  skyGrad.addColorStop(1, "#ff6f00");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // City background (parallax)
  if (bgImg && bgImg.complete) {
    const imgW = bgImg.width;
    const imgH = bgImg.height;
    const scale = W / imgW;
    const drawH = imgH * scale * 0.75;
    const parallaxX = -(cameraX * 0.15) % W;

    ctx.globalAlpha = 0.65;
    ctx.drawImage(bgImg, parallaxX, H - drawH, W, drawH);
    ctx.drawImage(bgImg, parallaxX + W, H - drawH, W, drawH);
    ctx.globalAlpha = 1;
  }

  // Stars (far parallax)
  const starSeeds = [
    17, 31, 53, 71, 89, 103, 127, 149, 163, 181, 199, 211, 223, 233, 251, 257,
    263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347,
  ];
  const t = Date.now();
  for (let i = 0; i < 30; i++) {
    const sx =
      (((starSeeds[i % 30] * (i + 1) * 137.5 + cameraX * 0.03) % W) + W) % W;
    const sy = (starSeeds[i % 30] * (i + 3) * 97.3) % (H * 0.55);
    const twinkle = Math.sin(t * 0.002 + i * 0.7) * 0.4 + 0.6;
    ctx.globalAlpha = 0.2 + twinkle * 0.6;
    const size = i % 7 === 0 ? 3 : 2;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(Math.round(sx), Math.round(sy), size, size);
  }
  ctx.globalAlpha = 1;

  // Section transition glow on ground
  const sectionColor = getSectionColor(cameraX);
  const groundGrad = ctx.createLinearGradient(0, H - 120, 0, H);
  groundGrad.addColorStop(0, "transparent");
  groundGrad.addColorStop(1, `${sectionColor}22`);
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, H - 120, W, 120);
}

const PLAYER_IMG_URL =
  "https://files.manuscdn.com/user_upload_by_module/session_file/95086222/jnqEcDrtgJKSiLGp.png";

export function useGameRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  stateRef: React.RefObject<GameState>,
  bgImageRef: React.RefObject<HTMLImageElement | null>
) {
  const rafRef = useRef<number>(0);
  const playerImgRefs = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const chars = [
      { id: "toshi", url: "/toshi.png" },
      { id: "yuichi", url: "/yuichi.png" },
      { id: "ramirez", url: "/ramirez.png" },
      { id: "yuj", url: "/yuj.png" },
      { id: "mirko", url: "/mirko.png" },
    ];
    chars.forEach(c => {
      const img = new Image();
      img.src = c.url;
      img.onload = () => {
        playerImgRefs.current[c.id] = img;
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const render = () => {
      const state = stateRef.current;
      const {
        cameraX,
        player,
        platforms,
        enemies,
        gimmicks,
        bullets,
        particles,
      } = state;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Draw background
      drawBackground(ctx, cameraX, W, H, bgImageRef.current);

      // Platforms
      for (const plat of platforms) {
        const screenX = plat.x - cameraX;
        if (screenX > W + 100 || screenX + plat.width < -100) continue;
        drawPlatform(ctx, plat, cameraX);
      }

      // Gimmicks
      for (const gimmick of gimmicks) {
        if (gimmick.activated) continue;
        const screenX = gimmick.x - cameraX;
        if (screenX > W + 100 || screenX + gimmick.width < -100) continue;
        drawGimmick(ctx, { ...gimmick, x: screenX });
      }

      // Enemies
      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        const screenX = enemy.x - cameraX;
        if (screenX > W + 100 || screenX + enemy.width < -100) continue;
        drawEnemy(ctx, { ...enemy, x: screenX });
      }

      // Bullets
      for (const bullet of bullets) {
        const screenX = bullet.x - cameraX;
        if (screenX > W + 50 || screenX < -50) continue;
        drawBullet(ctx, { ...bullet, x: screenX });
      }

      // Particles
      for (const p of particles) {
        const screenX = p.x - cameraX;
        if (screenX > W + 50 || screenX < -50) continue;
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(
          Math.round(screenX - p.size / 2),
          Math.round(p.y - p.size / 2),
          Math.round(p.size),
          Math.round(p.size)
        );
      }
      ctx.globalAlpha = 1;

      // Player
      if (state.gamePhase === "playing" || state.gamePhase === "modal") {
        const playerScreenX = player.x - cameraX;
        const selectedId = state.selectedChar || "toshi";
        const pImg = playerImgRefs.current[selectedId];

        if (pImg && pImg.complete && pImg.naturalWidth > 0) {
          // Blink when invincible
          if (
            player.invincibleTimer > 0 &&
            Math.floor(Date.now() / 80) % 2 === 0
          ) {
            // skip draw (blink)
          } else {
            let imgH = 80;
            let imgW = pImg.naturalHeight
              ? Math.round((pImg.naturalWidth / pImg.naturalHeight) * imgH)
              : 58;

            const drawY = Math.round(player.y + player.height - imgH);
            ctx.save();
            if (player.hurtTimer > 0) {
              ctx.globalAlpha = 0.7;
            }
            if (player.direction === -1) {
              // Flip horizontally
              ctx.translate(
                Math.round(playerScreenX) + player.width / 2 + imgW / 2,
                0
              );
              ctx.scale(-1, 1);
              ctx.drawImage(pImg, 0, drawY, imgW, imgH);
            } else {
              const offsetX = (imgW - player.width) / 2;
              ctx.drawImage(
                pImg,
                Math.round(playerScreenX) - offsetX,
                drawY,
                imgW,
                imgH
              );
            }
            ctx.restore();
          }
        } else {
          // Fallback
          drawPlayer(
            ctx,
            playerScreenX,
            player.y,
            player.direction,
            player.animState,
            player.animFrame,
            player.invincibleTimer > 0,
            player.hurtTimer
          );
        }
      }

      // Scanline overlay
      ctx.globalAlpha = 0.035;
      ctx.fillStyle = "#000000";
      for (let sy = 0; sy < H; sy += 4) {
        ctx.fillRect(0, sy, W, 2);
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [canvasRef, stateRef, bgImageRef, playerImgRefs]);
}
