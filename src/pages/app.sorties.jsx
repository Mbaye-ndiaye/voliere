import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

import { useState } from "react";
import { useCreateSortieMutation, useGetPigeonsQuery, useGetSortiesQuery, useUpdatePigeonMutation, } from "@/lib/redux/voliereApi";
import { pigeonStatusFromSortieType } from "@/lib/api-mappers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from "@/components/ui/dialog";
import { DoorOpen, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const typeColor = {
    vente: "bg-cage-couple/30 text-cage-couple-foreground",
    deces: "bg-muted text-muted-foreground",
    perte: "bg-destructive/10 text-destructive",
};
function SortiesPage() {
    const { data: sorties = [], isLoading } = useGetSortiesQuery();
    const { data: pigeons = [] } = useGetPigeonsQuery();
    const [open, setOpen] = useState(false);
    if (isLoading) {
        return _jsx("div", { className: "text-muted-foreground", children: "Chargement des sorties\u2026" });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("header", { className: "flex items-end justify-between gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-display text-4xl font-bold", children: "Sorties" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Historique des sorties d'effectif" })] }), _jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "w-4 h-4" }), " Nouvelle sortie"] }) }), _jsx(SortieForm, { onClose: () => setOpen(false) })] })] }), _jsx("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", style: { boxShadow: "var(--shadow-soft)" }, children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-muted/60", children: _jsxs("tr", { className: "text-left", children: [_jsx("th", { className: "px-4 py-3 font-medium", children: "Pigeon" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Type" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Date" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "D\u00E9tails" })] }) }), _jsxs("tbody", { children: [sorties.map((s) => {
                                    const p = pigeons.find((x) => x.id === s.pigeon);
                                    return (_jsxs("tr", { className: "border-t border-border", children: [_jsx("td", { className: "px-4 py-3 font-medium", children: p?.bague ?? `#${s.pigeon}` }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${typeColor[s.type]}`, children: s.type }) }), _jsx("td", { className: "px-4 py-3", children: new Date(s.date).toLocaleDateString("fr-FR") }), _jsxs("td", { className: "px-4 py-3 text-muted-foreground", children: [s.type === "vente" && (s.buyer || "—") + (s.price ? ` · ${s.price} CFA` : ""), s.type === "deces" && (s.reason || "—"), s.type === "perte" && (s.reason || "—")] })] }, s.id));
                                }), sorties.length === 0 && (_jsx("tr", { children: _jsxs("td", { colSpan: 4, className: "text-center text-muted-foreground py-12", children: [_jsx(DoorOpen, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }), "Aucune sortie enregistr\u00E9e."] }) }))] })] }) })] }));
}
function SortieForm({ onClose }) {
    const { data: pigeons = [] } = useGetPigeonsQuery();
    const [createSortie, { isLoading: loadingSortie }] = useCreateSortieMutation();
    const [updatePigeon, { isLoading: loadingPatch }] = useUpdatePigeonMutation();
    const actifs = pigeons.filter((p) => p.status === "actif");
    const [pigeonId, setPigeonId] = useState("");
    const [type, setType] = useState("vente");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [buyer, setBuyer] = useState("");
    const [price, setPrice] = useState("");
    const [reason, setReason] = useState("");
    const submit = async (e) => {
        e.preventDefault();
        const pid = parseInt(pigeonId, 10);
        if (Number.isNaN(pid))
            return;
        try {
            await createSortie({
                pigeon: pid,
                type: type,
                date,
                buyer: buyer || null,
                price: price || null,
                reason: reason || null,
            }).unwrap();
            await updatePigeon({
                id: pid,
                patch: { status: pigeonStatusFromSortieType(type) },
            }).unwrap();
            onClose();
        }
        catch {
            /* erreur API */
        }
    };
    const busy = loadingSortie || loadingPatch;
    return (_jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "font-display text-2xl", children: "Enregistrer une sortie" }) }), _jsxs("form", { onSubmit: submit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Pigeon" }), _jsxs(Select, { value: pigeonId, onValueChange: setPigeonId, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "S\u00E9lectionner\u2026" }) }), _jsxs(SelectContent, { children: [actifs.length === 0 && (_jsx("div", { className: "px-3 py-2 text-sm text-muted-foreground", children: "Aucun pigeon actif" })), actifs.map((p) => (_jsxs(SelectItem, { value: String(p.id), children: [p.bague, " \u2014 ", p.race] }, p.id)))] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx(Label, { children: "Type" }), _jsxs(Select, { value: type, onValueChange: (v) => setType(v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "vente", children: "Vente" }), _jsx(SelectItem, { value: "deces", children: "D\u00E9c\u00E8s" }), _jsx(SelectItem, { value: "perte", children: "Perte" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Date" }), _jsx(Input, { type: "date", value: date, onChange: (e) => setDate(e.target.value), required: true })] })] }), type === "vente" && (_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx(Label, { children: "Acheteur" }), _jsx(Input, { value: buyer, onChange: (e) => setBuyer(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Prix (CFA)" }), _jsx(Input, { type: "number", value: price, onChange: (e) => setPrice(e.target.value) })] })] })), type !== "vente" && (_jsxs("div", { children: [_jsx(Label, { children: "Raison / circonstances" }), _jsx(Input, { value: reason, onChange: (e) => setReason(e.target.value) })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "ghost", onClick: onClose, children: "Annuler" }), _jsx(Button, { type: "submit", disabled: busy, children: "Enregistrer" })] })] })] }));
}

export default SortiesPage;
