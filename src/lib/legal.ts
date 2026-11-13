export type Domain = { id: string; name: string; description: string; icon: string; color: string; keywords: string[]; sourceIds: string[] };
export type Source = { id: string; name: string; publisher: string; url: string; description: string; kind: string };

export const sources: Source[] = [
  { id: "legifrance", name: "Légifrance", publisher: "Direction de l’information légale et administrative", url: "https://www.legifrance.gouv.fr/", description: "Codes, lois, règlements et jurisprudence. Consultez les versions des textes à la date des faits.", kind: "Textes & codes" },
  { id: "public", name: "Service Public", publisher: "Administration française", url: "https://www.service-public.fr/", description: "Fiches pratiques pour comprendre vos droits, vos obligations et vos démarches.", kind: "Démarches" },
  { id: "justice", name: "Justice.fr", publisher: "Ministère de la Justice", url: "https://www.justice.fr/", description: "Informations sur les procédures, l’accès au droit et les professionnels de la justice.", kind: "Procédures" },
  { id: "cnil", name: "CNIL", publisher: "Commission nationale de l’informatique et des libertés", url: "https://www.cnil.fr/", description: "Protection des données, vidéosurveillance et exercice de vos droits numériques.", kind: "Données personnelles" },
  { id: "cassation", name: "Cour de cassation", publisher: "Cour de cassation", url: "https://www.courdecassation.fr/", description: "Décisions et publications de la plus haute juridiction de l’ordre judiciaire.", kind: "Jurisprudence" },
  { id: "etat", name: "Conseil d’État", publisher: "Conseil d’État", url: "https://www.conseil-etat.fr/", description: "Décisions et ressources sur la justice administrative.", kind: "Jurisprudence" },
  { id: "constitution", name: "Conseil constitutionnel", publisher: "Conseil constitutionnel", url: "https://www.conseil-constitutionnel.fr/", description: "Décisions constitutionnelles et ressources sur les droits et libertés.", kind: "Constitution" },
  { id: "europe", name: "EUR-Lex", publisher: "Office des publications de l’Union européenne", url: "https://eur-lex.europa.eu/", description: "Accès officiel au droit et aux décisions de l’Union européenne.", kind: "Droit européen" },
];

export const domains: Domain[] = [
  { id: "penal", name: "Droit pénal", description: "Infractions, responsabilité et défense", icon: "Scale", color: "purple", keywords: ["plainte", "infraction", "vol", "violence", "penal", "menace"], sourceIds: ["legifrance", "justice"] },
  { id: "travail", name: "Droit du travail", description: "Contrat, salaire et vie professionnelle", icon: "BriefcaseBusiness", color: "blue", keywords: ["travail", "salarie", "employeur", "licenciement", "salaire", "contrat de travail", "harcelement"], sourceIds: ["public", "legifrance", "justice"] },
  { id: "famille", name: "Droit de la famille", description: "Famille, séparation et protection", icon: "Users", color: "rose", keywords: ["divorce", "famille", "enfant", "pension", "mariage", "separation"], sourceIds: ["public", "justice", "legifrance"] },
  { id: "logement", name: "Immobilier & logement", description: "Location, propriété et voisinage", icon: "House", color: "green", keywords: ["loyer", "logement", "bail", "proprietaire", "locataire", "appartement", "expulsion", "caution"], sourceIds: ["public", "legifrance", "justice"] },
  { id: "police", name: "Police & gendarmerie", description: "Contrôles, interventions et vos droits", icon: "ShieldCheck", color: "gold", keywords: ["police", "policier", "gendarme", "commissariat", "garde a vue", "arrestation", "interpelle", "controle d'identite", "fouille", "perquisition"], sourceIds: ["justice", "legifrance", "public"] },
  { id: "consommation", name: "Droit des consommateurs", description: "Achats, garanties et litiges", icon: "ShoppingBag", color: "orange", keywords: ["achat", "consommateur", "remboursement", "garantie", "commande", "livraison"], sourceIds: ["public", "legifrance"] },
  { id: "civil", name: "Droit civil", description: "Contrats, responsabilité et réparation", icon: "BookOpen", color: "blue", keywords: ["civil", "responsabilite", "dommage", "contrat"], sourceIds: ["legifrance", "justice"] },
  { id: "administratif", name: "Droit administratif", description: "Administration et services publics", icon: "Landmark", color: "purple", keywords: ["administration", "mairie", "prefecture", "administratif"], sourceIds: ["public", "etat"] },
  { id: "constitutionnel", name: "Droit constitutionnel", description: "Constitution et institutions", icon: "Landmark", color: "gold", keywords: ["constitution", "qpc"], sourceIds: ["constitution", "legifrance"] },
  { id: "scolaire", name: "Scolarité & éducation", description: "École, études et droits des élèves", icon: "GraduationCap", color: "green", keywords: ["ecole", "scolaire", "eleve", "lycee", "college", "universite"], sourceIds: ["public", "legifrance"] },
  { id: "route", name: "Code de la route", description: "Permis, circulation et infractions", icon: "Car", color: "blue", keywords: ["permis", "route", "conduite", "radar", "voiture"], sourceIds: ["public", "legifrance"] },
  { id: "procedure", name: "Procédures judiciaires", description: "Tribunaux, étapes et démarches", icon: "Gavel", color: "purple", keywords: ["tribunal", "procedure", "audience", "assignation", "proces"], sourceIds: ["justice", "legifrance"] },
  { id: "amendes", name: "Amendes & sanctions", description: "Comprendre et contester une sanction", icon: "Receipt", color: "orange", keywords: ["amende", "contravention", "sanction"], sourceIds: ["public", "legifrance"] },
  { id: "sante", name: "Droit médical & santé", description: "Soins, patients et professionnels", icon: "HeartPulse", color: "rose", keywords: ["medical", "sante", "hopital", "medecin", "patient"], sourceIds: ["public", "legifrance"] },
  { id: "numerique", name: "Droit numérique", description: "Internet, informatique et usages", icon: "Laptop", color: "blue", keywords: ["internet", "informatique", "piratage", "reseau social"], sourceIds: ["cnil", "legifrance"] },
  { id: "donnees", name: "Données personnelles", description: "Vie privée et droits sur vos données", icon: "Fingerprint", color: "green", keywords: ["donnee", "rgpd", "confidentialite", "fichier", "vie privee"], sourceIds: ["cnil", "europe"] },
  { id: "surveillance", name: "Vidéosurveillance", description: "Caméras, enregistrements et surveillance", icon: "Cctv", color: "purple", keywords: ["camera", "surveillance", "filmer", "film", "enregistrement", "drone", "geolocalisation", "reconnaissance faciale"], sourceIds: ["cnil", "legifrance", "public"] },
  { id: "etrangers", name: "Droit des étrangers", description: "Séjour, nationalité et démarches", icon: "Globe", color: "blue", keywords: ["etranger", "sejour", "visa", "oqtf", "asile", "nationalite"], sourceIds: ["public", "legifrance", "etat"] },
  { id: "fiscal", name: "Droit fiscal", description: "Impôts, taxes et contestations", icon: "Receipt", color: "gold", keywords: ["impot", "fiscal", "taxe", "declaration"], sourceIds: ["public", "legifrance"] },
  { id: "assurances", name: "Droit des assurances", description: "Garanties, sinistres et indemnisation", icon: "Umbrella", color: "green", keywords: ["assurance", "sinistre", "indemnisation"], sourceIds: ["public", "legifrance"] },
  { id: "associations", name: "Droit des associations", description: "Création, statuts et fonctionnement", icon: "HandHeart", color: "rose", keywords: ["association", "benevole", "statuts"], sourceIds: ["public", "legifrance"] },
  { id: "entreprises", name: "Droit des entreprises", description: "Activité, société et obligations", icon: "Building2", color: "blue", keywords: ["entreprise", "societe", "commercial", "entrepreneur"], sourceIds: ["legifrance", "public"] },
  { id: "libertes", name: "Libertés fondamentales", description: "Droits, égalité et libertés publiques", icon: "Bird", color: "gold", keywords: ["liberte", "discrimination", "manifestation", "expression"], sourceIds: ["constitution", "europe", "legifrance"] },
];

export const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’]/g, "'");

export type Mode = "citoyen" | "avance" | "professionnel";
export type Analysis = {
  id: string; createdAt: string; question: string; domainId: string; mode: Mode; factsDate?: string;
  introduction: string; reportedFacts: string[]; establishedFacts: string;
  hypotheses: string[]; questions: string[]; steps: string[]; limits: string;
  sourceIds: string[]; engine: "demo";
};

const guides: Record<string, { hypotheses: string[]; questions: string[]; steps: string[] }> = {
  police: {
    hypotheses: ["La nature de la mesure doit être précisée : contrôle d’identité, audition libre et garde à vue relèvent de cadres différents.", "Une difficulté concernant la notification des droits ou l’accès à un avocat mérite un examen des horaires et des procès-verbaux. Elle ne permet pas, à elle seule, de conclure à une nullité."],
    questions: ["À quelle date et à quelle heure les faits ont-ils eu lieu ?", "Pouviez-vous partir librement ? Quelle mesure vous a été annoncée ?", "Quels droits ont été notifiés, à quel moment et sur quel document ?", "Avez-vous demandé un avocat, un médecin ou l’information d’un proche ? Quelle réponse avez-vous reçue ?"],
    steps: ["Reconstituez une chronologie : premier contact, déplacement, notification, auditions et fin de la mesure.", "Conservez les documents auxquels vous avez légalement accès et notez les demandes formulées.", "Faites examiner la procédure et les délais de recours par un avocat. Une éventuelle nullité dépend du cadre applicable et de conditions précises."],
  },
  travail: {
    hypotheses: ["Le cadre dépend notamment du statut, du contrat et de la convention collective applicable.", "Le motif de la décision et la chronologie des échanges doivent être examinés avant de qualifier un éventuel manquement."],
    questions: ["Êtes-vous salarié du secteur privé, agent public ou indépendant ?", "Quel est le type de contrat et quelle est votre ancienneté ?", "Quel écrit avez-vous reçu et à quelle date ?", "Quelle convention collective s’applique, si vous la connaissez ?"],
    steps: ["Rassemblez contrat, bulletins de paie et échanges écrits pertinents.", "Établissez une chronologie sans modifier les documents originaux.", "Consultez les fiches officielles adaptées à votre statut et faites vérifier les délais par un professionnel ou un service d’accès au droit."],
  },
  logement: {
    hypotheses: ["Les règles à rechercher dépendent du type de location, du bail et de l’usage du logement.", "Un désaccord entre bailleur et locataire nécessite de comparer le bail, les pièces et les démarches déjà effectuées."],
    questions: ["Êtes-vous locataire, propriétaire ou occupant à un autre titre ?", "S’agit-il d’une location vide, meublée ou d’un autre contrat ?", "À quelles dates les faits et les échanges écrits ont-ils eu lieu ?", "Avez-vous reçu une mise en demeure, un congé ou un acte de procédure ?"],
    steps: ["Conservez le bail, les quittances, les états des lieux et les courriers.", "Décrivez précisément le désaccord et les démarches déjà tentées.", "Consultez les ressources officielles puis un conseiller de l’ADIL ou un professionnel pour examiner votre situation et les délais."],
  },
  surveillance: {
    hypotheses: ["Le cadre à examiner dépend de l’auteur de la surveillance, du lieu filmé, de la finalité et des personnes concernées.", "Une caméra dans un domicile, au travail ou sur la voie publique ne relève pas nécessairement des mêmes règles."],
    questions: ["Qui a installé le dispositif et dans quel lieu ?", "Que filme-t-il exactement : espace privé, parties communes ou voie publique ?", "Les personnes sont-elles informées et le son est-il enregistré ?", "Y a-t-il des salariés, des élèves ou des mineurs concernés ?"],
    steps: ["Documentez le dispositif sans vous exposer ni collecter inutilement les données de tiers.", "Identifiez le responsable du dispositif et les informations disponibles sur l’usage des images.", "Consultez les ressources de la CNIL pour identifier le cadre et les démarches adaptés. Faites vérifier les recours en cas de litige."],
  },
};

export function classify(text: string): Domain {
  const query = normalize(text);
  const ranked = domains.map((domain) => ({ domain, score: domain.keywords.reduce((total, word) => total + (query.includes(word) ? word.length : 0), 0) })).sort((a, b) => b.score - a.score);
  return ranked[0].score ? ranked[0].domain : domains.find((d) => d.id === "civil")!;
}

export function analyze(question: string, mode: Mode, factsDate?: string, selectedDomain?: string): Analysis {
  const domain = domains.find((d) => d.id === selectedDomain) ?? classify(question);
  const guide = guides[domain.id] ?? {
    hypotheses: ["Le domaine suggéré est une orientation thématique, pas une qualification juridique établie.", "La règle applicable dépend des faits, de leur date et des documents disponibles. Aucun texte ni délai n’a été vérifié dans cette démonstration."],
    questions: ["Quand et où les faits se sont-ils déroulés ?", "Quelles personnes ou institutions sont concernées ?", "Quels documents et échanges écrits avez-vous reçus ?", "Quelle démarche avez-vous déjà engagée et quel résultat souhaitez-vous obtenir ?"],
    steps: ["Rédigez une chronologie et conservez les documents originaux.", "Utilisez les ressources officielles ci-dessous pour préciser votre recherche.", "Faites confirmer les règles, leur version et les délais par un professionnel du droit avant d’agir."],
  };
  return {
    id: crypto.randomUUID(), createdAt: new Date().toISOString(), question, domainId: domain.id, mode, factsDate,
    introduction: `Votre situation semble concerner le domaine « ${domain.name} ». Voici une première grille de lecture pour organiser les faits et préparer vos recherches.`,
    reportedFacts: question.split(/\n+/).map((line) => line.trim()).filter(Boolean),
    establishedFacts: "Aucun fait n’est établi par JUSTICE IA : votre récit n’a pas été confronté à des pièces ou vérifié de manière indépendante.",
    ...guide,
    limits: "Démonstration à règles prédéfinies, sans IA générative ni recherche en direct. Les liens sont des points de départ officiels, pas des preuves de l’analyse. Aucune version de texte, jurisprudence ou échéance n’a été vérifiée. Cette orientation ne remplace pas un avocat.",
    sourceIds: domain.sourceIds, engine: "demo",
  };
}

export function searchResources(query: string, domainId?: string) {
  const q = normalize(query.trim());
  const domain = domains.find((d) => d.id === domainId);
  return sources.filter((source) => (!domain || domain.sourceIds.includes(source.id)) && (!q || normalize(`${source.name} ${source.description} ${source.kind} ${source.publisher}`).includes(q) || domains.some((d) => normalize(`${d.name} ${d.keywords.join(" ")}`).includes(q) && d.sourceIds.includes(source.id))));
}
