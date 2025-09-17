"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Cell = { x: number; y: number };

const GRID_SIZE = 20;
const STEP_MS = 120; // snake speed

export default function SnakePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dirRef = useRef<Cell>({ x: 1, y: 0 });
  const pendingDir = useRef<Cell>({ x: 1, y: 0 });
  const snakeRef = useRef<Cell[]>([{ x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 }]);
  const foodRef = useRef<Cell>({ x: 15, y: 10 });
  const lastTickRef = useRef<number>(0);
  const accRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function spawnFood(current: Cell[]): Cell {
    while (true) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      if (!current.some((c) => c.x === x && c.y === y)) return { x, y };
    }
  }

  function reset() {
    dirRef.current = { x: 1, y: 0 };
    pendingDir.current = { x: 1, y: 0 };
    snakeRef.current = [{ x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 }];
    foodRef.current = { x: 15, y: 10 };
    lastTickRef.current = 0;
    accRef.current = 0;
    setScore(0);
    setGameOver(false);
  }

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const { x, y } = dirRef.current;
      if (e.key === "ArrowUp" && y !== 1) pendingDir.current = { x: 0, y: -1 };
      else if (e.key === "ArrowDown" && y !== -1) pendingDir.current = { x: 0, y: 1 };
      else if (e.key === "ArrowLeft" && x !== 1) pendingDir.current = { x: -1, y: 0 };
      else if (e.key === "ArrowRight" && x !== -1) pendingDir.current = { x: 1, y: 0 };
      else if (e.key.toLowerCase() === "r") reset();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const logicalSize = 640; // internal resolution for crispness
    canvas.width = logicalSize;
    canvas.height = logicalSize;

    let raf = 0;
    function loop(ts: number) {
      if (gameOver) return; // stop when game over; restart via reset()
      if (!lastTickRef.current) lastTickRef.current = ts;
      const dt = ts - lastTickRef.current;
      lastTickRef.current = ts;
      accRef.current += dt;

      while (accRef.current >= STEP_MS) {
        accRef.current -= STEP_MS;
        step();
      }
      draw();
      raf = requestAnimationFrame(loop);
    }

    function step() {
      dirRef.current = pendingDir.current;
      const dir = dirRef.current;
      const snake = snakeRef.current;
      const head = snake[snake.length - 1];
      const next = { x: head.x + dir.x, y: head.y + dir.y };

      // Check bounds
      if (next.x < 0 || next.y < 0 || next.x >= GRID_SIZE || next.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }
      // Check self collision
      if (snake.some((c) => c.x === next.x && c.y === next.y)) {
        setGameOver(true);
        return;
      }

      // Move
      snake.push(next);
      const food = foodRef.current;
      if (next.x === food.x && next.y === food.y) {
        setScore((s) => s + 1);
        foodRef.current = spawnFood(snake);
      } else {
        snake.shift();
      }
    }

    function draw() {
      const snake = snakeRef.current;
      const food = foodRef.current;
      const size = canvas.width;
      const cell = size / GRID_SIZE;

      // Background grid
      ctx.fillStyle = "#0b0b0b";
      ctx.fillRect(0, 0, size, size);
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          ctx.strokeStyle = "#222";
          ctx.strokeRect(x * cell, y * cell, cell, cell);
        }
      }

      // Food
      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(food.x * cell, food.y * cell, cell, cell);

      // Snake body
      snake.forEach((seg, idx) => {
        const t = idx / snake.length;
        ctx.fillStyle = `hsl(${200 + t * 80}, 90%, ${50 + t * 20}%)`;
        ctx.fillRect(seg.x * cell, seg.y * cell, cell, cell);
      });

      if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 28px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("Game Over — press R to restart", size / 2, size / 2);
      }
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [gameOver]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Snake Sprint</h1>
          <Link href="/" className="text-sm text-white/70 hover:text-white">← Home</Link>
        </div>
        <p className="text-white/70">Use arrow keys. Press R to restart.</p>
        <p className="mt-1">Score: <span className="font-medium">{score}</span></p>
        <div className="mt-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 inline-block">
            <canvas
              ref={canvasRef}
              style={{ width: "min(90vw, 640px)", height: "min(90vw, 640px)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}








