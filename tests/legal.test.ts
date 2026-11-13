import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, classify, domains, searchResources, sources } from "../src/lib/legal";
import { emptyWorkspace, workspaceSchema } from "../src/lib/storage";
import { POST } from "../src/app/api/assistant/route";

test("orientation thématique : accents, apostrophes et cas usuels", () => {
  assert.equal(classify("Quels sont mes droits en garde à vue au commissariat ?").id, "police");
  assert.equal(classify("Mon employeur refuse de verser mon salaire.").id, "travail");
  assert.equal(classify("Mon propriétaire conserve ma caution.").id, "logement");
  assert.equal(classify("Mon voisin utilise une caméra de surveillance.").id, "surveillance");
  assert.equal(classify("Que dois-je faire ?").id, "civil");
  assert.equal(domains.length, 23);
});

test("la démonstration conserve le récit comme rapporté et ne déclare pas de droit vérifié", () => {
  const report = analyze("Un policier m’a emmené au commissariat sans m’expliquer pourquoi.", "professionnel", "2025-01-02");
  assert.equal(report.domainId, "police");
  assert.equal(report.engine, "demo");
  assert.equal(report.factsDate, "2025-01-02");
  assert.deepEqual(report.reportedFacts, [report.question]);
  assert.match(report.establishedFacts, /Aucun fait n’est établi/);
  assert.match(report.limits, /Aucune version de texte/);
  assert.match(report.hypotheses.join(" "), /ne permet pas.*conclure à une nullité/);
  assert.ok(report.sourceIds.every((id) => sources.some((s) => s.id === id)));
  assert.ok(report.questions.length > 0);
});

test("annuaire : filtrage combiné et absence de résultats inventés", () => {
  assert.deepEqual(searchResources("requête introuvable"), []);
  assert.ok(searchResources("caméra").some((s) => s.id === "cnil"));
  assert.equal(searchResources("CNIL", "travail").length, 0);
  assert.ok(searchResources("", "surveillance").every((s) => ["cnil", "legifrance", "public"].includes(s.id)));
  for (const source of sources) {
    const url = new URL(source.url);
    assert.equal(url.protocol, "https:");
    assert.ok(["www.legifrance.gouv.fr", "www.service-public.fr", "www.justice.fr", "www.cnil.fr", "www.courdecassation.fr", "www.conseil-etat.fr", "www.conseil-constitutionnel.fr", "eur-lex.europa.eu"].includes(url.hostname));
  }
});

test("stockage : données partielles ou mal formées rejetées", () => {
  assert.equal(workspaceSchema.safeParse(emptyWorkspace()).success, true);
  assert.equal(workspaceSchema.safeParse({ favorites: "oops" }).success, false);
  assert.equal(workspaceSchema.safeParse({ ...emptyWorkspace(), reports: [{ question: "hello" }] }).success, false);
  assert.equal(workspaceSchema.safeParse({ ...emptyWorkspace(), reports: [analyze("Ma question sur un contrat civil.", "citoyen")] }).success, true);
});

test("API : validation du récit, des dates et du mode", async () => {
  const post = (body: unknown) => POST(new Request("http://localhost/api/assistant", { method: "POST", body: JSON.stringify(body) }));
  assert.equal((await post({ question: "court" })).status, 400);
  assert.equal((await post({ question: "x".repeat(6001) })).status, 400);
  assert.equal((await post({ question: "Une question assez longue pour le test", mode: "admin" })).status, 400);
  assert.equal((await post({ question: "Une question assez longue pour le test", factsDate: "2025-02-30" })).status, 400);
  assert.equal((await post({ question: "Une question assez longue pour le test", factsDate: "2099-01-01" })).status, 400);
  assert.equal((await post({ question: "Une question assez longue pour le test", domainId: "invente" })).status, 400);
  const valid = await post({ question: "Mon employeur ne verse pas mon salaire.", factsDate: "2025-01-01" });
  assert.equal(valid.status, 200);
  assert.equal(valid.headers.get("Cache-Control"), "no-store");
  assert.equal((await valid.json()).domainId, "travail");
  const malformed = await POST(new Request("http://localhost/api/assistant", { method: "POST", body: "{invalid" }));
  assert.equal(malformed.status, 400);
  const tooLarge = await POST(new Request("http://localhost/api/assistant", { method: "POST", body: JSON.stringify({ question: "x".repeat(12001) }) }));
  assert.equal(tooLarge.status, 413);
});
