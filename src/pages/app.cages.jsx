// import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

// import { useMemo, useState, useEffect } from "react";
// import { useCreateCageHistoryEventMutation, useGetCageHistoryQuery, useGetCagesQuery, useGetCouplesQuery, useGetPigeonsQuery, useUpdateCageMutation, } from "@/lib/redux/voliereApi";
// import { cageDisplayId } from "@/lib/api-mappers";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import { Bird, Filter, Home, LayoutGrid, List, User, Users, Trash2, Sparkles, } from "lucide-react";

// function pigeonAgeLabel(birthDate) {
//     if (!birthDate)
//         return "—";
//     const d = new Date(birthDate);
//     if (Number.isNaN(d.getTime()))
//         return "—";
//     const now = new Date();
//     let y = now.getFullYear() - d.getFullYear();
//     const md = now.getMonth() - d.getMonth();
//     if (md < 0 || (md === 0 && now.getDate() < d.getDate()))
//         y--;
//     return y <= 0 ? "< 1 an" : `${y} an${y > 1 ? "s" : ""}`;
// }
// function cageState(c) {
//     if (c.couple)
//         return "couple";
//     if (c.pigeon)
//         return "pigeon";
//     return "libre";
// }
// function formatCageHistoryDate(iso) {
//     const d = new Date(iso);
//     if (Number.isNaN(d.getTime()))
//         return iso;
//     return d.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
// }
// export function CagesPage() {
//     const { data: cages = [], isLoading } = useGetCagesQuery();
//     const [selectedId, setSelectedId] = useState(null);
//     const [voliereName, setVoliereName] = useState("Volière A");
//     const [viewMode, setViewMode] = useState("grid");
//     const [filter, setFilter] = useState("all");
//     const sortedCages = useMemo(() => [...cages].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true })), [cages]);
//     const filteredCages = useMemo(() => {
//         if (filter === "all")
//             return sortedCages;
//         return sortedCages.filter((c) => cageState(c) === filter);
//     }, [sortedCages, filter]);
//     const selected = selectedId != null ? cages.find((c) => c.id === selectedId) : null;
//     if (isLoading) {
//         return (_jsx("div", { className: "flex min-h-[40vh] items-center justify-center text-muted-foreground", children: "Chargement des cages\u2026" }));
//     }
//     return (_jsxs("div", { className: "flex min-h-[calc(100vh-8rem)] flex-col gap-4 md:flex-row md:gap-0", children: [_jsxs("div", { className: "min-w-0 flex-1 space-y-4 pr-0 md:pr-4", children: [_jsxs("header", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-muted", children: _jsx(Home, { className: "h-5 w-5 text-muted-foreground" }) }), _jsx("h1", { className: "font-display text-2xl font-bold tracking-tight md:text-3xl", children: voliereName })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-muted-foreground", children: [_jsxs("span", { className: "inline-flex items-center gap-1.5", children: [_jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-emerald-500" }), "Libre"] }), _jsxs("span", { className: "inline-flex items-center gap-1.5", children: [_jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-red-500" }), "Occup\u00E9e (1 pigeon)"] }), _jsxs("span", { className: "inline-flex items-center gap-1.5", children: [_jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-orange-500" }), "Couple (2 pigeons)"] })] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs(Select, { value: voliereName, onValueChange: setVoliereName, children: [_jsx(SelectTrigger, { className: "h-9 w-[160px] bg-background", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: _jsx(SelectItem, { value: "Voli\u00E8re A", children: "Voli\u00E8re A" }) })] }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", size: "sm", className: "h-9 gap-1.5", children: [_jsx(Filter, { className: "h-4 w-4" }), "Filtrer"] }) }), _jsxs(PopoverContent, { className: "w-52 p-2", align: "end", children: [_jsx("p", { className: "mb-2 text-xs font-medium text-muted-foreground", children: "Affichage" }), _jsx("div", { className: "flex flex-col gap-1", children: [
//                                                             ["all", "Toutes les cages"],
//                                                             ["libre", "Libres uniquement"],
//                                                             ["pigeon", "1 pigeon"],
//                                                             ["couple", "Couples"],
//                                                         ].map(([key, label]) => (_jsx("button", { type: "button", onClick: () => setFilter(key), className: cn("rounded-md px-2 py-1.5 text-left text-sm transition-colors", filter === key ? "bg-primary text-primary-foreground" : "hover:bg-muted"), children: label }, key))) })] })] }), _jsxs("div", { className: "flex rounded-md border border-border bg-muted/40 p-0.5", children: [_jsx("button", { type: "button", onClick: () => setViewMode("grid"), className: cn("rounded px-2 py-1.5 text-muted-foreground transition-colors", viewMode === "grid" && "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-100"), "aria-label": "Vue grille", children: _jsx(LayoutGrid, { className: "h-4 w-4" }) }), _jsx("button", { type: "button", onClick: () => setViewMode("list"), className: cn("rounded px-2 py-1.5 text-muted-foreground transition-colors", viewMode === "list" && "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-100"), "aria-label": "Vue liste", children: _jsx(List, { className: "h-4 w-4" }) })] })] })] }), cages.length === 0 ? (_jsxs("div", { className: "rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground", children: ["Aucune cage en base. Cr\u00E9ez des cages (champ ", _jsx("code", { className: "rounded bg-muted px-1 text-xs", children: "code" }), " ", "ex. A01\u2026A20) via l'API ou l'admin Django."] })) : viewMode === "grid" ? (_jsx("div", { className: "rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6", children: _jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-5", children: filteredCages.map((c) => (_jsx(CageTile, { cage: c, selected: c.id === selectedId, onClick: () => setSelectedId(c.id === selectedId ? null : c.id) }, c.id))) }) })) : (_jsx("div", { className: "overflow-hidden rounded-2xl border border-border bg-card shadow-sm", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "border-b bg-muted/50", children: _jsxs("tr", { className: "text-left", children: [_jsx("th", { className: "px-4 py-3 font-medium", children: "Cage" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Statut" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "D\u00E9tail" })] }) }), _jsx("tbody", { children: filteredCages.map((c) => {
//                                         const st = cageState(c);
//                                         return (_jsxs("tr", { className: cn("cursor-pointer border-b border-border last:border-0 hover:bg-muted/40", c.id === selectedId && "bg-sky-50 dark:bg-sky-950/30"), onClick: () => setSelectedId(c.id), children: [_jsx("td", { className: "px-4 py-3 font-mono font-semibold", children: cageDisplayId(c.code) }), _jsxs("td", { className: "px-4 py-3", children: [st === "libre" && _jsx(Badge, { className: "bg-emerald-100 text-emerald-900 hover:bg-emerald-100", children: "Libre" }), st === "pigeon" && _jsx(Badge, { className: "bg-red-100 text-red-900 hover:bg-red-100", children: "1 pigeon" }), st === "couple" && (_jsx(Badge, { className: "bg-orange-100 text-orange-900 hover:bg-orange-100", children: "Couple" }))] }), _jsx("td", { className: "px-4 py-3 text-muted-foreground", children: _jsx(CageListDetail, { cage: c }) })] }, c.id));
//                                     }) })] }) }))] }), _jsx(Sheet, { open: selectedId != null, onOpenChange: (open) => !open && setSelectedId(null), children: _jsx(SheetContent, { side: "right", className: "w-full overflow-y-auto border-l p-0 sm:max-w-md", children: selected && _jsx(CageDetailPanel, { cage: selected }) }) })] }));
// }
// function CageListDetail({ cage }) {
//     const { data: pigeons = [] } = useGetPigeonsQuery();
//     const { data: couples = [] } = useGetCouplesQuery();
//     const pigeon = cage.pigeon ? pigeons.find((p) => p.id === cage.pigeon) : undefined;
//     const couple = cage.couple ? couples.find((c) => c.id === cage.couple) : undefined;
//     const m = couple ? pigeons.find((p) => p.id === couple.male) : null;
//     const f = couple ? pigeons.find((p) => p.id === couple.female) : null;
//     if (pigeon)
//         return _jsx("span", { children: pigeon.bague });
//     if (couple)
//         return _jsxs("span", { children: [m?.bague, " \u00D7 ", f?.bague] });
//     return _jsx("span", { children: "\u2014" });
// }
// function CageTile({ cage, selected, onClick, }) {
//     const { data: pigeons = [] } = useGetPigeonsQuery();
//     const { data: couples = [] } = useGetCouplesQuery();
//     const pigeon = cage.pigeon ? pigeons.find((p) => p.id === cage.pigeon) : undefined;
//     const couple = cage.couple ? couples.find((c) => c.id === cage.couple) : undefined;
//     const m = couple ? pigeons.find((p) => p.id === couple.male) : null;
//     const f = couple ? pigeons.find((p) => p.id === couple.female) : null;
//     const code = cageDisplayId(cage.code);
//     const st = cageState(cage);
//     const base = "flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 p-2 text-center transition-all";
//     const styles = st === "libre"
//         ? "border-emerald-300 bg-emerald-50 text-emerald-900 hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
//         : st === "pigeon"
//             ? "border-red-300 bg-red-50 text-red-900 hover:border-red-400 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100"
//             : "border-orange-300 bg-orange-50 text-orange-900 hover:border-orange-400 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-100";
//     const icon = st === "libre" ? (_jsx(Bird, { className: "h-7 w-7 stroke-[1.75] text-emerald-700 opacity-90 dark:text-emerald-300" })) : st === "pigeon" ? (_jsx(Bird, { className: "h-8 w-8 fill-current text-red-700 dark:text-red-400" })) : (_jsxs("div", { className: "flex items-center justify-center gap-0.5", children: [_jsx(Bird, { className: "h-6 w-6 fill-current text-orange-700 dark:text-orange-400" }), _jsx(Bird, { className: "h-6 w-6 fill-current text-orange-700 dark:text-orange-400" })] }));
//     const bottomLabel = st === "libre" ? "Libre" : st === "pigeon" ? "1 pigeon" : "2 pigeons";
//     return (_jsxs("button", { type: "button", onClick: onClick, title: `${code} — ${bottomLabel}`, className: cn(base, styles, selected && "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"), children: [_jsx("span", { className: "text-[11px] font-bold uppercase tracking-wide opacity-90", children: code }), icon, _jsx("span", { className: "line-clamp-1 w-full text-[10px] font-medium leading-tight", children: st === "libre" ? bottomLabel : st === "pigeon" ? pigeon?.bague ?? bottomLabel : `${m?.bague ?? "?"} + ${f?.bague ?? "?"}` })] }));
// }
// function PigeonMiniCard({ pigeon }) {
//     return (_jsxs("div", { className: "flex gap-3 rounded-xl border border-border bg-muted/30 p-3", children: [_jsx("div", { className: "h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted", children: _jsx("div", { className: "flex h-full w-full items-center justify-center text-muted-foreground", children: _jsx(Bird, { className: "h-8 w-8 opacity-60" }) }) }), _jsxs("div", { className: "min-w-0 flex-1 space-y-1 text-sm", children: [_jsx(Badge, { variant: "outline", className: cn("text-xs font-normal", pigeon.sex === "M"
//                             ? "border-sky-200 text-sky-700 dark:text-sky-300"
//                             : "border-pink-200 text-pink-700 dark:text-pink-300"), children: pigeon.sex === "M" ? "Mâle" : "Femelle" }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Matricule " }), _jsx("span", { className: "font-mono font-medium", children: pigeon.bague })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Race " }), _jsx("span", { children: pigeon.race })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "\u00C2ge " }), _jsx("span", { children: pigeonAgeLabel(pigeon.birth_date) })] })] })] }));
// }
// function CageDetailPanel({ cage }) {
//     const { data: pigeons = [] } = useGetPigeonsQuery();
//     const { data: couples = [] } = useGetCouplesQuery();
//     const { data: cages = [] } = useGetCagesQuery();
//     const { data: historyItems = [], isLoading: historyLoading } = useGetCageHistoryQuery(cage.id);
//     const [updateCage, { isLoading }] = useUpdateCageMutation();
//     const [logHistoryEvent, { isLoading: logEventLoading }] = useCreateCageHistoryEventMutation();
//     const [assignPanel, setAssignPanel] = useState("none");
//     const [refId, setRefId] = useState("");
//     const [historyOpen, setHistoryOpen] = useState(false);
//     useEffect(() => {
//         setHistoryOpen(false);
//         setAssignPanel("none");
//         setRefId("");
//     }, [cage.id]);
//     const pigeon = cage.pigeon ? pigeons.find((p) => p.id === cage.pigeon) : undefined;
//     const couple = cage.couple ? couples.find((c) => c.id === cage.couple) : undefined;
//     const m = couple ? pigeons.find((p) => p.id === couple.male) : null;
//     const f = couple ? pigeons.find((p) => p.id === couple.female) : null;
//     const isFree = !cage.pigeon && !cage.couple;
//     const st = cageState(cage);
//     const labelId = cageDisplayId(cage.code);
//     const occupiedPigeon = new Set();
//     const occupiedCouple = new Set();
//     cages.forEach((c) => {
//         if (c.id === cage.id)
//             return;
//         if (c.pigeon)
//             occupiedPigeon.add(c.pigeon);
//         if (c.couple)
//             occupiedCouple.add(c.couple);
//     });
//     const availablePigeons = pigeons.filter((p) => p.status === "actif" &&
//         !occupiedPigeon.has(p.id) &&
//         !couples.some((co) => co.active && (co.male === p.id || co.female === p.id)));
//     const availableCouples = couples.filter((c) => c.active && !occupiedCouple.has(c.id));
//     const assign = async () => {
//         if (!refId)
//             return;
//         const idNum = parseInt(refId, 10);
//         if (assignPanel === "pigeon") {
//             await updateCage({ id: cage.id, patch: { pigeon: idNum, couple: null } }).unwrap();
//         }
//         else {
//             await updateCage({ id: cage.id, patch: { couple: idNum, pigeon: null } }).unwrap();
//         }
//         setAssignPanel("none");
//         setRefId("");
//     };
//     const free = async () => {
//         await updateCage({ id: cage.id, patch: { pigeon: null, couple: null } }).unwrap();
//     };
//     const rompreCouple = async () => {
//         await updateCage({ id: cage.id, patch: { couple: null } }).unwrap();
//         setAssignPanel("none");
//         setRefId("");
//     };
//     const retirerPigeon = async () => {
//         await updateCage({ id: cage.id, patch: { pigeon: null } }).unwrap();
//         setAssignPanel("none");
//         setRefId("");
//     };
//     return (_jsxs("div", { className: "flex h-full flex-col", children: [_jsxs(SheetHeader, { className: "border-b px-6 pb-4 pt-2", children: [_jsx("div", { className: "flex items-start justify-between gap-2 pr-8", children: _jsxs(SheetTitle, { className: "font-display text-xl", children: ["Cage ", labelId] }) }), st === "couple" && (_jsxs(Badge, { className: "mt-2 w-fit gap-1 border-orange-200 bg-orange-100 font-normal text-orange-900 hover:bg-orange-100", children: [_jsx(Users, { className: "h-3.5 w-3.5" }), "Occup\u00E9e par un couple"] })), st === "pigeon" && (_jsxs(Badge, { className: "mt-2 w-fit gap-1 border-red-200 bg-red-100 font-normal text-red-900 hover:bg-red-100", children: [_jsx(User, { className: "h-3.5 w-3.5" }), "Occup\u00E9e par un pigeon"] })), st === "libre" && (_jsx(Badge, { className: "mt-2 w-fit gap-1 border-emerald-200 bg-emerald-100 font-normal text-emerald-900 hover:bg-emerald-100", children: "Libre" }))] }), _jsxs("div", { className: "flex-1 space-y-6 overflow-y-auto px-6 py-4", children: [(pigeon || couple) && (_jsxs("section", { children: [_jsx("h3", { className: "mb-3 text-sm font-semibold tracking-tight", children: "Pigeons" }), _jsxs("div", { className: "space-y-3", children: [pigeon && _jsx(PigeonMiniCard, { pigeon: pigeon }), couple && m && _jsx(PigeonMiniCard, { pigeon: m }), couple && f && _jsx(PigeonMiniCard, { pigeon: f })] })] })), _jsxs("section", { children: [_jsxs("div", { className: "mb-3 flex flex-wrap items-center justify-between gap-2", children: [_jsx("h3", { className: "text-sm font-semibold tracking-tight", children: "Historique" }), _jsxs("div", { className: "flex flex-wrap gap-1.5", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "h-8 text-xs", type: "button", disabled: logEventLoading, onClick: () => logHistoryEvent({ cageId: cage.id, kind: "cage_cleaned" }), children: [_jsx(Sparkles, { className: "mr-1 h-3 w-3" }), "Nettoyage"] }), _jsx(Button, { variant: "outline", size: "sm", className: "h-8 text-xs", type: "button", disabled: logEventLoading, onClick: () => logHistoryEvent({ cageId: cage.id, kind: "health_check" }), children: "Contr\u00F4le" })] })] }), historyLoading ? (_jsx("p", { className: "text-sm text-muted-foreground", children: "Chargement de l\u2019historique\u2026" })) : historyItems.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground", children: "Aucun \u00E9v\u00E9nement pour l\u2019instant. Les affectations et retraits sont enregistr\u00E9s automatiquement ; utilisez les boutons ci-dessus pour noter un nettoyage ou un contr\u00F4le." })) : (_jsxs(_Fragment, { children: [_jsx("ul", { className: "relative space-y-3 border-l-2 border-muted pl-4", children: (historyOpen ? historyItems : historyItems.slice(0, 4)).map((h) => (_jsxs("li", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-foreground", children: formatCageHistoryDate(h.created_at) }), _jsxs("span", { className: "text-muted-foreground", children: [" : ", h.text] })] }, h.id))) }), historyItems.length > 4 && (_jsx("button", { type: "button", className: "mt-2 text-sm font-medium text-sky-600 hover:underline dark:text-sky-400", onClick: () => setHistoryOpen(!historyOpen), children: historyOpen ? "Réduire l’historique" : "Voir tout l’historique" }))] }))] }), assignPanel !== "none" && (_jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4", children: [_jsx("p", { className: "mb-3 text-sm font-medium", children: assignPanel === "pigeon" ? "Affecter un pigeon" : "Affecter un couple" }), assignPanel === "couple" && (_jsxs(Select, { value: refId, onValueChange: setRefId, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Choisir un couple\u2026" }) }), _jsx(SelectContent, { children: availableCouples.length === 0 ? (_jsx("div", { className: "p-2 text-sm text-muted-foreground", children: "Aucun couple disponible" })) : (availableCouples.map((c) => {
//                                             const cm = pigeons.find((p) => p.id === c.male);
//                                             const cf = pigeons.find((p) => p.id === c.female);
//                                             return (_jsxs(SelectItem, { value: String(c.id), children: ["#", c.id, " (", cm?.bague, " \u00D7 ", cf?.bague, ")"] }, c.id));
//                                         })) })] })), assignPanel === "pigeon" && (_jsxs(Select, { value: refId, onValueChange: setRefId, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Choisir un pigeon\u2026" }) }), _jsx(SelectContent, { children: availablePigeons.length === 0 ? (_jsx("div", { className: "p-2 text-sm text-muted-foreground", children: "Aucun pigeon disponible" })) : (availablePigeons.map((p) => (_jsxs(SelectItem, { value: String(p.id), children: [p.bague, " \u2014 ", p.race] }, p.id)))) })] })), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", type: "button", onClick: () => { setAssignPanel("none"); setRefId(""); }, children: "Annuler" }), _jsx(Button, { size: "sm", type: "button", disabled: !refId || isLoading, onClick: assign, children: "Valider" })] })] })), _jsxs("section", { children: [_jsx("h3", { className: "mb-3 text-sm font-semibold tracking-tight", children: "Actions" }), _jsxs("div", { className: "flex flex-col gap-2", children: [st !== "couple" && (_jsxs(Button, { variant: "outline", className: "h-11 w-full justify-start gap-2 border-sky-300 text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300", type: "button", onClick: () => {
//                                             setAssignPanel("pigeon");
//                                             setRefId("");
//                                         }, children: [_jsx(User, { className: "h-4 w-4" }), st === "pigeon" ? "Changer de pigeon" : "Affecter un pigeon"] })), st === "pigeon" && (_jsxs(Button, { variant: "outline", className: "h-11 w-full justify-start gap-2 border-sky-300 text-sky-800 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-200", type: "button", onClick: retirerPigeon, disabled: isLoading, children: [_jsx(User, { className: "h-4 w-4" }), "Retirer le pigeon"] })), st === "couple" ? (_jsxs(Button, { variant: "outline", className: "h-11 w-full justify-start gap-2 border-orange-300 text-orange-900 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-100", type: "button", onClick: rompreCouple, disabled: isLoading, children: [_jsx(Users, { className: "h-4 w-4" }), "Rompre le couple (retirer de la cage)"] })) : (_jsxs(Button, { variant: "outline", className: "h-11 w-full justify-start gap-2 border-orange-300 text-orange-800 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-200", type: "button", onClick: () => {
//                                             setAssignPanel("couple");
//                                             setRefId("");
//                                         }, children: [_jsx(Users, { className: "h-4 w-4" }), "Affecter un couple"] })), _jsxs(Button, { variant: "outline", className: "h-11 w-full justify-start gap-2 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300", type: "button", onClick: free, disabled: isFree || isLoading, children: [_jsx(Trash2, { className: "h-4 w-4" }), "Lib\u00E9rer la cage"] })] })] })] })] }));
// }

// export default CagesPage;



// import React, { useMemo, useState, useCallback, memo } from "react";

// import {
//   useGetCagesQuery,
//   useGetCouplesQuery,
//   useGetPigeonsQuery,
//   useAddCageMutation,
// } from "@/lib/redux/voliereApi";

// import { cageDisplayId } from "@/lib/api-mappers";

// import { cn } from "@/lib/utils";

// import { Bird, LayoutGrid, List } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   Sheet,
//   SheetContent,
// } from "@/components/ui/sheet";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// /* ---------------- UTILS ---------------- */

// const getCageState = (cage) => {
//   if (cage.couple) return "couple";
//   if (cage.pigeon) return "pigeon";
//   return "libre";
// };

// /* ---------------- PAGE ---------------- */

// export default function CagesPage() {
//   const { data: cages = [], isLoading } = useGetCagesQuery();
//   const { data: pigeons = [] } = useGetPigeonsQuery();
//   const { data: couples = [] } = useGetCouplesQuery();

//   const [addCage] = useAddCageMutation();

//   const [selectedId, setSelectedId] = useState(null);
//   const [viewMode, setViewMode] = useState("grid");
//   const [filter, setFilter] = useState("all");

//   /* ADD CAGE */
//   const [openAdd, setOpenAdd] = useState(false);
//   const [newCode, setNewCode] = useState("");
//   const [type, setType] = useState("pigeon");
//   const [refId, setRefId] = useState("");

//   /* MAPS (OPTIMISATION) */
//   const pigeonsMap = useMemo(() => new Map(pigeons.map(p => [p.id, p])), [pigeons]);
//   const couplesMap = useMemo(() => new Map(couples.map(c => [c.id, c])), [couples]);

//   /* FILTER + SORT */
//   const filteredCages = useMemo(() => {
//     const sorted = [...cages].sort((a, b) =>
//       a.code.localeCompare(b.code, undefined, { numeric: true })
//     );

//     if (filter === "all") return sorted;

//     return sorted.filter(c => getCageState(c) === filter);
//   }, [cages, filter]);

//   const selectedCage = useMemo(
//     () => cages.find(c => c.id === selectedId),
//     [cages, selectedId]
//   );

//   const handleSelect = useCallback((id) => {
//     setSelectedId(prev => (prev === id ? null : id));
//   }, []);

//   /* ADD CAGE */
//   const handleAddCage = async () => {
//     if (!newCode) return;

//     await addCage({
//       code: newCode,
//       pigeon: null,
//       couple: null,
//     }).unwrap();

//     setNewCode("");
//     setOpenAdd(false);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center">
//         Chargement...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-5">

//       {/* HEADER */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">
//           Gestion des cages
//         </h1>

//         <div className="flex gap-2">
//           <Button onClick={() => setOpenAdd(true)}>
//             + Ajouter cage
//           </Button>

//           <Button
//             size="icon"
//             variant={viewMode === "grid" ? "default" : "outline"}
//             onClick={() => setViewMode("grid")}
//           >
//             <LayoutGrid className="h-4 w-4" />
//           </Button>

//           <Button
//             size="icon"
//             variant={viewMode === "list" ? "default" : "outline"}
//             onClick={() => setViewMode("list")}
//           >
//             <List className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* FILTER */}
//       <Select value={filter} onValueChange={setFilter}>
//         <SelectTrigger className="w-[220px]">
//           <SelectValue />
//         </SelectTrigger>

//         <SelectContent>
//           <SelectItem value="all">Toutes</SelectItem>
//           <SelectItem value="libre">Libres</SelectItem>
//           <SelectItem value="pigeon">1 pigeon</SelectItem>
//           <SelectItem value="couple">Couples</SelectItem>
//         </SelectContent>
//       </Select>

//       {/* GRID */}
//       {viewMode === "grid" ? (
//         <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
//           {filteredCages.map(cage => (
//             <CageTile
//               key={cage.id}
//               cage={cage}
//               selected={selectedId === cage.id}
//               onClick={handleSelect}
//               pigeonsMap={pigeonsMap}
//               couplesMap={couplesMap}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="rounded-xl border">
//           {filteredCages.map(cage => (
//             <div
//               key={cage.id}
//               onClick={() => handleSelect(cage.id)}
//               className="flex cursor-pointer justify-between border-b p-4 hover:bg-muted/40"
//             >
//               <span>{cageDisplayId(cage.code)}</span>
//               <span>{getCageState(cage)}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* DETAIL */}
//       <Sheet open={!!selectedId} onOpenChange={() => setSelectedId(null)}>
//         <SheetContent>
//           {selectedCage && (
//             <div>
//               <h2 className="text-lg font-bold">
//                 Cage {cageDisplayId(selectedCage.code)}
//               </h2>
//             </div>
//           )}
//         </SheetContent>
//       </Sheet>

//       {/* ADD CAGE MODAL */}
//       <Dialog open={openAdd} onOpenChange={setOpenAdd}>
//         <DialogContent>
//             <DialogHeader>
//             <DialogTitle>Ajouter une cage</DialogTitle>
//             </DialogHeader>

//             <div className="space-y-4">

//             {/* CODE CAGE */}
//             <Input
//                 placeholder="Code cage (ex: A21)"
//                 value={newCode}
//                 onChange={(e) => setNewCode(e.target.value)}
//             />

//             {/* TYPE SELECT */}
//             <Select value={type} onValueChange={(v) => { setType(v); setRefId(""); }}>
//                 <SelectTrigger>
//                 <SelectValue placeholder="Type d'affectation" />
//                 </SelectTrigger>

//                 <SelectContent>
//                 <SelectItem value="pigeon">Pigeon</SelectItem>
//                 <SelectItem value="couple">Couple</SelectItem>
//                 </SelectContent>
//             </Select>

//             {/* SELECT DYNAMIQUE */}
//             {type === "pigeon" ? (
//                 <Select value={refId} onValueChange={setRefId}>
//                 <SelectTrigger>
//                     <SelectValue placeholder="Choisir un pigeon" />
//                 </SelectTrigger>

//                 <SelectContent>
//                     {pigeons.length === 0 ? (
//                     <div className="p-2 text-sm text-muted-foreground">
//                         Aucun pigeon
//                     </div>
//                     ) : (
//                     pigeons.map((p) => (
//                         <SelectItem key={p.id} value={String(p.id)}>
//                         {p.bague}
//                         </SelectItem>
//                     ))
//                     )}
//                 </SelectContent>
//                 </Select>
//             ) : (
//                 <Select value={refId} onValueChange={setRefId}>
//                 <SelectTrigger>
//                     <SelectValue placeholder="Choisir un couple" />
//                 </SelectTrigger>

//                 <SelectContent>
//                     {couples.length === 0 ? (
//                     <div className="p-2 text-sm text-muted-foreground">
//                         Aucun couple
//                     </div>
//                     ) : (
//                     couples.map((c) => (
//                         <SelectItem key={c.id} value={String(c.id)}>
//                         Couple #{c.id}
//                         </SelectItem>
//                     ))
//                     )}
//                 </SelectContent>
//                 </Select>
//             )}

//             {/* ACTIONS */}
//             <div className="flex justify-end gap-2">
//                 <Button variant="outline" onClick={() => setOpenAdd(false)}>
//                 Annuler
//                 </Button>

//                 <Button
//                 onClick={async () => {
//                     if (!newCode) return;

//                     await addCage({
//                     code: newCode,
//                     pigeon: type === "pigeon" ? Number(refId) : null,
//                     couple: type === "couple" ? Number(refId) : null,
//                     }).unwrap();

//                     setNewCode("");
//                     setRefId("");
//                     setType("pigeon");
//                     setOpenAdd(false);
//                 }}
//                 >
//                 Ajouter
//                 </Button>
//             </div>
//             </div>
//         </DialogContent>
//         </Dialog>
//     </div>
//   );
// }

// /* ---------------- TILE ---------------- */

// const CageTile = memo(({ cage, selected, onClick, pigeonsMap, couplesMap }) => {
//   const state = getCageState(cage);

//   const pigeon = pigeonsMap.get(cage.pigeon);
//   const couple = couplesMap.get(cage.couple);

//   const male = couple ? pigeonsMap.get(couple.male) : null;
//   const female = couple ? pigeonsMap.get(couple.female) : null;

//   return (
//     <button
//       onClick={() => onClick(cage.id)}
//       className={cn(
//         "rounded-xl border p-4 transition",
//         selected && "ring-2 ring-sky-500"
//       )}
//     >
//       <div className="font-bold">
//         {cageDisplayId(cage.code)}
//       </div>

//       <div className="mt-2 flex justify-center">
//         <Bird className="h-8 w-8" />
//       </div>

//       <div className="mt-2 text-sm">
//         {state === "libre" && "Libre"}
//         {state === "pigeon" && pigeon?.bague}
//         {state === "couple" && `${male?.bague} × ${female?.bague}`}
//       </div>
//     </button>
//   );
// });


import React, { useMemo, useState } from "react";
import {
  Bird,
  Filter,
  Home,
  LayoutGrid,
  List,
  User,
  Users,
} from "lucide-react";

function cageDisplayId(code) {
  return code;
}

function pigeonAgeLabel(birthDate) {
  if (!birthDate) return "—";

  const d = new Date(birthDate);

  if (Number.isNaN(d.getTime())) return "—";

  const now = new Date();

  let y = now.getFullYear() - d.getFullYear();

  const md = now.getMonth() - d.getMonth();

  if (md < 0 || (md === 0 && now.getDate() < d.getDate())) {
    y--;
  }

  return y <= 0 ? "< 1 an" : `${y} an${y > 1 ? "s" : ""}`;
}

function cageState(cage) {
  if (cage.couple) return "couple";
  if (cage.pigeon) return "pigeon";
  return "libre";
}

export default function CagesPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");

  // EXEMPLE DATA
  const cages = [
    {
      id: 1,
      code: "A01",
      pigeon: {
        id: 1,
        bague: "SN-100",
        sex: "M",
        race: "Mondain",
        birth_date: "2023-05-12",
      },
    },
    {
      id: 2,
      code: "A02",
      couple: {
        male: {
          bague: "SN-200",
        },
        female: {
          bague: "SN-201",
        },
      },
    },
    {
      id: 3,
      code: "A03",
    },
    {
      id: 4,
      code: "A04",
      pigeon: {
        id: 2,
        bague: "SN-300",
        sex: "F",
        race: "King",
        birth_date: "2022-08-10",
      },
    },
  ];

  const sortedCages = useMemo(() => {
    return [...cages].sort((a, b) =>
      a.code.localeCompare(b.code, undefined, {
        numeric: true,
      })
    );
  }, [cages]);

  const filteredCages = useMemo(() => {
    if (filter === "all") return sortedCages;

    return sortedCages.filter((c) => cageState(c) === filter);
  }, [sortedCages, filter]);

  const selected =
    selectedId != null
      ? cages.find((c) => c.id === selectedId)
      : null;

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* HEADER */}
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white p-2 shadow">
              <Home className="h-5 w-5" />
            </div>

            <h1 className="text-3xl font-bold">
              Volière A
            </h1>
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              Libre
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              1 pigeon
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500"></span>
              Couple
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* FILTER */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border bg-white px-3 py-2"
          >
            <option value="all">Toutes les cages</option>
            <option value="libre">Libres</option>
            <option value="pigeon">1 pigeon</option>
            <option value="couple">Couples</option>
          </select>

          {/* VIEW MODE */}
          <div className="flex overflow-hidden rounded-lg border bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-sky-500 text-white"
                  : ""
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-sky-500 text-white"
                  : ""
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* GRID VIEW */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {filteredCages.map((cage) => (
            <CageTile
              key={cage.id}
              cage={cage}
              selected={selectedId === cage.id}
              onClick={() =>
                setSelectedId(
                  selectedId === cage.id ? null : cage.id
                )
              }
            />
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">
                  Cage
                </th>

                <th className="px-4 py-3 text-left">
                  Statut
                </th>

                <th className="px-4 py-3 text-left">
                  Détails
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCages.map((cage) => {
                const st = cageState(cage);

                return (
                  <tr
                    key={cage.id}
                    className="cursor-pointer border-t hover:bg-gray-50"
                    onClick={() =>
                      setSelectedId(cage.id)
                    }
                  >
                    <td className="px-4 py-3 font-bold">
                      {cage.code}
                    </td>

                    <td className="px-4 py-3">
                      {st === "libre" && (
                        <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                          Libre
                        </span>
                      )}

                      {st === "pigeon" && (
                        <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">
                          1 pigeon
                        </span>
                      )}

                      {st === "couple" && (
                        <span className="rounded bg-orange-100 px-2 py-1 text-sm text-orange-700">
                          Couple
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {st === "pigeon" &&
                        cage.pigeon?.bague}

                      {st === "couple" &&
                        `${cage.couple?.male?.bague} + ${cage.couple?.female?.bague}`}

                      {st === "libre" && "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL PANEL */}
      {/* DETAIL PANEL À DROITE */}
<div
  className={`fixed right-0 top-0 z-50 h-screen w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ${
    selected ? "translate-x-0" : "translate-x-full"
  }`}
>
  {selected && (
    <div className="flex h-full flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="text-2xl font-bold">
            Cage {selected.code}
          </h2>

          {cageState(selected) === "libre" && (
            <span className="mt-2 inline-block rounded bg-green-100 px-3 py-1 text-sm text-green-700">
              Libre
            </span>
          )}

          {cageState(selected) === "pigeon" && (
            <span className="mt-2 inline-block rounded bg-red-100 px-3 py-1 text-sm text-red-700">
              1 pigeon
            </span>
          )}

          {cageState(selected) === "couple" && (
            <span className="mt-2 inline-block rounded bg-orange-100 px-3 py-1 text-sm text-orange-700">
              Couple
            </span>
          )}
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setSelectedId(null)}
          className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
        >
          Fermer
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* PIGEON */}
        {selected.pigeon && (
          <PigeonMiniCard pigeon={selected.pigeon} />
        )}

        {/* COUPLE */}
        {selected.couple && (
          <div className="space-y-3">
            <PigeonMiniCard
              pigeon={{
                ...selected.couple.male,
                sex: "M",
              }}
            />

            <PigeonMiniCard
              pigeon={{
                ...selected.couple.female,
                sex: "F",
              }}
            />
          </div>
        )}

        {/* LIBRE */}
        {cageState(selected) === "libre" && (
          <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500">
            Cage vide
          </div>
        )}
      </div>
    </div>
  )}
</div>

{/* OVERLAY */}
{selected && (
  <div
    onClick={() => setSelectedId(null)}
    className="fixed inset-0 z-40 bg-black/40"
  />
)}
    </div>
  );
}

function CageTile({
  cage,
  selected,
  onClick,
}) {
  const st = cageState(cage);

  const styles =
    st === "libre"
      ? "border-green-300 bg-green-50 text-green-700"
      : st === "pigeon"
      ? "border-red-300 bg-red-50 text-red-700"
      : "border-orange-300 bg-orange-50 text-orange-700";

  return (
    <button
      onClick={onClick}
      className={`aspect-square rounded-2xl border-2 p-4 transition hover:scale-105 ${styles} ${
        selected
          ? "ring-4 ring-sky-400"
          : ""
      }`}
    >
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <span className="text-sm font-bold">
          {cageDisplayId(cage.code)}
        </span>

        {/* ICON */}
        {st === "libre" && (
          <Bird className="h-10 w-10" />
        )}

        {st === "pigeon" && (
          <Bird className="h-10 w-10 fill-current" />
        )}

        {st === "couple" && (
          <div className="flex">
            <Bird className="h-7 w-7 fill-current" />
            <Bird className="h-7 w-7 fill-current" />
          </div>
        )}

        {/* LABEL */}
        <span className="text-center text-xs">
          {st === "libre" && "Libre"}

          {st === "pigeon" &&
            cage.pigeon?.bague}

          {st === "couple" &&
            `${cage.couple?.male?.bague} + ${cage.couple?.female?.bague}`}
        </span>
      </div>
    </button>
  );
}

function PigeonMiniCard({ pigeon }) {
  return (
    <div className="mb-3 flex gap-4 rounded-xl border bg-gray-50 p-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-200">
        <Bird className="h-8 w-8 text-gray-500" />
      </div>

      <div className="space-y-1">
        <div>
          <span
            className={`rounded px-2 py-1 text-xs ${
              pigeon.sex === "M"
                ? "bg-sky-100 text-sky-700"
                : "bg-pink-100 text-pink-700"
            }`}
          >
            {pigeon.sex === "M"
              ? "Mâle"
              : "Femelle"}
          </span>
        </div>

        <p>
          <strong>Bague :</strong>{" "}
          {pigeon.bague}
        </p>

        <p>
          <strong>Race :</strong>{" "}
          {pigeon.race || "—"}
        </p>

        <p>
          <strong>Âge :</strong>{" "}
          {pigeonAgeLabel(
            pigeon.birth_date
          )}
        </p>
      </div>
    </div>
  );
}