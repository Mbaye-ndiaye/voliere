import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

import { useState } from "react";
import { useCreateReproductionMutation, useGetCouplesQuery, useGetPigeonsQuery, useGetReproductionsQuery, } from "@/lib/redux/voliereApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from "@/components/ui/dialog";
import { Baby, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function ReproductionsPage() {
    const { data: reproductions = [], isLoading } = useGetReproductionsQuery();
    const { data: couples = [] } = useGetCouplesQuery();
    const { data: pigeons = [] } = useGetPigeonsQuery();
    const [open, setOpen] = useState(false);
    if (isLoading) {
        return _jsx("div", { className: "text-muted-foreground", children: "Chargement des reproductions\u2026" });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("header", { className: "flex items-end justify-between gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-display text-4xl font-bold", children: "Reproductions" }), _jsxs("p", { className: "text-muted-foreground mt-1", children: [reproductions.length, " port\u00E9es"] })] }), _jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "w-4 h-4" }), " Nouvelle port\u00E9e"] }) }), _jsx(ReproForm, { onClose: () => setOpen(false) })] })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [reproductions.map((r) => {
                        const couple = couples.find((c) => c.id === r.couple);
                        const m = couple ? pigeons.find((p) => p.id === couple.male) : undefined;
                        const f = couple ? pigeons.find((p) => p.id === couple.female) : undefined;
                        return (_jsxs("div", { className: "bg-card rounded-2xl p-5 border border-border", style: { boxShadow: "var(--shadow-soft)" }, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center", children: _jsx(Baby, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsxs("div", { className: "font-display text-lg font-bold", children: ["#", r.id] }), _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Couple #", r.couple, " \u00B7 ", m?.bague, " \u00D7 ", f?.bague] })] })] }), _jsxs("dl", { className: "mt-4 space-y-1.5 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-muted-foreground", children: "Ponte" }), _jsx("dd", { children: new Date(r.pond_date).toLocaleDateString("fr-FR") })] }), r.hatch_date && (_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-muted-foreground", children: "\u00C9closion" }), _jsx("dd", { children: new Date(r.hatch_date).toLocaleDateString("fr-FR") })] })), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-muted-foreground", children: "Pigeonneaux" }), _jsx("dd", { className: "font-medium", children: r.count })] })] })] }, r.id));
                    }), reproductions.length === 0 && (_jsx("p", { className: "text-muted-foreground col-span-full text-center py-12", children: "Aucune reproduction enregistr\u00E9e." }))] })] }));
}
function ReproForm({ onClose }) {
    const { data: couples = [] } = useGetCouplesQuery();
    const { data: pigeons = [] } = useGetPigeonsQuery();
    const [createReproduction, { isLoading }] = useCreateReproductionMutation();
    const [coupleId, setCoupleId] = useState("");
    const [pondDate, setPondDate] = useState(new Date().toISOString().slice(0, 10));
    const [hatchDate, setHatchDate] = useState("");
    const [count, setCount] = useState(2);
    const couplesActifs = couples.filter((c) => c.active);
    const submit = async (e) => {
        e.preventDefault();
        if (!coupleId)
            return;
        await createReproduction({
            couple: parseInt(coupleId, 10),
            pond_date: pondDate,
            hatch_date: hatchDate || null,
            count,
            baby_ids: [],
        }).unwrap();
        onClose();
    };
    return (_jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "font-display text-2xl", children: "Nouvelle reproduction" }) }), _jsxs("form", { onSubmit: submit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Couple" }), _jsxs(Select, { value: coupleId, onValueChange: setCoupleId, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "S\u00E9lectionner\u2026" }) }), _jsxs(SelectContent, { children: [couplesActifs.length === 0 && (_jsx("div", { className: "px-3 py-2 text-sm text-muted-foreground", children: "Aucun couple actif" })), couplesActifs.map((c) => {
                                                const m = pigeons.find((p) => p.id === c.male);
                                                const f = pigeons.find((p) => p.id === c.female);
                                                return (_jsxs(SelectItem, { value: String(c.id), children: ["#", c.id, " (", m?.bague, " \u00D7 ", f?.bague, ")"] }, c.id));
                                            })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx(Label, { children: "Date de ponte" }), _jsx(Input, { type: "date", value: pondDate, onChange: (e) => setPondDate(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx(Label, { children: "Date d'\u00E9closion" }), _jsx(Input, { type: "date", value: hatchDate, onChange: (e) => setHatchDate(e.target.value) })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nombre de pigeonneaux" }), _jsx(Input, { type: "number", min: 0, max: 10, value: count, onChange: (e) => setCount(parseInt(e.target.value, 10)), required: true })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "ghost", onClick: onClose, children: "Annuler" }), _jsx(Button, { type: "submit", disabled: isLoading, children: "Enregistrer" })] })] })] }));
}

export default ReproductionsPage;
