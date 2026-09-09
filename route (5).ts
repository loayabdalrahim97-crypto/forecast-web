import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ANALYZE_SYSTEM, callClaude, withLang } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { situation, context, profileSummary, profileJson, lang } = body || {};
  if (!situation || typeof situation !== "string") {
    return NextResponse.json({ error: "Situation is required." }, { status: 400 });
  }
  const useLang = lang === "ar" ? "ar" : "en";

  try {
    const userText = `BEHAVIORAL PROFILE:\n${profileSummary || ""}\n\nSITUATION:\n${situation}\n\nADDITIONAL CONTEXT:\n${context || "(none given)"}`;
    const analysis = await callClaude(withLang(ANALYZE_SYSTEM, useLang), userText, useLang);

    const run = await prisma.forecastRun.create({
      data: {
        userId,
        lang: useLang,
        situation,
        context: context || null,
        profileJson: profileJson || {},
        analysisJson: analysis as object,
      },
    });

    return NextResponse.json({ runId: run.id, analysis });
  } catch {
    return NextResponse.json({ error: "ANALYZE_FAILED" }, { status: 502 });
  }
}
