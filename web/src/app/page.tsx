import { Hero } from "@/components/Hero";
import { GameShowcase } from "@/components/GameShowcase";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Hero />
      <GameShowcase />
      <Features />
      <Footer />
    </div>
  );
}
