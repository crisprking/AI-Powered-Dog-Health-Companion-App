import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY. Set it in .env.local." },
      { status: 500 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const prompt: string =
    (body?.prompt as string) ??
    "32x32 pixel art character sprite, no background, transparent background, centered, clean silhouette, high contrast, game-ready, in the style of classic arcade sprites";
  const size: string = (body?.size as string) ?? "256x256";

  try {
    const client = new OpenAI({ apiKey });
    // Request transparent background if the model supports it
    const image = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size,
      background: "transparent" as any,
    });

    const b64 = image.data?.[0]?.b64_json;
    if (!b64) return badRequest("No image returned from OpenAI");

    return NextResponse.json({
      image: `data:image/png;base64,${b64}`,
      meta: { size, model: "gpt-image-1" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "OpenAI request failed" },
      { status: 500 }
    );
  }
}








