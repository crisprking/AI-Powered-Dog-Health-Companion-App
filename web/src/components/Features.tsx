import { Sparkles, Gauge, Globe2 } from "lucide-react";

const features = [
  {
    title: "Futuristic UI",
    description: "Sleek gradients, glassmorphism, and premium accents.",
    icon: Sparkles,
  },
  {
    title: "Blazing fast",
    description: "Optimized with Next.js 15 and Turbopack.",
    icon: Gauge,
  },
  {
    title: "Play anywhere",
    description: "Works great on desktop and mobile browsers.",
    icon: Globe2,
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Why players love it</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <f.icon className="h-6 w-6 text-violet-300" />
              <h3 className="mt-3 text-lg font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-white/70">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}








