/**
 * SENSE OF DEFEAT - Game Engine Hook
 * Design: Retro Neo Arcade / Mega Man inspired side-scrolling
 * Colors: Deep purple/magenta sky, blue platforms, red enemies, yellow items
 * Font: Press Start 2P (UI) + Noto Sans JP (content)
 */

import { useEffect, useRef, useCallback, useState } from "react";

export interface Vec2 {
  x: number;
  y: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "ground" | "platform" | "door" | "spike";
  color?: string;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  type: "robot" | "bat" | "skull" | "boss";
  direction: 1 | -1;
  animFrame: number;
  animTimer: number;
  patrolStart: number;
  patrolEnd: number;
  alive: boolean;
  flashTimer: number;
}

export interface Gimmick {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  label: string;
  activated: boolean;
  animFrame: number;
  cooldown: number; // frames until gimmick can be re-triggered after closing modal
  bgmUrl?: string;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
  isCharged: boolean;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  onGround: boolean;
  direction: 1 | -1;
  animState: string;
  animFrame: number;
  animTimer: number;
  hp: number;
  maxHp: number;
  shootCooldown: number;
  hurtTimer: number;
  invincibleTimer: number;
  charging: boolean;
  chargePower: number;
}

export interface GameState {
  player: Player;
  platforms: Platform[];
  enemies: Enemy[];
  gimmicks: Gimmick[];
  bullets: Bullet[];
  particles: Particle[];
  cameraX: number;
  score: number;
  worldWidth: number;
  activeModal: string | null;
  gamePhase: "title" | "charSelect" | "playing" | "modal";
  selectedChar: "toshi" | "yuichi" | "ramirez" | "yuj" | "mirko" | null;
  bulletIdCounter: number;
  particleIdCounter: number;
  currentBgm: string | null;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const WORLD_WIDTH = 5200;
const GROUND_Y = 370;
const GRAVITY = 0.5;
const JUMP_FORCE = -11;
const MOVE_SPEED = 4;

function createInitialState(): GameState {
  const platforms: Platform[] = [
    // Ground
    { x: 0, y: GROUND_Y, width: WORLD_WIDTH, height: 80, type: "ground" },
    // Section 1 platforms
    {
      x: 150,
      y: GROUND_Y - 80,
      width: 120,
      height: 20,
      type: "platform",
      color: "#1565c0",
    },
    {
      x: 320,
      y: GROUND_Y - 140,
      width: 100,
      height: 20,
      type: "platform",
      color: "#1565c0",
    },
    {
      x: 480,
      y: GROUND_Y - 100,
      width: 80,
      height: 20,
      type: "platform",
      color: "#1565c0",
    },
    {
      x: 600,
      y: GROUND_Y - 160,
      width: 120,
      height: 20,
      type: "platform",
      color: "#1565c0",
    },
    // Section 2 platforms (Profile)
    {
      x: 800,
      y: GROUND_Y - 100,
      width: 100,
      height: 20,
      type: "platform",
      color: "#00838f",
    },
    {
      x: 950,
      y: GROUND_Y - 160,
      width: 80,
      height: 20,
      type: "platform",
      color: "#00838f",
    },
    {
      x: 1100,
      y: GROUND_Y - 120,
      width: 120,
      height: 20,
      type: "platform",
      color: "#00838f",
    },
    // Section 3 platforms (Discography)
    {
      x: 1600,
      y: GROUND_Y - 120,
      width: 100,
      height: 20,
      type: "platform",
      color: "#6a1b9a",
    },
    {
      x: 1780,
      y: GROUND_Y - 180,
      width: 80,
      height: 20,
      type: "platform",
      color: "#6a1b9a",
    },
    {
      x: 1950,
      y: GROUND_Y - 140,
      width: 120,
      height: 20,
      type: "platform",
      color: "#6a1b9a",
    },
    {
      x: 2150,
      y: GROUND_Y - 100,
      width: 100,
      height: 20,
      type: "platform",
      color: "#6a1b9a",
    },
    {
      x: 2300,
      y: GROUND_Y - 160,
      width: 80,
      height: 20,
      type: "platform",
      color: "#6a1b9a",
    },
    // Section 4 platforms (Live)
    {
      x: 2700,
      y: GROUND_Y - 100,
      width: 100,
      height: 20,
      type: "platform",
      color: "#bf360c",
    },
    {
      x: 2900,
      y: GROUND_Y - 160,
      width: 80,
      height: 20,
      type: "platform",
      color: "#bf360c",
    },
    {
      x: 3100,
      y: GROUND_Y - 120,
      width: 120,
      height: 20,
      type: "platform",
      color: "#bf360c",
    },
    {
      x: 3300,
      y: GROUND_Y - 180,
      width: 100,
      height: 20,
      type: "platform",
      color: "#bf360c",
    },
    // Final section platforms
    {
      x: 3800,
      y: GROUND_Y - 120,
      width: 100,
      height: 20,
      type: "platform",
      color: "#880e4f",
    },
    {
      x: 4000,
      y: GROUND_Y - 180,
      width: 80,
      height: 20,
      type: "platform",
      color: "#880e4f",
    },
    {
      x: 4200,
      y: GROUND_Y - 140,
      width: 120,
      height: 20,
      type: "platform",
      color: "#880e4f",
    },
    {
      x: 4400,
      y: GROUND_Y - 100,
      width: 100,
      height: 20,
      type: "platform",
      color: "#880e4f",
    },
  ];

  const enemies: Enemy[] = [
    // Section 1 enemies
    {
      id: "e1",
      x: 200,
      y: GROUND_Y - 40,
      width: 32,
      height: 32,
      vx: 1.5,
      vy: 0,
      hp: 2,
      maxHp: 2,
      type: "robot",
      direction: 1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 150,
      patrolEnd: 400,
      alive: true,
      flashTimer: 0,
    },
    {
      id: "e2",
      x: 450,
      y: GROUND_Y - 100,
      width: 28,
      height: 28,
      vx: 1.5,
      vy: 0,
      hp: 2,
      maxHp: 2,
      type: "bat",
      direction: 1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 400,
      patrolEnd: 650,
      alive: true,
      flashTimer: 0,
    },
    // Section 2 enemies (Profile)
    {
      id: "e3",
      x: 750,
      y: GROUND_Y - 40,
      width: 32,
      height: 32,
      vx: 1.5,
      vy: 0,
      hp: 3,
      maxHp: 3,
      type: "robot",
      direction: 1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 700,
      patrolEnd: 950,
      alive: true,
      flashTimer: 0,
    },
    {
      id: "e4",
      x: 1050,
      y: GROUND_Y - 40,
      width: 32,
      height: 32,
      vx: -1.5,
      vy: 0,
      hp: 2,
      maxHp: 2,
      type: "bat",
      direction: -1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 950,
      patrolEnd: 1200,
      alive: true,
      flashTimer: 0,
    },
    {
      id: "e5",
      x: 1200,
      y: GROUND_Y - 40,
      width: 32,
      height: 32,
      vx: 1.5,
      vy: 0,
      hp: 2,
      maxHp: 2,
      type: "skull",
      direction: 1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 1150,
      patrolEnd: 1400,
      alive: true,
      flashTimer: 0,
    },
    // Section 3 enemies (Discography)
    {
      id: "e6",
      x: 1600,
      y: GROUND_Y - 40,
      width: 32,
      height: 32,
      vx: 2,
      vy: 0,
      hp: 3,
      maxHp: 3,
      type: "robot",
      direction: 1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 1550,
      patrolEnd: 1800,
      alive: true,
      flashTimer: 0,
    },
    {
      id: "e7",
      x: 1900,
      y: GROUND_Y - 40,
      width: 32,
      height: 32,
      vx: -2,
      vy: 0,
      hp: 2,
      maxHp: 2,
      type: "skull",
      direction: -1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 1800,
      patrolEnd: 2100,
      alive: true,
      flashTimer: 0,
    },
    {
      id: "e8",
      x: 2150,
      y: GROUND_Y - 40,
      width: 32,
      height: 32,
      vx: 1.5,
      vy: 0,
      hp: 3,
      maxHp: 3,
      type: "bat",
      direction: 1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 2100,
      patrolEnd: 2400,
      alive: true,
      flashTimer: 0,
    },
    // Section 4 enemies (Live)
    {
      id: "e9",
      x: 2700,
      y: GROUND_Y - 40,
      width: 32,
      height: 32,
      vx: 2,
      vy: 0,
      hp: 3,
      maxHp: 3,
      type: "robot",
      direction: 1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 2650,
      patrolEnd: 2900,
      alive: true,
      flashTimer: 0,
    },
    {
      id: "e10",
      x: 2950,
      y: GROUND_Y - 40,
      width: 32,
      height: 32,
      vx: -2,
      vy: 0,
      hp: 3,
      maxHp: 3,
      type: "skull",
      direction: -1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 2900,
      patrolEnd: 3200,
      alive: true,
      flashTimer: 0,
    },
    {
      id: "e11",
      x: 3250,
      y: GROUND_Y - 40,
      width: 32,
      height: 32,
      vx: 2,
      vy: 0,
      hp: 2,
      maxHp: 2,
      type: "bat",
      direction: 1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 3200,
      patrolEnd: 3500,
      alive: true,
      flashTimer: 0,
    },
    // Final boss area
    {
      id: "boss1",
      x: 4500,
      y: GROUND_Y - 64,
      width: 64,
      height: 64,
      vx: 2,
      vy: 0,
      hp: 10,
      maxHp: 10,
      type: "boss",
      direction: 1,
      animFrame: 0,
      animTimer: 0,
      patrolStart: 4400,
      patrolEnd: 4800,
      alive: true,
      flashTimer: 0,
    },
  ];

  const gimmicks: Gimmick[] = [
    {
      id: "bgm1",
      x: 420,
      y: GROUND_Y - 48,
      width: 32,
      height: 32,
      type: "music_note",
      label: "BGM",
      activated: false,
      animFrame: 0,
      cooldown: 0,
      bgmUrl: "/thelastone_8bit.mp3",
    },
    {
      id: "bgm2",
      x: 1850,
      y: GROUND_Y - 48,
      width: 32,
      height: 32,
      type: "music_note",
      label: "BGM",
      activated: false,
      animFrame: 0,
      cooldown: 0,
      bgmUrl: "/pathofdeath_8bit.mp3",
    },
    {
      id: "bgm3",
      x: 3100,
      y: GROUND_Y - 48,
      width: 32,
      height: 32,
      type: "music_note",
      label: "BGM",
      activated: false,
      animFrame: 0,
      cooldown: 0,
      bgmUrl: "/bottleneck_8bit.mp3",
    },
    {
      id: "profile",
      x: 1280,
      y: GROUND_Y - 80,
      width: 48,
      height: 80,
      type: "profile",
      label: "PROFILE",
      activated: false,
      animFrame: 0,
      cooldown: 0,
    },
    {
      id: "discography",
      x: 2450,
      y: GROUND_Y - 80,
      width: 48,
      height: 80,
      type: "discography",
      label: "DISCOGRAPHY",
      activated: false,
      animFrame: 0,
      cooldown: 0,
    },
    {
      id: "live",
      x: 3550,
      y: GROUND_Y - 80,
      width: 48,
      height: 80,
      type: "live",
      label: "LIVE",
      activated: false,
      animFrame: 0,
      cooldown: 0,
    },
    {
      id: "info",
      x: 4850,
      y: GROUND_Y - 80,
      width: 48,
      height: 80,
      type: "info",
      label: "CONTACT",
      activated: false,
      animFrame: 0,
      cooldown: 0,
    },
  ];

  return {
    player: {
      x: 80,
      y: GROUND_Y - 48,
      vx: 0,
      vy: 0,
      width: 32,
      height: 48,
      onGround: false,
      direction: 1,
      animState: "idle",
      animFrame: 0,
      animTimer: 0,
      hp: 28,
      maxHp: 28,
      shootCooldown: 0,
      hurtTimer: 0,
      invincibleTimer: 0,
      charging: false,
      chargePower: 0,
    },
    platforms,
    enemies,
    gimmicks,
    bullets: [],
    particles: [],
    cameraX: 0,
    score: 0,
    worldWidth: WORLD_WIDTH,
    activeModal: null,
    gamePhase: "title",
    selectedChar: null,
    bulletIdCounter: 0,
    particleIdCounter: 0,
    currentBgm: null,
  };
}

export function useGameEngine(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  // All refs - never cause re-renders
  const stateRef = useRef<GameState>(createInitialState());
  const keysRef = useRef<Set<string>>(new Set());
  const justPressedRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // React state - only for UI rendering
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<
    "title" | "charSelect" | "playing" | "modal"
  >("title");
  const [playerHp, setPlayerHp] = useState(28);
  const [score, setScore] = useState(0);
  const [currentBgm, setCurrentBgm] = useState<string | null>(null);

  // --- Game logic functions (no hooks inside) ---

  const spawnParticles = useCallback(
    (state: GameState, x: number, y: number, color: string, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = 2 + Math.random() * 3;
        state.particles.push({
          id: `p_${state.particleIdCounter++}`,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 30 + Math.random() * 20,
          maxLife: 50,
          color,
          size: 3 + Math.random() * 4,
        });
      }
    },
    []
  );

  const shoot = useCallback((state: GameState) => {
    if (state.player.shootCooldown > 0) return;
    const { player } = state;
    state.bullets.push({
      id: `b_${state.bulletIdCounter++}`,
      x: player.x + (player.direction === 1 ? player.width : 0),
      y: player.y + player.height / 2 - 4,
      vx: 10 * player.direction,
      vy: 0,
      alive: true,
      isCharged: false,
    });
    state.player.shootCooldown = 12;
    state.player.animState = "shoot";
  }, []);

  // --- Key event listeners (mounted once, never re-mounted) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.repeat) {
        justPressedRef.current.add(e.code);
      }
      keysRef.current.add(e.code);
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
      justPressedRef.current.delete(e.code);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []); // mount once only

  // --- Game loop (mounted once, uses refs for everything) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let prevPhase: string = stateRef.current.gamePhase;
    let prevModal: string | null = null;

    const loop = (time: number) => {
      const state = stateRef.current;
      const keys = keysRef.current;
      const justPressed = justPressedRef.current;

      // Only update game logic when playing
      if (state.gamePhase === "playing") {
        const { player } = state;

        // Input
        const left = keys.has("ArrowLeft") || keys.has("KeyA");
        const right = keys.has("ArrowRight") || keys.has("KeyD");
        const jumpJustPressed =
          justPressed.has("ArrowUp") ||
          justPressed.has("KeyW") ||
          justPressed.has("Space");
        const shootJustPressed =
          justPressed.has("KeyZ") ||
          justPressed.has("KeyX") ||
          justPressed.has("KeyJ");
        const shootHeld =
          keys.has("KeyZ") || keys.has("KeyX") || keys.has("KeyJ");
        const shootReleased = !shootHeld && player.charging;

        // Movement
        if (left) {
          player.vx = -MOVE_SPEED;
          player.direction = -1;
        } else if (right) {
          player.vx = MOVE_SPEED;
          player.direction = 1;
        } else {
          player.vx *= 0.7;
        }

        if (jumpJustPressed && player.onGround) {
          player.vy = JUMP_FORCE;
          player.onGround = false;
        }

        if (shootJustPressed) {
          player.charging = true;
          player.chargePower = 0;
        }

        if (shootHeld && player.charging) {
          player.chargePower++;

          if (player.chargePower > 20) {
            // Charging particle effect
            if (Math.floor(Date.now() / 16) % 2 === 0) {
              const angle = Math.random() * Math.PI * 2;
              const radius = 25 + Math.random() * 15;
              const px = player.x + player.width / 2 + Math.cos(angle) * radius;
              const py =
                player.y + player.height / 2 + Math.sin(angle) * radius;

              // vx and vy aimed back towards player center
              const speed = 1.5 + Math.random() * 2;
              const vx = -Math.cos(angle) * speed;
              const vy = -Math.sin(angle) * speed;

              const isMaxCharge = player.chargePower >= 40;

              state.particles.push({
                id: `p_${state.particleIdCounter++}`,
                x: px,
                y: py,
                vx,
                vy,
                life: 15,
                maxLife: 15,
                color: isMaxCharge ? "#00e5ff" : "#ffffff44",
                size: isMaxCharge ? 3 : 2,
              });
            }
          }

          if (
            player.chargePower > 60 &&
            Math.floor(Date.now() / 50) % 2 === 0
          ) {
            // charging visual effect
            player.animState = "shoot";
          }
        }

        if (shootReleased) {
          if (player.shootCooldown <= 0) {
            const isCharged = player.chargePower >= 40;
            state.bullets.push({
              id: `b_${state.bulletIdCounter++}`,
              x: player.x + (player.direction === 1 ? player.width : 0),
              y: player.y + player.height / 2 - 4 - (isCharged ? 4 : 0),
              vx: (isCharged ? 15 : 10) * player.direction,
              vy: 0,
              alive: true,
              isCharged, // Add property later or handled implicitly by particle size
            } as any);
            player.shootCooldown = isCharged ? 24 : 12;
            player.animState = "shoot";
          }
          player.charging = false;
          player.chargePower = 0;
        }

        // Gravity
        player.vy += GRAVITY;
        if (player.vy > 15) player.vy = 15;

        // Move
        player.x += player.vx;
        player.y += player.vy;

        // World bounds
        if (player.x < 0) player.x = 0;
        if (player.x > state.worldWidth - player.width)
          player.x = state.worldWidth - player.width;

        // Platform collision
        player.onGround = false;
        for (const plat of state.platforms) {
          if (
            player.x + player.width > plat.x &&
            player.x < plat.x + plat.width &&
            player.y + player.height > plat.y &&
            player.y + player.height < plat.y + plat.height + 16 &&
            player.vy >= 0
          ) {
            player.y = plat.y - player.height;
            player.vy = 0;
            player.onGround = true;
          }
        }

        // Fall off screen
        if (player.y > CANVAS_HEIGHT + 100) {
          player.y = GROUND_Y - player.height;
          player.x = Math.max(0, state.cameraX - 100);
          player.vy = 0;
          player.hp = Math.max(0, player.hp - 4);
          // Spawn particles
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            state.particles.push({
              id: `p_${state.particleIdCounter++}`,
              x: player.x + player.width / 2,
              y: player.y,
              vx: Math.cos(angle) * 3,
              vy: Math.sin(angle) * 3 - 2,
              life: 40,
              maxLife: 40,
              color: "#ff4444",
              size: 4,
            });
          }
        }

        // Animation
        player.animTimer++;
        player.shootCooldown = Math.max(0, player.shootCooldown - 1);
        player.hurtTimer = Math.max(0, player.hurtTimer - 1);
        player.invincibleTimer = Math.max(0, player.invincibleTimer - 1);

        if (player.hurtTimer > 0) {
          player.animState = "hurt";
        } else if (!player.onGround) {
          player.animState = "jump";
        } else if (player.shootCooldown > 6) {
          player.animState = "shoot";
        } else if (Math.abs(player.vx) > 0.5) {
          player.animState = "run";
          if (player.animTimer % 8 === 0)
            player.animFrame = (player.animFrame + 1) % 4;
        } else {
          player.animState = "idle";
          if (player.animTimer % 20 === 0)
            player.animFrame = (player.animFrame + 1) % 2;
        }

        // Update bullets
        for (const bullet of state.bullets) {
          if (!bullet.alive) continue;
          bullet.x += bullet.vx;
          bullet.y += bullet.vy;
          if (
            bullet.x < state.cameraX - 50 ||
            bullet.x > state.cameraX + CANVAS_WIDTH + 50
          ) {
            bullet.alive = false;
          }
        }
        state.bullets = state.bullets.filter(b => b.alive);

        // Update enemies
        for (const enemy of state.enemies) {
          if (!enemy.alive) continue;
          enemy.flashTimer = Math.max(0, enemy.flashTimer - 1);

          if (enemy.type === "bat") {
            enemy.animTimer++;
            enemy.vy = Math.sin(enemy.animTimer * 0.05) * 1.5;
            enemy.x += enemy.vx;
            enemy.y += enemy.vy;
            if (enemy.x > enemy.patrolEnd || enemy.x < enemy.patrolStart) {
              enemy.vx *= -1;
              enemy.direction = enemy.vx > 0 ? 1 : -1;
            }
            if (enemy.animTimer % 10 === 0)
              enemy.animFrame = (enemy.animFrame + 1) % 2;
          } else if (enemy.type === "boss") {
            enemy.animTimer++;
            enemy.x += enemy.vx;
            if (enemy.x > enemy.patrolEnd || enemy.x < enemy.patrolStart) {
              enemy.vx *= -1;
              enemy.direction = enemy.vx > 0 ? 1 : -1;
            }
            for (const plat of state.platforms) {
              if (
                enemy.x + enemy.width > plat.x &&
                enemy.x < plat.x + plat.width &&
                enemy.y + enemy.height > plat.y &&
                enemy.y + enemy.height < plat.y + plat.height + 16 &&
                enemy.vy >= 0
              ) {
                enemy.y = plat.y - enemy.height;
                enemy.vy = 0;
              }
            }
            if (enemy.animTimer % 8 === 0)
              enemy.animFrame = (enemy.animFrame + 1) % 4;
          } else {
            enemy.animTimer++;
            enemy.x += enemy.vx;
            if (enemy.x > enemy.patrolEnd || enemy.x < enemy.patrolStart) {
              enemy.vx *= -1;
              enemy.direction = enemy.vx > 0 ? 1 : -1;
            }
            enemy.vy += GRAVITY;
            if (enemy.vy > 15) enemy.vy = 15;
            enemy.y += enemy.vy;
            for (const plat of state.platforms) {
              if (
                enemy.x + enemy.width > plat.x &&
                enemy.x < plat.x + plat.width &&
                enemy.y + enemy.height > plat.y &&
                enemy.y + enemy.height < plat.y + plat.height + 16 &&
                enemy.vy >= 0
              ) {
                enemy.y = plat.y - enemy.height;
                enemy.vy = 0;
              }
            }
            if (enemy.animTimer % 12 === 0)
              enemy.animFrame = (enemy.animFrame + 1) % 2;
          }

          // Bullet vs enemy collision
          for (const bullet of state.bullets) {
            if (!bullet.alive) continue;
            if (
              bullet.x > enemy.x &&
              bullet.x < enemy.x + enemy.width &&
              bullet.y > enemy.y &&
              bullet.y < enemy.y + enemy.height
            ) {
              const damage = bullet.isCharged ? 3 : 1;
              if (!bullet.isCharged) {
                bullet.alive = false; // Normal bullets dissipate, charged might pierce or just do more dmg and vanish
              } else {
                // Charged bullets pierce, but to prevent multiple hits per frame, maybe just do it once then disappear too.
                bullet.alive = false;
              }
              enemy.hp -= damage;
              enemy.flashTimer = 8;
              for (let i = 0; i < (bullet.isCharged ? 8 : 4); i++) {
                const angle = (Math.PI * 2 * i) / (bullet.isCharged ? 8 : 4);
                state.particles.push({
                  id: `p_${state.particleIdCounter++}`,
                  x: enemy.x + enemy.width / 2,
                  y: enemy.y + enemy.height / 2,
                  vx: Math.cos(angle) * 3,
                  vy: Math.sin(angle) * 3 - 2,
                  life: 25,
                  maxLife: 25,
                  color: bullet.isCharged ? "#00e5ff" : "#ffdd00",
                  size: bullet.isCharged ? 5 : 3,
                });
              }
              if (enemy.hp <= 0) {
                enemy.alive = false;
                state.score += enemy.type === "boss" ? 500 : 100;
                for (let i = 0; i < 12; i++) {
                  const angle = (Math.PI * 2 * i) / 12;
                  state.particles.push({
                    id: `p_${state.particleIdCounter++}`,
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    vx: Math.cos(angle) * 4,
                    vy: Math.sin(angle) * 4 - 2,
                    life: 40,
                    maxLife: 40,
                    color: "#ff6600",
                    size: 5,
                  });
                }
              }
            }
          }

          // Player vs enemy collision (damage)
          if (
            player.invincibleTimer <= 0 &&
            player.x + player.width - 8 > enemy.x &&
            player.x + 8 < enemy.x + enemy.width &&
            player.y + player.height - 8 > enemy.y &&
            player.y + 8 < enemy.y + enemy.height
          ) {
            player.hp = Math.max(
              0,
              player.hp - (enemy.type === "boss" ? 4 : 2)
            );
            player.invincibleTimer = 60;
            player.hurtTimer = 20;
            player.vy = -6;
            player.vx = enemy.direction * -4;
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI * 2 * i) / 6;
              state.particles.push({
                id: `p_${state.particleIdCounter++}`,
                x: player.x + player.width / 2,
                y: player.y + player.height / 2,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3 - 2,
                life: 30,
                maxLife: 30,
                color: "#ff0000",
                size: 4,
              });
            }
          }
        }

        // Gimmick collision
        for (const gimmick of state.gimmicks) {
          // Decrement cooldown and reset activated when cooldown expires
          if (gimmick.cooldown > 0) {
            gimmick.cooldown--;
            if (gimmick.cooldown === 0) {
              gimmick.activated = false;
            }
            continue;
          }
          if (gimmick.activated) continue;
          gimmick.animFrame = Math.floor(Date.now() / 300) % 2;
          if (
            player.x + player.width > gimmick.x + 8 &&
            player.x < gimmick.x + gimmick.width - 8 &&
            player.y + player.height > gimmick.y &&
            player.y < gimmick.y + gimmick.height
          ) {
            gimmick.activated = true;
            if (gimmick.type === "music_note") {
              state.currentBgm = gimmick.bgmUrl || null;
              gimmick.cooldown = 120; // 2 seconds cooldown
            } else {
              state.activeModal = gimmick.type;
              state.gamePhase = "modal";
            }
            for (let i = 0; i < 16; i++) {
              const angle = (Math.PI * 2 * i) / 16;
              state.particles.push({
                id: `p_${state.particleIdCounter++}`,
                x: gimmick.x + gimmick.width / 2,
                y: gimmick.y,
                vx: Math.cos(angle) * 4,
                vy: Math.sin(angle) * 4 - 2,
                life: 40,
                maxLife: 40,
                color: "#00ffcc",
                size: 4,
              });
            }
          }
        }

        // Update particles
        for (const p of state.particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.maxLife !== 15) {
            // Life 15 is used for charging inward particles
            p.vy += 0.15; // Gravity for normal particles
          }
          p.life--;
        }
        state.particles = state.particles.filter(p => p.life > 0);

        // Camera follow
        const targetCamX = player.x - CANVAS_WIDTH / 3;
        state.cameraX += (targetCamX - state.cameraX) * 0.1;
        state.cameraX = Math.max(
          0,
          Math.min(state.worldWidth - CANVAS_WIDTH, state.cameraX)
        );
      }

      // Clear justPressed after each frame
      justPressedRef.current.clear();

      // Sync React state only when changed
      const newPhase = state.gamePhase;
      const newModal = state.activeModal;
      const newBgm = state.currentBgm;
      if (newPhase !== prevPhase || newModal !== prevModal) {
        prevPhase = newPhase;
        prevModal = newModal;
        setGamePhase(newPhase);
        setModalContent(newModal);
      }

      if (newBgm) {
        setCurrentBgm(newBgm);
      }

      // Sync HP/score periodically
      if (Math.floor(time / 100) !== Math.floor(lastTimeRef.current / 100)) {
        setPlayerHp(state.player.hp);
        setScore(state.score);
      }
      lastTimeRef.current = time;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // mount once only - no dependencies needed since we use refs

  // --- Public API ---
  const startCharSelect = useCallback(() => {
    stateRef.current.gamePhase = "charSelect";
    setGamePhase("charSelect");
  }, []);

  const selectCharacter = useCallback(
    (charId: "toshi" | "yuichi" | "ramirez" | "yuj" | "mirko") => {
      stateRef.current.selectedChar = charId;
      stateRef.current.gamePhase = "playing";
      setGamePhase("playing");
    },
    []
  );

  const startGame = useCallback(() => {
    stateRef.current.gamePhase = "playing";
    setGamePhase("playing");
  }, []);

  const openModal = useCallback((type: string) => {
    stateRef.current.activeModal = type;
    stateRef.current.gamePhase = "modal";
    setModalContent(type);
    setGamePhase("modal");
  }, []);

  const closeModal = useCallback(() => {
    const state = stateRef.current;
    state.gamePhase = "playing";
    // Keep gimmick.activated = true so player doesn't re-trigger immediately.
    // Instead, move the player slightly away from the gimmick to prevent re-collision.
    for (const g of state.gimmicks) {
      if (g.type === state.activeModal) {
        // Push player away from gimmick horizontally
        const player = state.player;
        const gimmickCenterX = g.x + g.width / 2;
        const playerCenterX = player.x + player.width / 2;
        if (playerCenterX < gimmickCenterX) {
          player.x = g.x - player.width - 10;
        } else {
          player.x = g.x + g.width + 10;
        }
        // Reset activated after a short cooldown (set via a flag)
        g.activated = true;
        g.cooldown = 90; // ~1.5 seconds at 60fps
      }
    }
    state.activeModal = null;
    // Clear all held keys so player doesn't move/shoot immediately after modal closes
    keysRef.current.clear();
    justPressedRef.current.clear();
    setGamePhase("playing");
    setModalContent(null);
  }, []);

  const resetGame = useCallback(() => {
    stateRef.current = createInitialState();
    stateRef.current.gamePhase = "playing";
    keysRef.current.clear();
    justPressedRef.current.clear();
    setGamePhase("playing");
    setModalContent(null);
    setPlayerHp(28);
    setScore(0);
  }, []);

  return {
    stateRef,
    gamePhase,
    modalContent,
    currentBgm,
    playerHp,
    maxHp: 28,
    score,
    startCharSelect,
    selectCharacter,
    startGame,
    openModal,
    closeModal,
    resetGame,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    GROUND_Y,
  };
}
