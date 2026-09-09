import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FORECAST_SYSTEM, callClaude, withLang } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { runId, profileSummary, qaText } = body || {};
  if (!runId) return NextResponse.json({ error: "Missing runId." }, { status: 400 });

  const run = await prisma.forecastRun.findFirst({ where: { id: runId, userId } });
  if (!run) return NextResponse.json({ error: "Forecast run not found." }, { status: 404 });

  const analysis = (run.analysisJson || {}) as {
    facts?: string[]; assumptions?: string[]; unknowns?: string[]; variables?: string[];
  };
  const useLang = run.lang === "ar" ? "ar" : "en";

  try {
    const userText = `BEHAVIORAL PROFILE:\n${profileSummary || ""}\n\nSITUATION:\n${run.situation}\n\nADDITIONAL CONTEXT:\n${run.context || "(none)"}\n\nFACTS:\n${(analysis.facts || []).join("; ")}\n\nASSUMPTIONS:\n${(analysis.assumptions || []).join("; ")}\n\nUNKNOWNS:\n${(analysis.unknowns || []).join("; ")}\n\nKEY VARIABLES:\n${(analysis.variables || []).join("; ")}\n\nFOLLOW-UP ANSWERS:\n${qaText || "(no follow-up questions were needed)"}`;
    const forecast = await callClaude(withLang(FORECAST_SYSTEM, useLang), userText, useLang);

    await prisma.forecastRun.update({
      where: { id: run.id },
      data: { forecastJson: forecast as object },
    });

    return NextResponse.json({ forecast });
  } catch {
    return NextResponse.json({ error: "FORECAST_FAILED" }, { status: 502 });
  }
}
