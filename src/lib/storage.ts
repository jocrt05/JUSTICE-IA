import { z } from "zod";

export const STORAGE_KEY = "justice-ia.workspace.v1";
const analysisSchema = z.object({
  id: z.string(), createdAt: z.string(), question: z.string(), domainId: z.string(),
  mode: z.enum(["citoyen", "avance", "professionnel"]), factsDate: z.string().optional(),
  introduction: z.string(), reportedFacts: z.array(z.string()), establishedFacts: z.string(),
  hypotheses: z.array(z.string()), questions: z.array(z.string()), steps: z.array(z.string()),
  limits: z.string(), sourceIds: z.array(z.string()), engine: z.literal("demo"),
});
export const workspaceSchema = z.object({
  favorites: z.array(z.string()).max(100),
  reports: z.array(analysisSchema).max(100),
  folders: z.array(z.object({ id: z.string(), name: z.string().max(120), notes: z.string().max(12000), createdAt: z.string() })).max(100),
  mode: z.enum(["citoyen", "avance", "professionnel"]),
});
export type Workspace = z.infer<typeof workspaceSchema>;
export const emptyWorkspace = (): Workspace => ({ favorites: [], reports: [], folders: [], mode: "citoyen" });
