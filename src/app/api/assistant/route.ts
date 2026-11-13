import { NextResponse } from "next/server";
import { z } from "zod";
import { analyze, domains } from "@/lib/legal";

export const runtime = "nodejs";
const schema = z.object({
  question: z.string().trim().min(15, "Décrivez votre situation en au moins 15 caractères.").max(6000, "Votre récit est limité à 6 000 caractères."),
  mode: z.enum(["citoyen", "avance", "professionnel"]).default("citoyen"),
  factsDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((v) => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v && v <= new Date().toISOString().slice(0, 10), "Indiquez une date valide qui n’est pas dans le futur.").optional(),
  domainId: z.enum(domains.map((d) => d.id) as [string, ...string[]]).optional(),
});

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 40000) return NextResponse.json({ error: "Le récit est trop volumineux." }, { status: 413 });
  try {
    const body = await request.text();
    if (body.length > 12000) return NextResponse.json({ error: "Le récit est trop volumineux." }, { status: 413 });
    const parsed = schema.safeParse(JSON.parse(body));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const { question, mode, factsDate, domainId } = parsed.data;
    return NextResponse.json(analyze(question, mode, factsDate, domainId), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "La demande est illisible. Réessayez avec une description textuelle." }, { status: 400 });
  }
}
