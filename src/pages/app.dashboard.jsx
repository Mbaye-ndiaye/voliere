import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Bird, Heart, Grid3x3, Baby, DoorOpen, TrendingUp } from "lucide-react";
import { useGetSortiesQuery, useGetStatsQuery } from "@/lib/redux/voliereApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { Button } from "@/components/ui/button";

function describeRtkError(err) {
    if (err && typeof err === "object" && "status" in err) {
        const e = err;
        const body = e.data !== undefined ? JSON.stringify(e.data) : "";
        return `HTTPS ${String(e.status)}${body ? ` — ${body}` : ""}`;
    }
    if (err instanceof Error)
        return err.message;
    return String(err);
}
function Dashboard() {
    const accessToken = useAppSelector((s) => s.auth.accessToken);
    const skip = !accessToken;
    const { data: stats, isLoading: loadingStats, isFetching, error: errStats, refetch, } = useGetStatsQuery(undefined, { skip });
    const { data: sorties = [] } = useGetSortiesQuery(undefined, { skip });
    const ventes = sorties.filter((s) => s.type === "vente");
    const revenu = ventes.reduce((acc, v) => acc + Number(v.price ?? 0), 0);
    const totalSorties = sorties.length;
    if (skip) {
        return (_jsx("div", { className: "p-6 text-muted-foreground", children: "Session en cours de chargement\u2026 Si cela reste bloqu\u00E9, reconnectez-vous." }));
    }
    if (loadingStats && !stats) {
        return _jsx("div", { className: "p-6 text-muted-foreground", children: "Chargement du tableau de bord\u2026" });
    }
    if (errStats || !stats) {
        const apiBase = import.meta.env.VITE_API_URL;
    }
    const dashboardStats = [
        {
            label: "Pigeons (total)",
            value: stats.pigeons,
            sub: "effectif en base",
            icon: Bird,
            tint: "bg-primary/10 text-primary",
        },
        {
            label: "Couples actifs",
            value: stats.couples,
            sub: "en reproduction",
            icon: Heart,
            tint: "bg-cage-couple/20 text-cage-couple-foreground",
        },
        {
            label: "Cages",
            value: stats.cages,
            sub: "emplacements",
            icon: Grid3x3,
            tint: "bg-cage-free/30 text-cage-free-foreground",
        },
        {
            label: "Reproductions",
            value: stats.reproductions,
            sub: "portées enregistrées",
            icon: Baby,
            tint: "bg-accent text-accent-foreground",
        },
        {
            label: "Sorties",
            value: totalSorties,
            sub: `${ventes.length} ventes`,
            icon: DoorOpen,
            tint: "bg-secondary text-secondary-foreground",
        },
        {
            label: "Revenu",
            value: `${revenu} CFA`,
            sub: "ventes cumulées (sorties)",
            icon: TrendingUp,
            tint: "bg-primary/10 text-primary",
        },
    ];
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("header", { children: _jsx("h1", { className: "font-display text-4xl font-bold mt-1", children: "Votre voli\u00E8re en un coup d'\u0153il" }) }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-4", children: dashboardStats.map((s) => {
                    const Icon = s.icon;
                    return (_jsxs("div", { className: "bg-card rounded-2xl p-5 border border-border", style: { boxShadow: "var(--shadow-soft)" }, children: [_jsx("div", { className: `inline-flex w-10 h-10 items-center justify-center rounded-xl ${s.tint}`, children: _jsx(Icon, { className: "w-5 h-5" }) }), _jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "text-3xl font-bold font-display", children: s.value }), _jsx("div", { className: "text-sm font-medium mt-1", children: s.label }), _jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: s.sub })] })] }, s.label));
                }) }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs(Link, { to: "/app/cages", className: "group rounded-2xl p-6 text-primary-foreground relative overflow-hidden", style: { background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }, children: [_jsx(Grid3x3, { className: "w-8 h-8 mb-3 opacity-90" }), _jsx("h3", { className: "font-display text-2xl font-bold", children: "Voir la voli\u00E8re" }), _jsx("p", { className: "opacity-90 text-sm mt-1", children: "Visualisez et g\u00E9rez les cages en un clic" }), _jsx("div", { className: "mt-4 text-sm font-medium opacity-90 group-hover:opacity-100", children: "Ouvrir la grille \u2192" })] }), _jsxs(Link, { to: "/app/pigeons", className: "rounded-2xl p-6 bg-card border border-border", style: { boxShadow: "var(--shadow-soft)" }, children: [_jsx(Bird, { className: "w-8 h-8 mb-3 text-primary" }), _jsx("h3", { className: "font-display text-2xl font-bold", children: "G\u00E9rer les pigeons" }), _jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Ajoutez, identifiez et suivez vos pigeons" }), _jsx("div", { className: "mt-4 text-sm font-medium text-primary", children: "Voir la liste \u2192" })] })] })] }));
}

export default Dashboard;
