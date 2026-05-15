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
    if (skip) {
        return (_jsx("div", { className: "p-6 text-muted-foreground", children: "Session en cours de chargement\u2026 Si cela reste bloqu\u00E9, reconnectez-vous." }));
    }
    if (loadingStats && !stats) {
        return _jsx("div", { className: "p-6 text-muted-foreground", children: "Chargement du tableau de bord\u2026" });
    }
    if (errStats || !stats) {
        const apiBase = typeof import.meta.env.VITE_API_URL === "string" && import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
            : "https://backend-pigeons.onrender.com";
        return (_jsxs("div", { className: "p-6 space-y-3 rounded-xl border border-destructive/30 bg-destructive/5", children: [_jsx("p", { className: "text-destructive font-medium", children: "Impossible de charger les statistiques." }), _jsxs("ul", { className: "text-sm text-muted-foreground list-disc pl-5 space-y-1", children: [_jsxs("li", { children: ["V\u00E9rifiez que Django tourne et que ", _jsx("code", { className: "bg-muted px-1 rounded", children: "VITE_API_URL" }), " pointe vers la m\u00EAme origine que dans le navigateur (ex. ", _jsx("code", { className: "bg-muted px-1 rounded", children: apiBase }), ")."] }), _jsxs("li", { children: ["Les stats sont servies sur", " ", _jsx("code", { className: "bg-muted px-1 rounded", children: "GET /api/dashboard/stats/" }), " ou", " ", _jsx("code", { className: "bg-muted px-1 rounded", children: "GET /api/stats/" }), ". En 401, d\u00E9connectez-vous puis reconnectez-vous."] })] }), errStats != null && (_jsxs("p", { className: "text-xs font-mono text-muted-foreground break-all", children: ["D\u00E9tail : ", describeRtkError(errStats)] })), _jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => refetch(), disabled: isFetching, children: isFetching ? "Nouvel essai…" : "Réessayer" })] }));
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
            value: stats.sorties,
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
