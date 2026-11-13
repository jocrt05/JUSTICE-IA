"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowDownToLine, ArrowRight, ArrowUp, ArrowUpRight, Bird, BookMarked, BookOpen, Bookmark, BriefcaseBusiness, Building2, Car, Check, CheckCheck, ChevronRight, CircleHelp, Copy, Cctv, FileSearch, FileText, Fingerprint, Folder, FolderOpen, Gavel, Globe, GraduationCap, HandHeart, HeartPulse, History, House, Landmark, Laptop, LayoutDashboard, LibraryBig, ListChecks, LoaderCircle, LockKeyhole, Menu, MessageSquare, Plus, Printer, Receipt, Scale, Search, Settings2, ShieldCheck, ShoppingBag, Sparkles, Trash2, Umbrella, Users, X, type LucideIcon } from "lucide-react";
import { domains, sources, searchResources, type Analysis, type Domain, type Mode, type Source } from "@/lib/legal";
import { STORAGE_KEY, emptyWorkspace, workspaceSchema, type Workspace } from "@/lib/storage";

type View = "dashboard" | "assistant" | "procedure" | "fiches" | "search" | "domains" | "library" | "folders" | "history" | "favorites" | "settings";
const nav: { label: string; id: View; icon: LucideIcon }[] = [
  { label: "Tableau de bord", id: "dashboard", icon: LayoutDashboard },
  { label: "Assistant juridique", id: "assistant", icon: MessageSquare },
  { label: "Analyser une procédure", id: "procedure", icon: FileSearch },
  { label: "Fiches juridiques", id: "fiches", icon: FileText },
  { label: "Recherche de lois", id: "search", icon: Search },
  { label: "Domaines juridiques", id: "domains", icon: Scale },
];
const personalNav: typeof nav = [
  { label: "Bibliothèque", id: "library", icon: LibraryBig },
  { label: "Mes dossiers", id: "folders", icon: FolderOpen },
  { label: "Historique", id: "history", icon: History },
  { label: "Favoris", id: "favorites", icon: Bookmark },
];
const icons: Record<string, LucideIcon> = { Scale, BriefcaseBusiness, Users, House, ShieldCheck, ShoppingBag, BookOpen, Landmark, GraduationCap, Car, Gavel, Receipt, HeartPulse, Laptop, Fingerprint, Cctv, Globe, Umbrella, HandHeart, Building2, Bird };
const modeNames: Record<Mode, string> = { citoyen: "Citoyen", avance: "Avancé", professionnel: "Professionnel" };
const examples = ["Mon propriétaire refuse de me rendre ma caution.", "Quels sont mes droits lors d’un contrôle d’identité ?", "Mon employeur souhaite modifier mon contrat de travail."];

function JusticeMark({ small = false }: { small?: boolean }) {
  return <div className={`brand-mark ${small ? "small" : ""}`}><Scale size={small ? 18 : 26} strokeWidth={1.45} /><span className="brand-spark">✦</span></div>;
}

function CourtIllustration() {
  return <svg className="court-art" viewBox="0 0 380 270" fill="none" aria-hidden="true">
    <defs><linearGradient id="pillar" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#eeebe3"/><stop offset=".5" stopColor="#fffefb"/><stop offset="1" stopColor="#d5d3ce"/></linearGradient><linearGradient id="roof" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffdf7"/><stop offset="1" stopColor="#dedbd2"/></linearGradient><linearGradient id="floor" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e3ded2"/><stop offset="1" stopColor="#f5f2e9"/></linearGradient></defs>
    <circle cx="210" cy="125" r="108" fill="#e9e3d5" fillOpacity=".5"/><circle cx="210" cy="125" r="126" stroke="#c5b58d" strokeOpacity=".22" strokeDasharray="3 6"/>
    <path d="M43 244H348M64 254H362" stroke="#b7a985" strokeOpacity=".45"/>
    <path d="M72 229 260 199 336 222 147 256Z" fill="url(#floor)"/><path d="m80 215 184-29 64 22-184 29Z" fill="#e1ddd3"/><path d="M80 215v9l64 23v-10Z" fill="#d1cdc3"/>
    <path d="m99 194 164-27 46 17-163 27Z" fill="url(#roof)"/>
    <path d="M110 102 142 113V203L110 192Z" fill="url(#pillar)"/><path d="m111 109 31 10M117 114v74m7-72v74m7-71v73" stroke="#d0cdc5"/>
    <path d="m159 95 31 11v90l-31-11Z" fill="url(#pillar)"/><path d="m166 110v70m8-67v70m8-67v69" stroke="#d0cdc5"/>
    <path d="m208 87 31 11v90l-31-11Z" fill="url(#pillar)"/><path d="m215 102v70m8-67v70m8-67v69" stroke="#d0cdc5"/>
    <path d="m258 79 31 11v90l-31-11Z" fill="url(#pillar)"/><path d="m265 94v70m8-67v70m8-67v69" stroke="#d0cdc5"/>
    <path d="m103 100 162-26 36 12-162 27Z" fill="#efede6"/><path d="m103 100 36 13v10l-36-12Z" fill="#d2cec4"/><path d="m139 113 162-27v10l-162 27Z" fill="#f8f5ec"/>
    <path d="m88 91 93-61 135 42-177 29Z" fill="url(#roof)"/><path d="m139 101 177-29v11l-177 29Z" fill="#e0d9ca"/><path d="m88 91 51 10v11L88 102Z" fill="#d4cec1"/>
    <path d="m124 86 62-42 91 29Z" stroke="#c9bd9f" strokeWidth="1.5"/>
    <path d="M199 55v22m-12 1h24m-24-16 21-3m-19 4-5 9h11l-6-9Zm19-4-5 10h11l-6-10Z" stroke="#a99059" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M319 114v18m-9-9h18M80 144v10m-5-5h10" stroke="#b59c65" strokeWidth="1.5"/><circle cx="322" cy="177" r="3" fill="#b59c65" fillOpacity=".55"/><circle cx="98" cy="56" r="2" fill="#b59c65"/>
  </svg>;
}

function Empty({ icon: Icon, title, children, action }: { icon: LucideIcon; title: string; children: ReactNode; action?: ReactNode }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={28} strokeWidth={1.4}/></div><h3>{title}</h3><p>{children}</p>{action}</div>;
}

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [workspace, setWorkspace] = useState<Workspace>(emptyWorkspace);
  const [loaded, setLoaded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [factsDate, setFactsDate] = useState("");
  const [domainId, setDomainId] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [searchDomain, setSearchDomain] = useState("");
  const [folderDialog, setFolderDialog] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [infoDialog, setInfoDialog] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = workspaceSchema.safeParse(JSON.parse(raw));
        if (parsed.success) setWorkspace(parsed.data);
        else setToast("Les données locales sont illisibles. Vous pouvez les effacer dans les paramètres.");
      }
    } catch { setToast("Le stockage local est indisponible. Vos données ne seront pas conservées."); }
    setLoaded(true);
    const hash = window.location.hash.slice(1);
    if ([...nav, ...personalNav, { id: "settings" }].some((n) => n.id === hash)) setView(hash as View);
    const onHash = () => {
      const next = window.location.hash.slice(1);
      if ([...nav, ...personalNav, { id: "settings" }].some((n) => n.id === next)) setView(next as View);
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") { event.preventDefault(); searchRef.current?.focus(); }
      if (event.key === "Escape") { setMobileOpen(false); setFolderDialog(false); setInfoDialog(false); }
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("hashchange", onHash); window.removeEventListener("keydown", onKey); };
  }, []);

  useEffect(() => { if (toast) { const timeout = setTimeout(() => setToast(""), 6500); return () => clearTimeout(timeout); } }, [toast]);
  useEffect(() => { if (result && view !== "dashboard") resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [result, view]);

  function persist(next: Workspace) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setWorkspace(next); return true; }
    catch { setToast("Enregistrement impossible : vérifiez l’espace disponible et les autorisations du navigateur."); return false; }
  }
  function go(next: View) { setView(next); setMobileOpen(false); window.location.hash = next; setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function openAssistant(text = "", selectedDomain = "", target: View = "assistant") { setQuestion(text); setDomainId(selectedDomain); setResult(null); setFactsDate(""); go(target); }
  function toggleFavorite(id: string) { persist({ ...workspace, favorites: workspace.favorites.includes(id) ? workspace.favorites.filter((item) => item !== id) : [...workspace.favorites, id] }); }
  function submitSearch(event: FormEvent) { event.preventDefault(); setSearchDomain(""); go("search"); }

  async function ask(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(""); setBusy(true); setResult(null);
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, mode: workspace.mode, factsDate: factsDate || undefined, domainId: domainId || (view === "procedure" ? "police" : undefined) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "La demande n’a pas pu être traitée.");
      setResult(data as Analysis);
      if (view === "dashboard") go("assistant");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Le service est indisponible. Veuillez réessayer."); }
    finally { setBusy(false); }
  }

  function saveReport(analysis: Analysis) {
    if (workspace.reports.some((r) => r.id === analysis.id)) { setToast("Cette orientation est déjà enregistrée dans l’historique."); return; }
    if (persist({ ...workspace, reports: [analysis, ...workspace.reports].slice(0, 100) })) setToast("Orientation enregistrée sur cet appareil. Retrouvez-la dans l’historique.");
  }

  function reportText(analysis: Analysis) {
    return `JUSTICE IA — Fiche d’orientation de démonstration\n${domains.find((d) => d.id === analysis.domainId)?.name}\nCréée le ${new Date(analysis.createdAt).toLocaleString("fr-FR")}\nDate des faits : ${analysis.factsDate || "non renseignée"}\n\n${analysis.question}\n\n${analysis.introduction}\n\nFAITS RAPPORTÉS\n${analysis.reportedFacts.join("\n")}\n\nFAITS ÉTABLIS\n${analysis.establishedFacts}\n\nHYPOTHÈSES À VÉRIFIER\n${analysis.hypotheses.join("\n")}\n\nQUESTIONS COMPLÉMENTAIRES\n${analysis.questions.join("\n")}\n\nDÉMARCHES À ENVISAGER\n${analysis.steps.join("\n")}\n\nRESSOURCES OFFICIELLES À CONSULTER\n${sources.filter((s) => analysis.sourceIds.includes(s.id)).map((s) => `${s.name} : ${s.url}`).join("\n")}\n\nLIMITES\n${analysis.limits}`;
  }
  function download(analysis: Analysis) {
    const url = URL.createObjectURL(new Blob([reportText(analysis)], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `justice-ia-orientation-${analysis.id.slice(0, 8)}.txt`; a.click(); URL.revokeObjectURL(url);
  }
  async function copyReport(analysis: Analysis) {
    try { await navigator.clipboard.writeText(reportText(analysis)); setToast("Fiche copiée. Vérifiez les informations personnelles avant de la partager."); }
    catch { setToast("La copie n’est pas autorisée. Utilisez le téléchargement texte."); }
  }

  function domainCard(domain: Domain) {
    const Icon = icons[domain.icon] || Scale;
    return <button className="domain-card" key={domain.id} onClick={() => { setSearch(""); setSearchDomain(domain.id); go("search"); }}><span className={`icon-tile ${domain.color}`}><Icon size={22} strokeWidth={1.6}/></span><span><strong>{domain.name}</strong><small>{domain.description}</small></span><ChevronRight size={17}/></button>;
  }
  function sourceCard(source: Source) {
    return <article className="source-card" key={source.id}><div className="source-card-top"><span className="source-label"><span className="tricolor"/>{source.kind}</span><button className={`icon-button favorite ${workspace.favorites.includes(source.id) ? "selected" : ""}`} title={workspace.favorites.includes(source.id) ? "Retirer des favoris" : "Ajouter aux favoris"} aria-label={`${workspace.favorites.includes(source.id) ? "Retirer" : "Ajouter"} ${source.name} ${workspace.favorites.includes(source.id) ? "des" : "aux"} favoris`} onClick={() => toggleFavorite(source.id)}><Bookmark size={17} fill={workspace.favorites.includes(source.id) ? "currentColor" : "none"}/></button></div><h3><a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}<ArrowUpRight size={17}/></a></h3><p>{source.description}</p><div className="source-bottom"><ShieldCheck size={13}/><span>Site officiel · lien externe</span></div></article>;
  }
  function heading(eyebrow: string, title: string, description: string, action?: ReactNode) {
    return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
  }
  function composer(compact = false) {
    return <form className={`composer ${compact ? "compact" : ""}`} onSubmit={ask}>
      <label htmlFor="situation" className="sr-only">Décrivez votre situation</label>
      <textarea id="situation" placeholder={view === "procedure" ? "Racontez l’intervention dans l’ordre : premier contact, mesure annoncée, droits notifiés, demandes et fin de la procédure…" : view === "fiches" ? "Quel sujet souhaitez-vous explorer ? Par exemple : les droits lors d’un contrôle d’identité…" : "Décrivez votre situation ou posez votre question juridique…"} value={question} onChange={(e) => setQuestion(e.target.value)} minLength={15} maxLength={6000} required rows={compact ? 3 : 5}/>
      {!compact && <div className="composer-options"><label>Date des faits <span>(facultatif)</span><input type="date" value={factsDate} max={new Date().toLocaleDateString("en-CA")} onChange={(e) => setFactsDate(e.target.value)}/></label><label>Domaine juridique<select value={domainId || (view === "procedure" ? "police" : "")} onChange={(e) => setDomainId(e.target.value)}><option value="">Suggestion automatique</option>{domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label></div>}
      <div className="composer-bottom"><span className="composer-hint"><LockKeyhole size={13}/>{compact ? "Évitez les données personnelles" : `${question.length.toLocaleString("fr-FR")} / 6 000 caractères`}</span><button className="primary-button" type="submit" disabled={busy || !loaded}>{busy ? <LoaderCircle size={16} className="spin"/> : <Sparkles size={16}/>}<span>{busy ? "Préparation…" : compact ? "Éclairer ma situation" : view === "fiches" ? "Préparer ma fiche" : "Obtenir une orientation"}</span><ArrowRight size={16}/></button></div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>;
  }

  function analysisView(analysis: Analysis) {
    const domain = domains.find((d) => d.id === analysis.domainId);
    return <section className="analysis-result panel" ref={resultRef} aria-label="Résultat de l’orientation" aria-live="polite">
      <div className="result-top"><span className="eyebrow"><Sparkles size={14}/> VOTRE ORIENTATION</span><span className="demo-tag">Démonstration · {modeNames[analysis.mode]}</span></div>
      <h2>{view === "fiches" ? "Votre fiche d’orientation" : "Faisons le point sur votre situation."}</h2><div className="result-meta"><span>{domain?.name}</span><span>Faits : {analysis.factsDate ? new Date(`${analysis.factsDate}T12:00:00`).toLocaleDateString("fr-FR") : "date non renseignée"}</span></div>
      <p className="result-intro">{analysis.introduction}</p>
      <div className="result-grid"><div><h3><span className="step-number">01</span>Les faits rapportés</h3>{analysis.reportedFacts.map((f, i) => <blockquote key={i}>{f}</blockquote>)}</div><div><h3><span className="step-number">02</span>Les faits établis</h3><p>{analysis.establishedFacts}</p></div></div>
      <div className="result-section"><h3><span className="step-number">03</span>Les hypothèses à vérifier</h3><ul>{analysis.hypotheses.map((h) => <li key={h}>{h}</li>)}</ul></div>
      <div className="follow-up"><h3><MessageSquare size={18}/> Pour mieux comprendre votre situation</h3><p>Complétez votre récit avec ces précisions, puis relancez l’orientation.</p><ol>{analysis.questions.map((q) => <li key={q}>{q}</li>)}</ol><button className="text-button" onClick={() => { setQuestion(`${analysis.question}\n\nPrécisions :\n${analysis.questions.map((q) => `${q}\nRéponse : `).join("\n\n")}`.slice(0,6000)); document.getElementById("situation")?.focus(); document.getElementById("situation")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>Compléter mon récit <ArrowUp size={14}/></button></div>
      <div className="result-section"><h3><span className="step-number">04</span>Les prochaines étapes possibles</h3><ol className="steps-list">{analysis.steps.map((s) => <li key={s}>{s}</li>)}</ol></div>
      {analysis.mode !== "citoyen" && <div className="trace-panel"><h3>Traçabilité de cette orientation</h3><dl><div><dt>Méthode</dt><dd>Guide thématique prédéfini, sans recherche en direct</dd></div><div><dt>Version du droit applicable</dt><dd>Non vérifiée — contrôle requis à la date des faits</dd></div><div><dt>Articles et jurisprudence</dt><dd>Aucune référence individuelle validée</dd></div><div><dt>Création de la fiche</dt><dd>{new Date(analysis.createdAt).toLocaleString("fr-FR")}</dd></div></dl></div>}
      {analysis.mode === "professionnel" && <div className="result-section"><h3>Grille de préparation documentaire</h3><div className="review-table"><div><strong>Pièces</strong><span>Originaux et échanges à réunir</span></div><div><strong>Chronologie</strong><span>Dates, acteurs et démarches à confirmer</span></div><div><strong>Qualification</strong><span>À déterminer par un professionnel</span></div><div><strong>Délais et recours</strong><span>Non calculés, vérification indispensable</span></div></div></div>}
      <div className="result-section"><h3><BookOpen size={19}/> Ressources officielles à consulter</h3><p>Ces liens orientent votre recherche. Leur contenu n’a pas été consulté par l’assistant.</p><div className="source-links">{sources.filter((s) => analysis.sourceIds.includes(s.id)).map((s) => <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer">{s.name}<ArrowUpRight size={15}/></a>)}</div></div>
      <div className="legal-notice"><CircleHelp size={18}/><p>{analysis.limits}</p></div>
      <div className="result-actions no-print"><button className="primary-button" onClick={() => saveReport(analysis)}>{workspace.reports.some((r) => r.id === analysis.id) ? <Check size={15}/> : <Bookmark size={15}/>}Enregistrer</button><button className="secondary-button" onClick={() => window.print()}><Printer size={15}/>Imprimer / PDF</button><button className="secondary-button" onClick={() => download(analysis)}><ArrowDownToLine size={15}/>Texte</button><button className="icon-button" title="Copier la fiche" aria-label="Copier la fiche" onClick={() => copyReport(analysis)}><Copy size={17}/></button></div>
    </section>;
  }

  const filteredSources = searchResources(search, searchDomain || undefined);
  const selectedDomain = domains.find((d) => d.id === searchDomain);
  const currentFolder = workspace.folders.find((f) => f.id === activeFolder);
  const pageName = [...nav, ...personalNav, { label: "Paramètres", id: "settings" }].find((n) => n.id === view)?.label;

  return <div className="app-shell">
    <a className="skip-link" href="#main">Aller au contenu</a>
    {mobileOpen && <button className="sidebar-overlay" aria-label="Fermer la navigation" onClick={() => setMobileOpen(false)}/>}
    <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Navigation principale">
      <a href="#dashboard" className="brand" onClick={() => go("dashboard")}><JusticeMark/><div><span>JUSTICE <b>IA</b></span><small>LE DROIT ACCESSIBLE À TOUS</small></div></a>
      <div className="sidebar-rule"/>
      <div className="nav-caption">VOTRE ESPACE JURIDIQUE</div>
      <nav>{nav.map(({ label, id, icon: Icon }) => <a key={id} href={`#${id}`} className={`nav-item ${view === id ? "active" : ""}`} aria-current={view === id ? "page" : undefined} onClick={(e) => { e.preventDefault(); go(id); }}><Icon size={18} strokeWidth={1.6}/><span>{label}</span>{id === "assistant" && <span className="nav-badge" aria-hidden="true">IA</span>}</a>)}</nav>
      <div className="nav-caption personal-caption">MON ESPACE PERSONNEL</div>
      <nav>{personalNav.map(({ label, id, icon: Icon }) => <a key={id} href={`#${id}`} className={`nav-item ${view === id ? "active" : ""}`} aria-current={view === id ? "page" : undefined} onClick={(e) => { e.preventDefault(); go(id); }}><Icon size={18} strokeWidth={1.6}/><span>{label}</span>{id === "favorites" && workspace.favorites.length > 0 && <span className="nav-count" aria-hidden="true">{workspace.favorites.length}</span>}</a>)}</nav>
      <div className="sidebar-bottom"><div className="trust-card"><ShieldCheck size={20}/><h3>Vos droits, en toute clarté.</h3><p>Des pistes pour comprendre.<br/>Des sources pour approfondir.</p><button onClick={() => setInfoDialog(true)}>Notre approche <ArrowUpRight size={13}/></button></div><a href="#settings" className={`nav-item ${view === "settings" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); go("settings"); }}><Settings2 size={18}/><span>Paramètres</span></a><div className="profile"><span className="avatar">J</span><div><strong>Espace découverte</strong><small>Données sur cet appareil</small></div><span className="profile-dot"/></div></div>
    </aside>

    <div className="main-shell"><header className="topbar"><div className="breadcrumb"><button className="icon-button mobile-toggle" aria-label="Ouvrir la navigation" onClick={() => setMobileOpen(true)}><Menu size={22}/></button><span>Mon espace</span><ChevronRight size={13}/><strong>{pageName}</strong></div><div className="header-right"><form className="header-search" onSubmit={submitSearch}><Search size={15}/><input ref={searchRef} aria-label="Rechercher une ressource juridique" placeholder="Rechercher une ressource…" value={search} onChange={(e) => setSearch(e.target.value)}/><kbd>⌘ K</kbd></form><button className="help-button icon-button" title="À propos de JUSTICE IA" aria-label="À propos de JUSTICE IA" onClick={() => setInfoDialog(true)}><CircleHelp size={19}/></button><button className="header-avatar" aria-label="Ouvrir les paramètres de mon espace" onClick={() => go("settings")}>J</button></div></header>
      <main id="main" className="main-content">
        {view === "dashboard" ? <>
          <div className="dashboard-heading"><div><div className="eyebrow">VOTRE DROIT D’Y VOIR PLUS CLAIR</div><h1>Bienvenue dans votre espace juridique<span className="gold-dot">.</span></h1><p>Un point de départ simple pour comprendre vos droits et avancer.</p></div><span className="date-label"><span className="status-dot"/>Espace de démonstration</span></div>
          <section className="hero"><div className="hero-copy"><span className="hero-eyebrow"><span/> LE DROIT, À VOTRE PORTÉE</span><h2>Comprendre vos droits.<br/><em>Avancer en confiance.</em></h2><p>Une situation, une question, un doute ?<br/>Faites le premier pas avec votre assistant juridique.</p><button className="hero-button" onClick={() => openAssistant()}><MessageSquare size={17}/>Parler à l’assistant<ArrowUpRight size={16}/></button></div><CourtIllustration/><div className="hero-footnote"><ShieldCheck size={13}/>Pensé pour le droit français</div></section>
          <section className="quick-grid" aria-label="Accès rapides"><button className="quick-card" onClick={() => openAssistant("", "police", "procedure")}><span className="quick-icon"><FileSearch size={23} strokeWidth={1.5}/></span><div><h3>Analyser une procédure</h3><p>Faites le point sur une intervention.</p></div><ArrowUpRight size={17}/></button><button className="quick-card" onClick={() => openAssistant("", "", "fiches")}><span className="quick-icon"><FileText size={23} strokeWidth={1.5}/></span><div><h3>Créer une fiche juridique</h3><p>Organisez les points essentiels.</p></div><ArrowUpRight size={17}/></button><button className="quick-card" onClick={() => { setSearch(""); setSearchDomain(""); go("search"); }}><span className="quick-icon"><BookOpen size={23} strokeWidth={1.5}/></span><div><h3>Explorer les textes de loi</h3><p>Retrouvez les sources officielles.</p></div><ArrowUpRight size={17}/></button></section>
          <div className="dashboard-middle"><section className="assistant-panel panel"><div className="section-heading"><div className="title-with-icon"><span className="spark-icon"><Sparkles size={18}/></span><h2>Comment pouvons-nous vous aider ?</h2></div><span className="subtle-badge">Assistant juridique</span></div><p className="section-description">Décrivez votre situation avec vos mots. Commençons à y voir plus clair.</p>{composer(true)}<div className="suggestions-label">BESOIN D’INSPIRATION ?</div><div className="example-chips">{examples.slice(0, 2).map((text) => <button key={text} onClick={() => openAssistant(text)}>{text}<ArrowUpRight size={12}/></button>)}</div><div className="demo-line"><span className="status-dot"/>Mode démonstration · orientations prédéfinies, sans IA connectée.</div></section><aside className="guidance-card"><div className="guidance-overline"><span className="mini-line"/> À VOS CÔTÉS</div><h2>Le bon repère,<br/>au bon moment.</h2><div className="guidance-step"><span>01</span><div><h3>Racontez simplement</h3><p>Pas besoin de connaître le jargon juridique.</p></div></div><div className="guidance-step"><span>02</span><div><h3>Identifiez les bonnes questions</h3><p>Structurez les faits et les points à vérifier.</p></div></div><div className="guidance-step"><span>03</span><div><h3>Avancez avec des repères</h3><p>Explorez les ressources officielles adaptées.</p></div></div><div className="guidance-note"><Scale size={16}/><p>Un outil d’information.<br/>Un avocat reste votre interlocuteur.</p></div></aside></div>
          <section className="domain-section"><div className="section-heading"><div><h2>Explorez les domaines juridiques</h2><p>À chaque situation, son point de départ.</p></div><button className="text-button" onClick={() => go("domains")}>Tous les domaines <ArrowRight size={15}/></button></div><div className="domain-grid">{domains.slice(0, 6).map(domainCard)}</div></section>
          <section className="resource-section"><div className="section-heading"><div><h2>Des ressources pour vous éclairer</h2><p>Les institutions de référence, à portée de clic.</p></div><button className="text-button" onClick={() => go("library")}>Voir la bibliothèque <ArrowRight size={15}/></button></div><div className="source-grid">{sources.slice(0,3).map(sourceCard)}</div></section>
        </> : null}

        {(["assistant", "procedure", "fiches"] as View[]).includes(view) && <>
          {heading(view === "procedure" ? "COMPRENDRE LES ÉTAPES" : view === "fiches" ? "VOTRE DOCUMENT DE TRAVAIL" : "VOTRE POINT DE DÉPART", view === "procedure" ? "Analyser une procédure" : view === "fiches" ? "Créer une fiche juridique" : "Parlons de votre situation.", view === "procedure" ? "Reconstituez les faits, les droits notifiés et les questions à examiner avec un avocat." : view === "fiches" ? "Préparez une fiche d’orientation modifiable, enregistrable et imprimable." : "Exprimez-vous simplement. Nous vous aidons à organiser les bonnes questions.", <span className="demo-tag"><span className="status-dot"/>Mode démonstration</span>)}
          <div className="assistant-layout"><div><section className="panel assistant-workspace"><div className="section-heading"><div className="title-with-icon"><JusticeMark small/><h2>{view === "fiches" ? "Quel sujet souhaitez-vous explorer ?" : "Décrivez votre situation"}</h2></div></div><div className="mode-tabs" aria-label="Niveau de lecture">{(["citoyen", "avance", "professionnel"] as Mode[]).map((m) => <button key={m} aria-pressed={workspace.mode === m} onClick={() => persist({ ...workspace, mode: m })} className={workspace.mode === m ? "active" : ""}>{modeNames[m]}</button>)}</div><p className="mode-caption">{workspace.mode === "citoyen" ? "Une lecture simple pour organiser les faits et les démarches." : workspace.mode === "avance" ? "La même orientation, avec les limites et la traçabilité détaillées." : "La même orientation, avec une grille de préparation documentaire."}</p>{composer()}<div className="attachment-row"><button className="text-button" onClick={() => uploadRef.current?.click()}><Plus size={15}/>Joindre un texte (.txt)</button><span>20 Ko maximum · lecture locale</span><input type="file" accept=".txt,text/plain" ref={uploadRef} hidden onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { if (!file.name.toLowerCase().endsWith(".txt") || file.size > 20000) { setError("Choisissez un fichier .txt de 20 Ko maximum. PDF et Word ne sont pas encore pris en charge."); return; } const text = await file.text(); if (text.length > 6000) { setError("Ce texte dépasse la limite de 6 000 caractères. Réduisez-le avant de l’importer."); return; } setQuestion(text); setError(""); setToast("Texte chargé localement. Retirez les données personnelles avant de lancer l’orientation."); } catch { setError("Impossible de lire le fichier sélectionné."); } finally { e.target.value = ""; } }}/></div><div className="privacy-hint"><LockKeyhole size={14}/><p>Retirez noms, adresses et données sensibles, notamment celles des mineurs. Le récit est envoyé à ce serveur uniquement quand vous lancez l’orientation. Il n’est pas enregistré automatiquement.</p></div></section>{result && analysisView(result)}</div><aside className="assistant-aside"><section className="panel aside-tips"><span className="icon-tile gold"><ListChecks size={22}/></span><h3>Un récit utile commence par…</h3><ul><li>La date et le lieu des faits</li><li>Le rôle des personnes concernées</li><li>Les événements dans l’ordre</li><li>Les documents reçus</li><li>Votre question principale</li></ul></section><section className="aside-note"><ShieldCheck size={22}/><h3>Une orientation, pas une décision.</h3><p>Cette version utilise des guides prédéfinis. Elle ne vérifie ni les textes en vigueur, ni les délais, ni les jurisprudences.</p><button className="text-button" onClick={() => setInfoDialog(true)}>Comprendre les limites <ArrowUpRight size={14}/></button></section>{!result && <div className="aside-examples"><h3>Essayez un exemple</h3>{(view === "procedure" ? [examples[1], "J’ai demandé un avocat au commissariat et je souhaite comprendre les étapes de la procédure."] : examples).map((text) => <button key={text} onClick={() => { setQuestion(text); document.getElementById("situation")?.focus(); }}>{text}<ArrowUpRight size={14}/></button>)}</div>}</aside></div>
        </>}

        {view === "domains" && <>{heading("EXPLORER ET COMPRENDRE", "À chaque situation, son domaine.", "23 espaces pour retrouver les institutions et les ressources adaptées à votre recherche.")}<div className="domain-grid all-domains">{domains.map(domainCard)}</div><section className="bottom-callout"><Sparkles size={24}/><div><h3>Vous ne savez pas par où commencer ?</h3><p>Racontez votre situation, l’assistant suggérera un domaine à explorer.</p></div><button className="primary-button" onClick={() => openAssistant()}>Poser ma question<ArrowRight size={15}/></button></section></>}

        {view === "search" && <>{heading("LES BONS POINTS DE DÉPART", selectedDomain ? selectedDomain.name : "Rechercher une ressource juridique", "Explorez notre annuaire de sources officielles. La recherche porte sur cet annuaire, pas sur le contenu intégral des lois.")}<section className="search-panel panel"><form className="resource-search" onSubmit={(e) => e.preventDefault()}><Search size={22}/><input aria-label="Filtrer les ressources" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Un domaine, une institution, une démarche…"/><button type="button" className="icon-button" aria-label="Effacer la recherche" onClick={() => setSearch("")}><X size={18}/></button></form><div className="filter-row"><label>Domaine <select aria-label="Filtrer par domaine" value={searchDomain} onChange={(e) => setSearchDomain(e.target.value)}><option value="">Tous les domaines</option>{domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label><span>{filteredSources.length} ressource{filteredSources.length > 1 ? "s" : ""}</span></div></section>{filteredSources.length ? <div className="source-grid search-results">{filteredSources.map(sourceCard)}</div> : <Empty icon={Search} title="Aucune ressource trouvée">Essayez un terme plus général ou choisissez un autre domaine.</Empty>}<div className="legal-notice"><CircleHelp size={18}/><p>Les versions des textes et leurs dates doivent être vérifiées sur les sites officiels. L’intégration des API juridiques et la recherche en texte intégral sont prévues dans une prochaine étape.</p></div>{selectedDomain && <section className="bottom-callout"><MessageSquare size={24}/><div><h3>Une question en {selectedDomain.name.toLocaleLowerCase("fr-FR")} ?</h3><p>Préparez votre recherche avec une grille d’orientation.</p></div><button className="primary-button" onClick={() => openAssistant("", selectedDomain.id)}>Ouvrir l’assistant<ArrowRight size={15}/></button></section>}</>}

        {view === "library" && <>{heading("VOTRE BIBLIOTHÈQUE JURIDIQUE", "Le droit à la source.", "Huit institutions de référence pour approfondir vos recherches et vérifier les informations.")}<div className="library-banner"><Landmark size={28} strokeWidth={1.4}/><div><h3>Une bonne recherche commence par une source officielle.</h3><p>Consultez toujours la version applicable à la date des faits. Aucun texte n’est synchronisé dans cette démonstration.</p></div></div><div className="source-grid">{sources.map(sourceCard)}</div><div className="section-heading saved-heading"><div><h2>Mes fiches enregistrées</h2><p>Vos orientations conservées sur cet appareil.</p></div><button className="text-button" onClick={() => go("history")}>Ouvrir l’historique<ArrowRight size={15}/></button></div>{workspace.reports.length ? <div className="report-list">{workspace.reports.slice(0,3).map((r) => <button key={r.id} className="report-item" onClick={() => { setResult(r); setQuestion(r.question); go("fiches"); }}><span className="icon-tile blue"><FileText size={20}/></span><div><strong>{r.question}</strong><small>{new Date(r.createdAt).toLocaleDateString("fr-FR")} · Fiche de démonstration</small></div><ChevronRight size={18}/></button>)}</div> : <Empty icon={BookMarked} title="Votre bibliothèque personnelle commence ici">Enregistrez une orientation depuis l’assistant pour la retrouver ici.</Empty>}</>}

        {view === "favorites" && <>{heading("GARDER VOS REPÈRES", "Vos ressources favorites.", "Retrouvez rapidement les sources que vous avez mises de côté.")}{workspace.favorites.length ? <div className="source-grid">{sources.filter((s) => workspace.favorites.includes(s.id)).map(sourceCard)}</div> : <Empty icon={Bookmark} title="Vos références, à portée de main" action={<button className="primary-button" onClick={() => go("library")}>Explorer la bibliothèque<ArrowRight size={15}/></button>}>Cliquez sur le signet d’une ressource pour l’ajouter à vos favoris.</Empty>}</>}

        {view === "history" && <>{heading("REPRENDRE LE FIL", "Votre historique d’orientations.", "Seules les fiches que vous choisissez d’enregistrer apparaissent ici. Elles restent sur cet appareil.")}{workspace.reports.length ? <div className="report-list">{workspace.reports.map((r) => <article className="report-row" key={r.id}><button className="report-item" onClick={() => { setResult(r); setQuestion(r.question); setFactsDate(r.factsDate || ""); setDomainId(r.domainId); go("assistant"); }}><span className="icon-tile gold"><FileText size={21}/></span><div><strong>{r.question}</strong><small>{domains.find((d) => d.id === r.domainId)?.name} · {new Date(r.createdAt).toLocaleDateString("fr-FR")} · Démonstration</small></div><ChevronRight size={17}/></button><button className="icon-button danger" aria-label="Supprimer cette orientation" onClick={() => { if (window.confirm("Supprimer cette orientation de cet appareil ?")) { persist({ ...workspace, reports: workspace.reports.filter((item) => item.id !== r.id) }); if (result?.id === r.id) setResult(null); } }}><Trash2 size={17}/></button></article>)}</div> : <Empty icon={History} title="Une page encore à écrire" action={<button className="primary-button" onClick={() => openAssistant()}>Commencer une orientation<ArrowRight size={15}/></button>}>Vos orientations ne sont jamais enregistrées automatiquement. Vous gardez la main.</Empty>}</>}

        {view === "folders" && <>{heading("ORGANISER VOS DÉMARCHES", "Mes dossiers.", "Un espace local pour organiser vos notes. N’y stockez pas de données sensibles.", <button className="primary-button" onClick={() => { setFolderName(""); setFolderDialog(true); }}><Plus size={17}/>Nouveau dossier</button>)}{currentFolder ? <section className="panel folder-editor"><button className="text-button" onClick={() => { setActiveFolder(null); setNotes(""); }}>← Tous les dossiers</button><div className="section-heading"><h2>{currentFolder.name}</h2><span className="subtle-badge">Sur cet appareil</span></div><label htmlFor="folder-notes">Notes et chronologie</label><textarea id="folder-notes" rows={12} maxLength={12000} placeholder="Dates importantes, étapes, questions à poser…" value={notes} onChange={(e) => setNotes(e.target.value)}/><div className="folder-editor-bottom"><span>{notes.length} / 12 000 caractères</span><button className="primary-button" onClick={() => { if (persist({ ...workspace, folders: workspace.folders.map((f) => f.id === activeFolder ? { ...f, notes } : f) })) setToast("Notes enregistrées sur cet appareil."); }}><Check size={16}/>Enregistrer les notes</button></div></section> : workspace.folders.length ? <div className="folders-grid">{workspace.folders.map((f) => <article className="folder-card panel" key={f.id}><div className="section-heading"><span className="folder-illustration"><Folder size={34} strokeWidth={1.25}/></span><button className="icon-button danger" aria-label={`Supprimer le dossier ${f.name}`} onClick={() => { if (window.confirm(`Supprimer le dossier « ${f.name} » et ses notes ?`)) persist({ ...workspace, folders: workspace.folders.filter((item) => item.id !== f.id) }); }}><Trash2 size={16}/></button></div><button className="folder-open" onClick={() => { setActiveFolder(f.id); setNotes(f.notes); }}><h3>{f.name}</h3><p>{f.notes || "Ajoutez vos notes et les étapes de vos démarches."}</p><span>Créé le {new Date(f.createdAt).toLocaleDateString("fr-FR")}<ArrowUpRight size={16}/></span></button></article>)}</div> : <Empty icon={FolderOpen} title="Faites de la place pour vos démarches" action={<button className="primary-button" onClick={() => { setFolderName(""); setFolderDialog(true); }}><Plus size={16}/>Créer mon premier dossier</button>}>Créez un dossier, rassemblez vos notes et retrouvez votre chronologie au même endroit.</Empty>}</>}

        {view === "settings" && <>{heading("VOTRE ESPACE, VOS CHOIX", "Paramètres & confidentialité.", "Personnalisez votre lecture et gardez le contrôle sur vos données.")}<section className="panel settings-panel"><h2>Votre niveau de lecture</h2><p>Le mode change la présentation du guide, pas la capacité juridique de cette démonstration.</p><div className="settings-modes">{(["citoyen", "avance", "professionnel"] as Mode[]).map((m) => <button key={m} onClick={() => persist({ ...workspace, mode: m })} className={workspace.mode === m ? "selected" : ""}><span>{m === "citoyen" ? <Users size={21}/> : m === "avance" ? <BookOpen size={21}/> : <BriefcaseBusiness size={21}/>}<strong>{modeNames[m]}</strong>{workspace.mode === m && <Check size={18}/>}</span><p>{m === "citoyen" ? "Faits, questions et démarches en langage simple." : m === "avance" ? "Avec les informations de méthode et de traçabilité." : "Avec une grille de préparation documentaire."}</p></button>)}</div></section><section className="panel settings-panel"><div className="title-with-icon"><LockKeyhole size={20}/><h2>Vos données restent entre vos mains</h2></div><p>Cette version n’a ni compte utilisateur, ni base de données serveur. Favoris, dossiers et fiches enregistrées sont conservés dans le stockage de ce navigateur. Ce stockage n’est pas chiffré et ne convient pas aux données sensibles ou à un appareil partagé.</p><div className="data-counts"><div><strong>{workspace.folders.length}</strong><span>dossier{workspace.folders.length > 1 ? "s" : ""}</span></div><div><strong>{workspace.reports.length}</strong><span>fiche{workspace.reports.length > 1 ? "s" : ""}</span></div><div><strong>{workspace.favorites.length}</strong><span>favori{workspace.favorites.length > 1 ? "s" : ""}</span></div></div><p>L’assistant reçoit votre récit pour produire un guide, sans conservation applicative sur le serveur et sans appel à un fournisseur IA. L’hébergeur peut conserver des journaux techniques ; n’envoyez pas de données confidentielles.</p><button className="danger-button" onClick={() => { if (window.confirm("Effacer tous vos dossiers, notes, fiches et favoris de cet appareil ? Cette action est irréversible.")) { try { localStorage.removeItem(STORAGE_KEY); setWorkspace(emptyWorkspace()); setResult(null); setQuestion(""); setActiveFolder(null); setNotes(""); setToast("Toutes les données de cet espace ont été effacées de ce navigateur."); } catch { setToast("Suppression impossible : le stockage du navigateur est inaccessible."); } } }}><Trash2 size={16}/>Effacer mes données locales</button></section><section className="panel settings-panel"><h2>À propos de cette première version</h2><p>JUSTICE IA v0.1 · Démonstration fonctionnelle. Les connexions aux API juridiques, l’IA générative, les comptes sécurisés et l’analyse de PDF restent à développer. Les modes de lecture ne constituent pas une validation professionnelle.</p><button className="text-button" onClick={() => setInfoDialog(true)}>Notre approche de la fiabilité<ArrowUpRight size={15}/></button></section></>}

        <footer className="app-footer"><div><Scale size={15}/><span>JUSTICE IA <span className="footer-separator">/</span> Le droit accessible à tous.</span></div><p>Un outil d’information juridique qui ne remplace pas un avocat.</p><button onClick={() => go("settings")}>Confidentialité<ArrowUpRight size={12}/></button></footer>
      </main>
    </div>
    {toast && <div className="toast" role="status"><CheckCheck size={18}/><span>{toast}</span><button className="icon-button" aria-label="Fermer la notification" onClick={() => setToast("")}><X size={16}/></button></div>}
    {folderDialog && <Modal title="Nouveau dossier" onClose={() => setFolderDialog(false)}><p>Choisissez un nom sans information personnelle sensible.</p><form onSubmit={(e) => { e.preventDefault(); if (!folderName.trim()) return; if (workspace.folders.length >= 100) { setToast("La limite de 100 dossiers locaux est atteinte."); return; } if (persist({ ...workspace, folders: [{ id: crypto.randomUUID(), name: folderName.trim(), notes: "", createdAt: new Date().toISOString() }, ...workspace.folders] })) { setFolderDialog(false); setToast("Dossier créé sur cet appareil."); } }}><label htmlFor="folder-name">Nom du dossier</label><input id="folder-name" autoFocus maxLength={120} required value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Ex. : Mes démarches logement"/><button className="primary-button" type="submit"><Plus size={16}/>Créer le dossier</button></form></Modal>}
    {infoDialog && <Modal title="Le droit mérite des repères fiables." onClose={() => setInfoDialog(false)}><div className="modal-icon"><ShieldCheck size={26}/></div><p>JUSTICE IA est un outil d’information et de préparation. Cette première version fonctionne avec des guides thématiques prédéfinis, sans IA générative et sans consultation de textes en direct.</p><ul className="modal-list"><li>Vos déclarations restent des faits rapportés, non vérifiés.</li><li>Les sources proposées sont des sites institutionnels à consulter, pas des citations validées.</li><li>Aucun article, jurisprudence, délai ou version de texte n’est présenté comme vérifié.</li><li>Une irrégularité n’entraîne pas automatiquement une nullité de procédure.</li></ul><p>Pour une décision ou un recours, faites examiner votre situation par un professionnel du droit.</p><button className="primary-button" onClick={() => { setInfoDialog(false); go("library"); }}>Explorer les sources officielles<ArrowRight size={16}/></button></Modal>}
  </div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = dialogRef.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={dialogRef} className="modal" aria-labelledby="modal-title" onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) { const rect = e.currentTarget.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) onClose(); } }}><div className="modal-top"><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Fermer la fenêtre" onClick={onClose}><X size={20}/></button></div>{children}</dialog>;
}
