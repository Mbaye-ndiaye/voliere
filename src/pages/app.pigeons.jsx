import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

import { useEffect, useMemo, useState } from "react";
import { useCreatePigeonMutation, useGetCagesQuery, useGetCouplesQuery, useGetPigeonsQuery, useGetReproductionsQuery, useGetSortiesQuery, } from "@/lib/redux/voliereApi";
import { cageDisplayId, pigeonStatusLabel } from "@/lib/api-mappers";
import { buildPigeonHistoryLines, formatHistoryDate } from "@/lib/voliere-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Bird } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {toast} from "sonner";
const statusColor = {
    actif: "bg-cage-free/30 text-cage-free-foreground border-cage-free",
    vendu: "bg-accent text-accent-foreground border-accent",
    mort: "bg-muted text-muted-foreground border-border",
    decede: "bg-muted text-muted-foreground border-border",
    perdu: "bg-destructive/10 text-destructive border-destructive/30",
};
function filterMatches(p, filter) {
    if (filter === "tous")
        return true;
    if (filter === "mort")
        return p.status === "mort" || p.status === "decede";
    return p.status === filter;
}
function PigeonsPage() {
    const { data: pigeons = [], isLoading } = useGetPigeonsQuery();
    const { data: couples = [] } = useGetCouplesQuery();
    const { data: reproductions = [] } = useGetReproductionsQuery();
    const { data: sorties = [] } = useGetSortiesQuery();
    const { data: cages = [] } = useGetCagesQuery();
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState("tous");
    const [detailId, setDetailId] = useState(null);
    const filtered = pigeons.filter((p) => filterMatches(p, filter));
    const detailPigeon = detailId != null ? pigeons.find((p) => p.id === detailId) ?? null : null;
    if (isLoading) {
        return _jsx("div", { className: "text-muted-foreground", children: "Chargement des pigeons\u2026" });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("header", { className: "flex items-end justify-between gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-display text-4xl font-bold", children: "Pigeons" }), _jsxs("p", { className: "text-muted-foreground mt-1", children: [pigeons.length, " pigeons enregistr\u00E9s"] })] }), _jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "w-4 h-4" }), " Nouveau pigeon"] }) }), _jsx(PigeonForm, { onClose: () => setOpen(false) })] })] }), _jsx("div", { className: "flex gap-2 flex-wrap", children: ["tous", "actif", "vendu", "mort", "perdu"].map((s) => (_jsx("button", { type: "button", onClick: () => setFilter(s), className: `px-3 py-1.5 rounded-full text-sm capitalize border ${filter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`, children: s }, s))) }), _jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [filtered.map((p) => (_jsx(PigeonCard, { pigeon: p, all: pigeons, onOpen: () => setDetailId(p.id) }, p.id))), filtered.length === 0 && (_jsx("p", { className: "text-muted-foreground col-span-full text-center py-12", children: "Aucun pigeon." }))] }), _jsx(PigeonDetailSheet, { open: detailId != null, onOpenChange: (o) => {
                    if (!o)
                        setDetailId(null);
                }, pigeon: detailPigeon, pigeons: pigeons, couples: couples, reproductions: reproductions, sorties: sorties, cages: cages })] }));
}
function PigeonCard({ pigeon, all, onOpen, }) {
    const pere = pigeon.parent_male ? all.find((x) => x.id === pigeon.parent_male) : undefined;
    const mere = pigeon.parent_female ? all.find((x) => x.id === pigeon.parent_female) : undefined;
    const label = pigeonStatusLabel(pigeon.status);
    const colorKey = pigeon.status === "decede" || pigeon.status === "mort" ? "mort" : pigeon.status;
    return (_jsxs("button", { type: "button", onClick: onOpen, className: "bg-card border border-border rounded-2xl p-5 w-full text-left transition hover:border-primary/40 hover:ring-1 hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", style: { boxShadow: "var(--shadow-soft)" }, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center", children: _jsx(Bird, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("div", { className: "font-display text-lg font-bold", children: pigeon.bague }), _jsx("div", { className: "text-xs text-muted-foreground", children: pigeon.race })] })] }), _jsx(Badge, { className: `${statusColor[colorKey] ?? statusColor.actif} border`, variant: "outline", children: label })] }), _jsxs("dl", { className: "mt-4 space-y-1.5 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-muted-foreground", children: "Sexe" }), _jsx("dd", { children: pigeon.sex === "M" ? "Mâle ♂" : "Femelle ♀" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-muted-foreground", children: "N\u00E9 le" }), _jsx("dd", { children: new Date(pigeon.birth_date).toLocaleDateString("fr-FR") })] }), (pere || mere) && (_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-muted-foreground", children: "Parents" }), _jsxs("dd", { children: [pere?.bague ?? "?", " \u00D7 ", mere?.bague ?? "?"] })] }))] })] }));
}
function PigeonDetailSheet({ open, onOpenChange, pigeon, pigeons, couples, reproductions, sorties, cages, }) {
    const [historyOpen, setHistoryOpen] = useState(false);
    useEffect(() => {
        setHistoryOpen(false);
    }, [pigeon?.id]);
    const historyItems = useMemo(() => {
        if (!pigeon)
            return [];
        return buildPigeonHistoryLines(pigeon, { pigeons, couples, reproductions, sorties });
    }, [pigeon, pigeons, couples, reproductions, sorties]);
    const cage = pigeon ? cages.find((c) => c.pigeon === pigeon.id) : undefined;
    const pere = pigeon?.parent_male ? pigeons.find((x) => x.id === pigeon.parent_male) : undefined;
    const mere = pigeon?.parent_female ? pigeons.find((x) => x.id === pigeon.parent_female) : undefined;
    const label = pigeon ? pigeonStatusLabel(pigeon.status) : "";
    const colorKey = pigeon?.status === "decede" || pigeon?.status === "mort" ? "mort" : pigeon?.status ?? "actif";
    return (_jsx(Sheet, { open: open, onOpenChange: onOpenChange, children: _jsx(SheetContent, { side: "right", className: "w-full overflow-y-auto border-l p-0 sm:max-w-md", children: pigeon && (_jsxs("div", { className: "flex h-full flex-col", children: [_jsxs(SheetHeader, { className: "border-b px-6 pb-4 pt-2", children: [_jsx("div", { className: "flex items-start justify-between gap-2 pr-8", children: _jsx(SheetTitle, { className: "font-display text-xl", children: pigeon.bague }) }), _jsx(Badge, { className: `mt-2 w-fit border ${statusColor[colorKey] ?? statusColor.actif}`, variant: "outline", children: label })] }), _jsxs("div", { className: "flex-1 space-y-6 overflow-y-auto px-6 py-4", children: [_jsxs("section", { children: [_jsx("h3", { className: "mb-3 text-sm font-semibold tracking-tight", children: "Fiche" }), _jsxs("dl", { className: "space-y-1.5 text-sm", children: [_jsxs("div", { className: "flex justify-between gap-2", children: [_jsx("dt", { className: "text-muted-foreground", children: "Race" }), _jsx("dd", { children: pigeon.race })] }), _jsxs("div", { className: "flex justify-between gap-2", children: [_jsx("dt", { className: "text-muted-foreground", children: "Sexe" }), _jsx("dd", { children: pigeon.sex === "M" ? "Mâle ♂" : "Femelle ♀" })] }), _jsxs("div", { className: "flex justify-between gap-2", children: [_jsx("dt", { className: "text-muted-foreground", children: "N\u00E9 le" }), _jsx("dd", { children: new Date(pigeon.birth_date).toLocaleDateString("fr-FR") })] }), (pere || mere) && (_jsxs("div", { className: "flex justify-between gap-2", children: [_jsx("dt", { className: "text-muted-foreground", children: "Parents" }), _jsxs("dd", { children: [pere?.bague ?? "?", " \u00D7 ", mere?.bague ?? "?"] })] })), cage && (_jsxs("div", { className: "flex justify-between gap-2", children: [_jsx("dt", { className: "text-muted-foreground", children: "Cage actuelle" }), _jsx("dd", { className: "font-medium", children: cageDisplayId(cage.code) })] }))] })] }), _jsxs("section", { children: [_jsx("h3", { className: "mb-3 text-sm font-semibold tracking-tight", children: "Historique" }), historyItems.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground", children: "Aucun \u00E9v\u00E9nement enregistr\u00E9 pour l\u2019instant." })) : (_jsxs(_Fragment, { children: [_jsx("ul", { className: "relative space-y-3 border-l-2 border-muted pl-4", children: (historyOpen ? historyItems : historyItems.slice(0, 4)).map((h, i) => (_jsxs("li", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-foreground", children: formatHistoryDate(h.iso) }), _jsxs("span", { className: "text-muted-foreground", children: [" : ", h.label] })] }, `${h.iso}-${i}`))) }), historyItems.length > 4 && (_jsx("button", { type: "button", className: "mt-2 text-sm font-medium text-sky-600 hover:underline dark:text-sky-400", onClick: () => setHistoryOpen(!historyOpen), children: historyOpen ? "Réduire l’historique" : "Voir tout l’historique" }))] }))] })] })] })) }) }));
}


function PigeonForm({ onClose }) {
    const { data: pigeons = [] } = useGetPigeonsQuery();
    const [createPigeon, { isLoading }] = useCreatePigeonMutation();
    const [bague, setBague] = useState("");
    const [sex, setSex] = useState("M");
    const [race, setRace] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [parentMaleId, setParentMaleId] = useState("");
    const [parentFemaleId, setParentFemaleId] = useState("");
    const males = pigeons.filter((p) => p.sex === "M");
    const femelles = pigeons.filter((p) => p.sex === "F");
    const submit = async (e) => {
        e.preventDefault();
        const ring = bague.trim() || `P-${Date.now()}`;
        try {
            await createPigeon({
                bague: ring,
                sex,
                race,
                birth_date: birthDate,
                parent_male: parentMaleId ? parseInt(parentMaleId, 10) : null,
                parent_female: parentFemaleId ? parseInt(parentFemaleId, 10) : null,
            }).unwrap();
            toast.success("Pigeon enregistré avec succès");
            onClose();
        }
        catch {
            toast.error("Erreur lors de l'enregistrement du pigeon");
        }
    };
    return (_jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "font-display text-2xl", children: "Nouveau pigeon" }) }), _jsxs("form", { onSubmit: submit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx(Label, { children: "Bague (auto si vide)" }), _jsx(Input, { value: bague, onChange: (e) => setBague(e.target.value), placeholder: "P006" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Sexe" }), _jsxs(Select, { value: sex, onValueChange: (v) => setSex(v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "M", children: "M\u00E2le" }), _jsx(SelectItem, { value: "F", children: "Femelle" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Race" }), _jsx(Input, { value: race, onChange: (e) => setRace(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx(Label, { children: "Date de naissance" }), _jsx(Input, { type: "date", value: birthDate, onChange: (e) => setBirthDate(e.target.value), required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx(Label, { children: "P\u00E8re" }), _jsxs(Select, { value: parentMaleId || "none", onValueChange: (v) => setParentMaleId(v === "none" ? "" : v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "\u2014" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "none", children: "\u2014" }), males.map((p) => (_jsx(SelectItem, { value: String(p.id), children: p.bague }, p.id)))] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "M\u00E8re" }), _jsxs(Select, { value: parentFemaleId || "none", onValueChange: (v) => setParentFemaleId(v === "none" ? "" : v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "\u2014" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "none", children: "\u2014" }), femelles.map((p) => (_jsx(SelectItem, { value: String(p.id), children: p.bague }, p.id)))] })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "ghost", onClick: onClose, children: "Annuler" }), _jsx(Button, { type: "submit", disabled: isLoading, children: "Enregistrer" })] })] })] }));
}

export default PigeonsPage;
