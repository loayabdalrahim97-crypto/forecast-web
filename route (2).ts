import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UPDATE_SYSTEM, callClaude, withLang } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { runId, profileSummary, newInfo } = body || {};
  if (!runId || !newInfo) return NextResponse.json({ error: "Missing runId or newInfo." }, { status: 400 });

  const run = await prisma.forecastRun.findFirst({ where: { id: runId, userId } });
  if (!run) return NextResponse.json({ error: "Forecast run not found." }, { status: 404 });

  const forecast = (run.forecastJson || {}) as { summary?: string; scenarios?: { title: string; likelihood: string }[] };
  const useLang = run.lang === "ar" ? "ar" : "en";

  try {
    const userText = `ORIGINAL SITUATION:\n${run.situation}\n\nBEHAVIORAL PROFILE:\n${profileSummary || ""}\n\nPREVIOUS FORECAST SUMMARY:\n${forecast.summary || ""}\n\nPREVIOUS SCENARIOS:\n${(forecast.scenarios || []).map((s) => `${s.title} (likelihood: ${s.likelihood})`).join("; ")}\n\nNEW INFORMATION FROM THE USER:\n${newInfo}`;
    const result = await callClaude(withLang(UPDATE_SYSTEM, useLang), userText, useLang);

    await prisma.forecastRun.update({
      where: { id: run.id },
      data: { forecastJson: (result as { forecast?: object }).forecast || run.forecastJson || {} },
    });

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 502 });
  }
}
