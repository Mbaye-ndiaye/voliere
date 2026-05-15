function formatFr(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime()))
        return iso;
    return d.toLocaleDateString("fr-FR");
}
function sortDesc(lines) {
    return [...lines].sort((a, b) => (a.iso < b.iso ? 1 : a.iso > b.iso ? -1 : 0));
}
const SORTIE_LABEL = {
    vente: "Vente",
    deces: "Décès",
    perte: "Perte",
};
export function buildPigeonHistoryLines(pigeon, ctx) {
    const { pigeons, couples, reproductions, sorties } = ctx;
    const lines = [];
    const pere = pigeon.parent_male ? pigeons.find((x) => x.id === pigeon.parent_male) : undefined;
    const mere = pigeon.parent_female ? pigeons.find((x) => x.id === pigeon.parent_female) : undefined;
    const lignee = pere || mere
        ? ` — lignée ${pere?.bague ?? "?"} × ${mere?.bague ?? "?"}`
        : "";
    lines.push({
        iso: pigeon.birth_date,
        label: `Naissance enregistrée${lignee}`,
    });
    for (const c of couples) {
        if (c.male !== pigeon.id && c.female !== pigeon.id)
            continue;
        lines.push({
            iso: c.formed_at,
            label: `Intégré au couple n°${c.id}`,
        });
        if (!c.active && c.dissolved_at) {
            lines.push({
                iso: c.dissolved_at,
                label: `Couple n°${c.id} dissous`,
            });
        }
    }
    for (const r of reproductions) {
        const babies = r.baby_ids ?? [];
        if (!babies.includes(pigeon.id))
            continue;
        const iso = r.hatch_date ?? r.pond_date;
        lines.push({
            iso,
            label: `Enregistré comme pigeonneau (portée n°${r.id}, couple n°${r.couple})`,
        });
    }
    for (const s of sorties.filter((x) => x.pigeon === pigeon.id)) {
        const base = SORTIE_LABEL[s.type] ?? s.type;
        let extra = "";
        if (s.type === "vente" && s.buyer)
            extra = ` — acquéreur : ${s.buyer}`;
        if (s.price)
            extra += `${extra ? "" : " —"} prix : ${s.price}`;
        if (s.reason)
            extra += ` — ${s.reason}`;
        lines.push({
            iso: s.date,
            label: `Sortie : ${base}${extra}`,
        });
    }
    const enfants = pigeons.filter((p) => p.parent_male === pigeon.id || p.parent_female === pigeon.id);
    for (const e of enfants) {
        lines.push({
            iso: e.birth_date,
            label: `Descendance enregistrée : ${e.bague} (${formatFr(e.birth_date)})`,
        });
    }
    return sortDesc(lines);
}
export function buildCoupleHistoryLines(couple, maleBague, femaleBague, reproductions) {
    const lines = [];
    lines.push({
        iso: couple.formed_at,
        label: `Couple formé — ${maleBague} × ${femaleBague}`,
    });
    const reps = reproductions.filter((r) => r.couple === couple.id);
    for (const r of reps) {
        lines.push({
            iso: r.pond_date,
            label: `Ponte enregistrée (portée n°${r.id}, ${r.count} jeune(s))`,
        });
        if (r.hatch_date) {
            lines.push({
                iso: r.hatch_date,
                label: `Éclosion (portée n°${r.id})`,
            });
        }
    }
    if (!couple.active && couple.dissolved_at) {
        lines.push({
            iso: couple.dissolved_at,
            label: "Couple dissous",
        });
    }
    return sortDesc(lines);
}
export function formatHistoryDate(iso) {
    return formatFr(iso);
}
