import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { runId, choice, note } = body || {};
  if (!runId || !choice) return NextResponse.json({ error: "Missing runId or choice." }, { status: 400 });

  const run = await prisma.forecastRun.findFirst({ where: { id: runId, userId } });
  if (!run) return NextResponse.json({ error: "Forecast run not found." }, { status: 404 });

  await prisma.forecastRun.update({
    where: { id: run.id },
    data: { outcomeJson: { choice, note: note || "" } },
  });

  return NextResponse.json({ ok: true });
}
