import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

import { useEffect, useMemo, useState } from "react";
import { useCreateCoupleMutation, useGetCouplesQuery, useGetPigeonsQuery, useGetReproductionsQuery, useUpdateCoupleMutation, } from "@/lib/redux/voliereApi";
import { buildCoupleHistoryLines, formatHistoryDate } from "@/lib/voliere-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Heart, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function CouplesPage() {
    const { data: couples = [], isLoading } = useGetCouplesQuery();
    const { data: pigeons = [] } = useGetPigeonsQuery();
    const { data: reproductions = [] } = useGetReproductionsQuery();
    const [updateCouple] = useUpdateCoupleMutation();
    const [open, setOpen] = useState(false);
    const [detailId, setDetailId] = useState(null);
    const activeCouples = couples.filter((c) => c.active !== false);
    const dissolve = async (id) => {
        await updateCouple({ id, patch: { active: false } }).unwrap();
    };
    const detailCouple = detailId != null ? couples.find((c) => c.id === detailId) ?? null : null;
    if (isLoading) {
        return _jsx("div", { className: "text-muted-foreground", children: "Chargement des couples\u2026" });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("header", { className: "flex items-end justify-between gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-display text-4xl font-bold", children: "Couples" }), _jsxs("p", { className: "text-muted-foreground mt-1", children: [activeCouples.length, " couple", activeCouples.length > 1 ? "s" : "", " actif", activeCouples.length > 1 ? "s" : ""] })] }), _jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "w-4 h-4" }), " Nouveau couple"] }) }), _jsx(CoupleForm, { onClose: () => setOpen(false) })] })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [activeCouples.map((c) => {
                        const m = pigeons.find((p) => p.id === c.male);
                        const f = pigeons.find((p) => p.id === c.female);
                        return (_jsx(CoupleCard, { couple: c, maleBague: m?.bague ?? "—", femaleBague: f?.bague ?? "—", onOpen: () => setDetailId(c.id), onDissolve: () => dissolve(c.id) }, c.id));
                    }), activeCouples.length === 0 && (_jsx("p", { className: "text-muted-foreground col-span-full text-center py-12", children: "Aucun couple." }))] }), _jsx(CoupleDetailSheet, { open: detailId != null, onOpenChange: (o) => {
                    if (!o)
                        setDetailId(null);
                }, couple: detailCouple, pigeons: pigeons, reproductions: reproductions })] }));
}
function CoupleCard({ couple, maleBague, femaleBague, onOpen, onDissolve, }) {
    return (_jsxs("div", { role: "button", tabIndex: 0, onClick: onOpen, onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen();
            }
        }, className: "bg-card rounded-2xl p-5 border border-border cursor-pointer transition hover:border-primary/40 hover:ring-1 hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", style: { boxShadow: "var(--shadow-soft)" }, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-cage-couple/30 text-cage-couple-foreground flex items-center justify-center", children: _jsx(Heart, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsxs("div", { className: "font-display text-lg font-bold", children: ["#", couple.id] }), _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Form\u00E9 le ", new Date(couple.formed_at).toLocaleDateString("fr-FR")] })] })] }), _jsx(Badge, { variant: couple.active ? "default" : "outline", children: couple.active ? "actif" : "dissous" })] }), _jsxs("div", { className: "mt-4 flex items-center justify-between p-3 rounded-xl bg-muted", children: [_jsxs("div", { className: "text-center flex-1", children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "\u2642 M\u00E2le" }), _jsx("div", { className: "font-bold", children: maleBague })] }), _jsx(Heart, { className: "w-4 h-4 text-primary" }), _jsxs("div", { className: "text-center flex-1", children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "\u2640 Femelle" }), _jsx("div", { className: "font-bold", children: femaleBague })] })] }), couple.active && (_jsx(Button, { variant: "ghost", size: "sm", className: "w-full mt-3 text-destructive hover:bg-destructive/10", type: "button", onClick: (e) => {
                    e.stopPropagation();
                    onDissolve();
                }, children: "Dissoudre le couple" }))] }));
}
function CoupleDetailSheet({ open, onOpenChange, couple, pigeons, reproductions, }) {
    const [historyOpen, setHistoryOpen] = useState(false);
    useEffect(() => {
        setHistoryOpen(false);
    }, [couple?.id]);
    const m = couple ? pigeons.find((p) => p.id === couple.male) : undefined;
    const f = couple ? pigeons.find((p) => p.id === couple.female) : undefined;
    const maleBague = m?.bague ?? couple?.male_bague ?? "—";
    const femaleBague = f?.bague ?? couple?.female_bague ?? "—";
    const historyItems = useMemo(() => {
        if (!couple)
            return [];
        return buildCoupleHistoryLines(couple, maleBague, femaleBague, reproductions);
    }, [couple, maleBague, femaleBague, reproductions]);
    return (_jsx(Sheet, { open: open, onOpenChange: onOpenChange, children: _jsx(SheetContent, { side: "right", className: "w-full overflow-y-auto border-l p-0 sm:max-w-md", children: couple && (_jsxs("div", { className: "flex h-full flex-col", children: [_jsxs(SheetHeader, { className: "border-b px-6 pb-4 pt-2", children: [_jsx("div", { className: "flex items-start justify-between gap-2 pr-8", children: _jsxs(SheetTitle, { className: "font-display text-xl", children: ["Couple n\u00B0", couple.id] }) }), _jsx(Badge, { className: "mt-2 w-fit", variant: couple.active ? "default" : "outline", children: couple.active ? "actif" : "dissous" })] }), _jsxs("div", { className: "flex-1 space-y-6 overflow-y-auto px-6 py-4", children: [_jsxs("section", { children: [_jsx("h3", { className: "mb-3 text-sm font-semibold tracking-tight", children: "Composition" }), _jsxs("div", { className: "flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4", children: [_jsxs("div", { className: "text-center flex-1 text-sm", children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "\u2642 M\u00E2le" }), _jsx("div", { className: "font-bold", children: maleBague }), m && _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: m.race })] }), _jsx(Heart, { className: "h-5 w-5 shrink-0 text-primary" }), _jsxs("div", { className: "text-center flex-1 text-sm", children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "\u2640 Femelle" }), _jsx("div", { className: "font-bold", children: femaleBague }), f && _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: f.race })] })] }), _jsxs("p", { className: "mt-3 text-sm text-muted-foreground", children: ["Form\u00E9 le ", new Date(couple.formed_at).toLocaleDateString("fr-FR")] })] }), _jsxs("section", { children: [_jsx("h3", { className: "mb-3 text-sm font-semibold tracking-tight", children: "Historique" }), historyItems.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground", children: "Aucun \u00E9v\u00E9nement enregistr\u00E9 pour l\u2019instant." })) : (_jsxs(_Fragment, { children: [_jsx("ul", { className: "relative space-y-3 border-l-2 border-muted pl-4", children: (historyOpen ? historyItems : historyItems.slice(0, 4)).map((h, i) => (_jsxs("li", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-foreground", children: formatHistoryDate(h.iso) }), _jsxs("span", { className: "text-muted-foreground", children: [" : ", h.label] })] }, `${h.iso}-${i}`))) }), historyItems.length > 4 && (_jsx("button", { type: "button", className: "mt-2 text-sm font-medium text-sky-600 hover:underline dark:text-sky-400", onClick: () => setHistoryOpen(!historyOpen), children: historyOpen ? "Réduire l’historique" : "Voir tout l’historique" }))] }))] })] })] })) }) }));
}
function CoupleForm({ onClose }) {
    const { data: couples = [] } = useGetCouplesQuery();
    const { data: pigeons = [] } = useGetPigeonsQuery();
    const [createCouple, { isLoading }] = useCreateCoupleMutation();
    const usedIds = new Set(couples.filter((c) => c.active).flatMap((c) => [c.male, c.female]));
    const males = pigeons.filter((p) => p.sex === "M" && p.status === "actif" && !usedIds.has(p.id));
    const femelles = pigeons.filter((p) => p.sex === "F" && p.status === "actif" && !usedIds.has(p.id));
    console.log("couples", couples);
    const [maleId, setMaleId] = useState("");
    const [femaleId, setFemaleId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const submit = async (e) => {
        e.preventDefault();
        if (!maleId || !femaleId)
            return;
        await createCouple({
            male: parseInt(maleId, 10),
            female: parseInt(femaleId, 10),
            formed_at: date,
        }).unwrap();
        onClose();
    };
    return (_jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "font-display text-2xl", children: "Former un couple" }) }), _jsxs("form", { onSubmit: submit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "M\u00E2le" }), _jsxs(Select, { value: maleId, onValueChange: setMaleId, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "S\u00E9lectionner\u2026" }) }), _jsxs(SelectContent, { children: [males.length === 0 && (_jsx("div", { className: "px-3 py-2 text-sm text-muted-foreground", children: "Aucun m\u00E2le disponible" })), males.map((p) => (_jsxs(SelectItem, { value: String(p.id), children: [p.bague, " \u2014 ", p.race] }, p.id)))] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Femelle" }), _jsxs(Select, { value: femaleId, onValueChange: setFemaleId, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "S\u00E9lectionner\u2026" }) }), _jsxs(SelectContent, { children: [femelles.length === 0 && (_jsx("div", { className: "px-3 py-2 text-sm text-muted-foreground", children: "Aucune femelle disponible" })), femelles.map((p) => (_jsxs(SelectItem, { value: String(p.id), children: [p.bague, " \u2014 ", p.race] }, p.id)))] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Date de formation" }), _jsx(Input, { type: "date", value: date, onChange: (e) => setDate(e.target.value), required: true })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "ghost", onClick: onClose, children: "Annuler" }), _jsx(Button, { type: "submit", disabled: isLoading, children: "Cr\u00E9er" })] })] })] }));
}

export default CouplesPage;
