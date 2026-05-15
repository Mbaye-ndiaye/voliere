/** Libellé UI : Django stocke `mort` pour un décès ; `decede` peut encore apparaître côté client. */
export function pigeonStatusLabel(status) {
    if (status === "decede" || status === "mort")
        return "mort";
    return status;
}
export function pigeonStatusFromSortieType(t) {
    const m = { vente: "vendu", deces: "mort", perte: "perdu" };
    return m[t];
}
/** Identifiant grille affiché (ex. A01) à partir du modèle Django `row` + `col`. */
export function cageDisplayId(code) {
    return code;
}
