"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Vec = { x: number; y: number };
type Bullet = { p: Vec; v: Vec };
type Asteroid = { p: Vec; v: Vec; r: number };

const W = 800;
const H = 600;

export default function SpaceShooterPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keys = useRef<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const ship = useRef({ p: { x: W / 2, y: H - 80 }, v: { x: 0, y: 0 } });
  const bullets = useRef<Bullet[]>([]);
  const asteroids = useRef<Asteroid[]>([]);

  function spawnAsteroid() {
    const x = Math.random() * W;
    const r = 18 + Math.random() * 22;
    const speed = 0.6 + Math.random() * 1.2;
    asteroids.current.push({ p: { x, y: -r }, v: { x: (Math.random() - 0.5) * 0.4, y: speed }, r });
  }

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs?.getContext("2d");
    if (!cvs || !ctx) return;
    cvs.width = W;
    cvs.height = H;
    let raf = 0;
    let last = 0;
    let spawnTimer = 0;

    function loop(t: number) {
      const dt = (t - last) || 16;
      last = t;
      update(dt);
      draw(ctx);
      raf = requestAnimationFrame(loop);
    }
    function update(dt: number) {
      if (gameOver) return;
      const s = ship.current;
      const accel = 0.002 * dt;
      if (keys.current["ArrowLeft"]) s.v.x -= accel;
      if (keys.current["ArrowRight"]) s.v.x += accel;
      s.v.x *= 0.92;
      s.p.x += s.v.x * dt;
      s.p.x = Math.max(20, Math.min(W - 20, s.p.x));

      spawnTimer += dt;
      if (spawnTimer > 600) {
        spawnTimer = 0;
        spawnAsteroid();
      }

      bullets.current.forEach((b) => {
        b.p.x += b.v.x * dt;
        b.p.y += b.v.y * dt;
      });
      bullets.current = bullets.current.filter((b) => b.p.y > -10);

      asteroids.current.forEach((a) => {
        a.p.x += a.v.x * dt;
        a.p.y += a.v.y * dt;
      });
      asteroids.current = asteroids.current.filter((a) => a.p.y < H + a.r);

      // Collision bullets-asteroids
      for (let i = asteroids.current.length - 1; i >= 0; i--) {
        const a = asteroids.current[i];
        for (let j = bullets.current.length - 1; j >= 0; j--) {
          const b = bullets.current[j];
          const dx = a.p.x - b.p.x;
          const dy = a.p.y - b.p.y;
          if (dx * dx + dy * dy < a.r * a.r) {
            asteroids.current.splice(i, 1);
            bullets.current.splice(j, 1);
            setScore((s) => s + 10);
            break;
          }
        }
      }

      // Collision ship-asteroids
      for (const a of asteroids.current) {
        const dx = a.p.x - ship.current.p.x;
        const dy = a.p.y - ship.current.p.y;
        if (dx * dx + dy * dy < (a.r + 16) * (a.r + 16)) {
          setGameOver(true);
          break;
        }
      }
    }
    function draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "#05080f";
      ctx.fillRect(0, 0, W, H);
      // stars
      ctx.fillStyle = "#0ea5e9";
      for (let i = 0; i < 60; i++) ctx.fillRect(((i * 73) % W), ((i * 37) % H), 2, 2);

      // ship
      ctx.fillStyle = "#22d3ee";
      const s = ship.current.p;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - 16);
      ctx.lineTo(s.x - 12, s.y + 16);
      ctx.lineTo(s.x + 12, s.y + 16);
      ctx.closePath();
      ctx.fill();

      // bullets
      ctx.fillStyle = "#eab308";
      bullets.current.forEach((b) => ctx.fillRect(b.p.x - 2, b.p.y - 8, 4, 10));

      // asteroids
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 2;
      asteroids.current.forEach((a) => {
        ctx.beginPath();
        ctx.arc(a.p.x, a.p.y, a.r, 0, Math.PI * 2);
        ctx.stroke();
      });

      if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 28px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("Game Over — press R to restart", W / 2, H / 2);
      }
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [gameOver]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.type === "keydown") keys.current[e.key] = true;
      else keys.current[e.key] = false;
      if (e.type === "keydown" && e.key === " ") {
        bullets.current.push({ p: { ...ship.current.p }, v: { x: 0, y: -0.8 } });
      }
      if (e.type === "keydown" && e.key.toLowerCase() === "r") {
        // reset
        ship.current = { p: { x: W / 2, y: H - 80 }, v: { x: 0, y: 0 } };
        bullets.current = [];
        asteroids.current = [];
        setScore(0);
        setGameOver(false);
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Space Shooter</h1>
          <Link href="/" className="text-sm text-white/70 hover:text-white">← Home</Link>
        </div>
        <p className="text-white/70">Arrow keys to move, Space to fire, R to restart.</p>
        <p className="mt-1">Score: <span className="font-medium">{score}</span></p>
        <div className="mt-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 inline-block">
            <canvas ref={canvasRef} style={{ width: "min(95vw, 800px)", height: "min(70vh, 600px)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}








