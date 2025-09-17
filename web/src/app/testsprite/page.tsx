"use client";
import { useMemo, useRef, useState } from "react";

function analyzeTransparency(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { transparentPct: 0, hasOpaqueBorder: false };

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let transparent = 0;
  let total = width * height;
  let opaqueBorderPixels = 0;
  const isBorder = (x: number, y: number) => x === 0 || y === 0 || x === width - 1 || y === height - 1;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    const pixelIndex = i / 4;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    if (a === 0) transparent++;
    if (isBorder(x, y) && a > 0) opaqueBorderPixels++;
  }

  return {
    transparentPct: Math.round((transparent / total) * 100),
    hasOpaqueBorder: opaqueBorderPixels > 0,
  };
}

export default function TestSpritePage() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string>("");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const defaultPrompt = useMemo(
    () =>
      "32x32 pixel art character sprite, no background, transparent background, centered, clean silhouette, game-ready",
    []
  );

  async function generate() {
    setLoading(true);
    setReport("");
    try {
      const res = await fetch("/api/testsprite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: defaultPrompt, size: "256x256" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Request failed");
      setImgSrc(json.image);
      setTimeout(() => runAnalysis(), 50);
    } catch (e: any) {
      setReport(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function runAnalysis() {
    const img = imgRef.current;
    if (!img) return;
    const r = analyzeTransparency(img);
    const issues = [] as string[];
    if (r.transparentPct < 30) issues.push("Low transparency — possible solid background");
    if (r.hasOpaqueBorder) issues.push("Opaque pixels on the outer border (not fully trimmed)");
    setReport(
      `Transparency: ${r.transparentPct}%\n` + (issues.length ? `Issues: ${issues.join(", ")}` : "No obvious issues detected")
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-semibold">Test Sprite Generator</h1>
      <p className="text-white/70 mt-1">Generates a pixel-art sprite and checks for backgrounds/security.</p>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={generate}
          className="rounded bg-cyan-500 px-4 py-2 font-medium text-black hover:bg-cyan-400 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Sprite"}
        </button>
        {imgSrc ? (
          <button onClick={runAnalysis} className="rounded border border-white/20 px-4 py-2 hover:bg-white/10">
            Re-run Analysis
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/70">Preview</p>
            {imgSrc ? (
              <img ref={imgRef} src={imgSrc} alt="sprite" className="mt-3 h-auto w-full max-w-xs" />
            ) : (
              <div className="mt-3 h-48 w-full max-w-xs animate-pulse rounded bg-white/10" />
            )}
          </div>
        </div>
        <div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/70">Report</p>
            <pre className="mt-3 whitespace-pre-wrap text-sm">{report || "No report yet."}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}








