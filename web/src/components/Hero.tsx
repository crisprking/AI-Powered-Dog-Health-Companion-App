"use client";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#22d3ee22,transparent_40%),radial-gradient(circle_at_80%_30%,#a78bfa22,transparent_40%),radial-gradient(circle_at_50%_80%,#f59e0b22,transparent_40%)]" />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
        >
          <Rocket className="h-4 w-4 text-cyan-300" />
          Welcome to Game Blitz
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          Play bite-size games with lightning speed
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-white/70"
        >
          A playful, modern, and futuristic arcade where every click sparks a new challenge.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <a
            href="#games"
            className="rounded-lg bg-cyan-500 px-5 py-3 font-medium text-black shadow hover:bg-cyan-400"
          >
            Play now
          </a>
          <a
            href="#features"
            className="rounded-lg border border-white/20 px-5 py-3 font-medium text-white hover:bg-white/10"
          >
            Learn more
          </a>
        </motion.div>
      </div>
    </section>
  );
}








