"use client";
import { motion } from "framer-motion";
import { Gamepad2, Zap, Joystick } from "lucide-react";

const games = [
  {
    title: "Snake Sprint",
    description: "Classic snake with neon vibes and smooth controls.",
    icon: Joystick,
    href: "/snake",
  },
  {
    title: "Space Shooter",
    description: "Blast asteroids and dodge enemies at warp speed.",
    icon: Zap,
    href: "/space-shooter",
  },
  {
    title: "Memory Match",
    description: "Flip, match, and race against the clock.",
    icon: Gamepad2,
    href: "/testsprite",
  },
];

export function GameShowcase() {
  return (
    <section id="games" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Featured games</h2>
        <p className="mt-2 text-white/70">Jump in and start playing instantly.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {games.map((g, idx) => (
            <motion.a
              key={g.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
              href={g.href}
            >
              <g.icon className="h-6 w-6 text-cyan-300" />
              <h3 className="mt-3 text-lg font-medium">{g.title}</h3>
              <p className="mt-1 text-sm text-white/70">{g.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}


