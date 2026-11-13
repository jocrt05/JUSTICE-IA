import { test, expect, type Page } from "@playwright/test";

async function navigate(page: Page, name: string) {
  const toggle = page.getByRole("button", { name: "Ouvrir la navigation", exact: true });
  if (await toggle.isVisible()) await toggle.click();
  await page.getByRole("navigation").getByRole("link", { name, exact: true }).click();
}

test("tableau de bord, assistant, enregistrement et export", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Bienvenue dans votre espace/ })).toBeVisible();
  await page.screenshot({ path: `test-results/dashboard-${testInfo.project.name}.png`, fullPage: true });
  await page.getByRole("button", { name: "Parler à l’assistant" }).click();
  await page.getByLabel("Décrivez votre situation", { exact: true }).fill("Un policier m’a emmené au commissariat sans m’expliquer pourquoi.");
  await page.getByRole("button", { name: "Obtenir une orientation" }).click();
  const report = page.getByRole("region", { name: "Résultat de l’orientation" });
  await expect(report.getByRole("heading", { name: "Les faits rapportés" })).toBeVisible();
  await expect(report).toContainText("Aucun fait n’est établi");
  await expect(report).toContainText("ne permet pas, à elle seule, de conclure à une nullité");
  await expect(report.getByRole("link", { name: "Légifrance" })).toHaveAttribute("href", "https://www.legifrance.gouv.fr/");
  await report.getByRole("button", { name: "Enregistrer", exact: true }).click();
  const download = page.waitForEvent("download");
  await report.getByRole("button", { name: "Texte", exact: true }).click();
  expect((await download).suggestedFilename()).toMatch(/justice-ia-orientation.*\.txt/);
  await navigate(page, "Historique");
  await expect(page.locator(".report-item")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".report-item")).toHaveCount(1);
  await page.locator(".report-item").click();
  await expect(page.getByRole("region", { name: "Résultat de l’orientation" })).toBeVisible();
  await page.screenshot({ path: `test-results/assistant-${testInfo.project.name}.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test("dossiers : création, notes, persistance et suppression", async ({ page }) => {
  await page.goto("/#folders");
  await page.getByRole("button", { name: "Nouveau dossier", exact: true }).click();
  await page.getByLabel("Nom du dossier").fill("Démarches logement");
  await page.getByRole("button", { name: "Créer le dossier", exact: true }).click();
  await page.getByRole("button", { name: /^Démarches logement/ }).click();
  await page.getByLabel("Notes et chronologie").fill("Préparer les questions pour mon rendez-vous du 12 janvier.");
  await page.getByRole("button", { name: "Enregistrer les notes" }).click();
  await page.reload();
  await page.getByRole("button", { name: /^Démarches logement/ }).click();
  await expect(page.getByLabel("Notes et chronologie")).toHaveValue("Préparer les questions pour mon rendez-vous du 12 janvier.");
  await page.getByRole("button", { name: /Tous les dossiers/ }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Supprimer le dossier Démarches logement" }).click();
  await expect(page.getByRole("heading", { name: "Faites de la place pour vos démarches" })).toBeVisible();
});

test("annuaire, favoris, niveau de lecture et effacement des données", async ({ page }) => {
  await page.goto("/#domains");
  await page.getByRole("button", { name: /Vidéosurveillance Caméras/ }).click();
  await expect(page.getByRole("heading", { name: "Vidéosurveillance", exact: true })).toBeVisible();
  await expect(page.locator(".source-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Ajouter CNIL aux favoris" }).click();
  await navigate(page, "Favoris");
  await expect(page.locator(".source-card")).toHaveCount(1);
  await page.reload();
  await expect(page.getByRole("link", { name: "CNIL", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Ouvrir les paramètres de mon espace" }).click();
  await page.locator(".settings-modes").getByRole("button", { name: /Professionnel/ }).click();
  await page.reload();
  await expect(page.locator(".settings-modes button.selected")).toContainText("Professionnel");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Effacer mes données locales" }).click();
  await navigate(page, "Favoris");
  await expect(page.getByRole("heading", { name: "Vos références, à portée de main" })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("justice-ia.workspace.v1"))).toBeNull();
});

test("fichier texte, erreur réseau et navigation accessible sur tous les écrans", async ({ page }) => {
  await page.goto("/#assistant");
  await page.locator('input[type="file"]').setInputFiles({ name: "situation.txt", mimeType: "text/plain", buffer: Buffer.from("Mon propriétaire ne me rembourse pas ma caution.") });
  await expect(page.getByLabel("Décrivez votre situation", { exact: true })).toHaveValue("Mon propriétaire ne me rembourse pas ma caution.");
  await page.route("**/api/assistant", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Service temporairement indisponible." }) }));
  await page.getByRole("button", { name: "Obtenir une orientation" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Service temporairement indisponible.");
  await expect(page.getByRole("button", { name: "Obtenir une orientation" })).toBeEnabled();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});
