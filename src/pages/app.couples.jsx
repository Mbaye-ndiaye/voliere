import React, { useEffect, useMemo, useState } from "react";
import {
  useCreateCoupleMutation,
  useGetCouplesQuery,
  useGetPigeonsQuery,
  useGetReproductionsQuery,
  useUpdateCoupleMutation,
} from "@/lib/redux/voliereApi";
import { buildCoupleHistoryLines, formatHistoryDate } from "@/lib/voliere-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Heart, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function CouplesPage() {
  const { data: couples = [], isLoading, refetch } = useGetCouplesQuery();
  const { data: pigeons = [] } = useGetPigeonsQuery();
  const { data: reproductions = [] } = useGetReproductionsQuery();
  const [updateCouple] = useUpdateCoupleMutation();
  const [open, setOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const activeCouples = couples.filter((c) => c.active !== false);

  const dissolve = async (id) => {
    try {
      await updateCouple({ id, patch: { active: false } }).unwrap();
      await refetch();
      toast.success("Couple dissous avec succès");
    } catch (error) {
      console.error("Erreur lors de la dissolution du couple:", error);
      toast.error("Erreur lors de la dissolution du couple");
    }
  };

  const detailCouple =
    detailId != null ? couples.find((c) => c.id === detailId) ?? null : null;

  if (isLoading) {
    return (
      <div className="text-muted-foreground">Chargement des couples…</div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-bold">Couples</h1>
          <p className="text-muted-foreground mt-1">
            {activeCouples.length} couple{activeCouples.length > 1 ? "s" : ""}{" "}
            actif{activeCouples.length > 1 ? "s" : ""}
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" />
              Nouveau couple
            </Button>
          </DialogTrigger>
          <CoupleForm 
            onClose={() => setOpen(false)} 
            onSuccess={() => refetch()} 
          />
        </Dialog>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {activeCouples.map((c) => {
          // Le backend renvoie male et female comme des objets complets
          const m = typeof c.male === 'object' ? c.male : pigeons.find((p) => p.id === c.male);
          const f = typeof c.female === 'object' ? c.female : pigeons.find((p) => p.id === c.female);
          return (
            <CoupleCard
              key={c.id}
              couple={c}
              maleBague={m?.bague ?? "—"}
              femaleBague={f?.bague ?? "—"}
              onOpen={() => setDetailId(c.id)}
              onDissolve={() => dissolve(c.id)}
            />
          );
        })}
        {activeCouples.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">
            Aucun couple.
          </p>
        )}
      </div>

      <CoupleDetailSheet
        open={detailId != null}
        onOpenChange={(o) => {
          if (!o) setDetailId(null);
        }}
        couple={detailCouple}
        pigeons={pigeons}
        reproductions={reproductions}
      />
    </div>
  );
}

function CoupleCard({ couple, maleBague, femaleBague, onOpen, onDissolve }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="bg-card rounded-2xl p-5 border border-border cursor-pointer transition hover:border-primary/40 hover:ring-1 hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cage-couple/30 text-cage-couple-foreground flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display text-lg font-bold">#{couple.id}</div>
            <div className="text-xs text-muted-foreground">
              Formé le {new Date(couple.formed_at).toLocaleDateString("fr-FR")}
            </div>
          </div>
        </div>
        <Badge variant={couple.active ? "default" : "outline"}>
          {couple.active ? "actif" : "dissous"}
        </Badge>
      </div>

      <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-muted">
        <div className="text-center flex-1">
          <div className="font-bold">♂ Mâle</div>
          <div className="text-xs text-muted-foreground">{maleBague}</div>
        </div>
        <Heart className="w-4 h-4 text-primary" />
        <div className="text-center flex-1">
          <div className="font-bold">♀ Femelle</div>
          <div className="text-xs text-muted-foreground">{femaleBague}</div>
        </div>
      </div>

      {couple.active && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-destructive hover:bg-destructive/10"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDissolve();
          }}
        >
          Dissoudre le couple
        </Button>
      )}
    </div>
  );
}

function CoupleDetailSheet({ open, onOpenChange, couple, pigeons, reproductions }) {
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    setHistoryOpen(false);
  }, [couple?.id]);

  // Le backend renvoie male et female comme des objets complets
  const m = couple 
    ? (typeof couple.male === 'object' ? couple.male : pigeons.find((p) => p.id === couple.male))
    : undefined;
  const f = couple 
    ? (typeof couple.female === 'object' ? couple.female : pigeons.find((p) => p.id === couple.female))
    : undefined;
  const maleBague = m?.bague ?? "—";
  const femaleBague = f?.bague ?? "—";

  const historyItems = useMemo(() => {
    if (!couple) return [];
    return buildCoupleHistoryLines(couple, maleBague, femaleBague, reproductions);
  }, [couple, maleBague, femaleBague, reproductions]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l p-0 sm:max-w-md"
      >
        {couple && (
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b px-6 pb-4 pt-2">
              <div className="flex items-start justify-between gap-2 pr-8">
                <SheetTitle className="font-display text-xl">
                  Couple n°{couple.id}
                </SheetTitle>
              </div>
              <Badge
                className="mt-2 w-fit"
                variant={couple.active ? "default" : "outline"}
              >
                {couple.active ? "actif" : "dissous"}
              </Badge>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
              <section>
                <h3 className="mb-3 text-sm font-semibold tracking-tight">
                  Composition
                </h3>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4">
                  <div className="text-center flex-1 text-sm">
                    <div className="font-bold text-base">♂ Mâle</div>
                    <div className="text-xs text-muted-foreground mt-1">{maleBague}</div>
                    {m && (
                      <div className="text-xs text-muted-foreground">
                        {m.race}
                      </div>
                    )}
                  </div>
                  <Heart className="h-5 w-5 shrink-0 text-primary" />
                  <div className="text-center flex-1 text-sm">
                    <div className="font-bold text-base">♀ Femelle</div>
                    <div className="text-xs text-muted-foreground mt-1">{femaleBague}</div>
                    {f && (
                      <div className="text-xs text-muted-foreground">
                        {f.race}
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Formé le {new Date(couple.formed_at).toLocaleDateString("fr-FR")}
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold tracking-tight">
                  Historique
                </h3>
                {historyItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun événement enregistré pour l'instant.
                  </p>
                ) : (
                  <>
                    <ul className="relative space-y-3 border-l-2 border-muted pl-4">
                      {(historyOpen ? historyItems : historyItems.slice(0, 4)).map(
                        (h, i) => (
                          <li key={`${h.iso}-${i}`} className="text-sm">
                            <span className="font-medium text-foreground">
                              {formatHistoryDate(h.iso)}
                            </span>
                            <span className="text-muted-foreground">
                              {" : "}
                              {h.label}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                    {historyItems.length > 4 && (
                      <button
                        type="button"
                        className="mt-2 text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
                        onClick={() => setHistoryOpen(!historyOpen)}
                      >
                        {historyOpen
                          ? "Réduire l'historique"
                          : "Voir tout l'historique"}
                      </button>
                    )}
                  </>
                )}
              </section>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CoupleForm({ onClose, onSuccess }) {
  const { data: couples = [] } = useGetCouplesQuery();
  const { data: pigeons = [] } = useGetPigeonsQuery();
  const [createCouple, { isLoading }] = useCreateCoupleMutation();

  const usedIds = new Set(
    couples
      .filter((c) => c.active)
      .flatMap((c) => [c.male, c.female])
  );

  const males = pigeons.filter(
    (p) => p.sex === "M" && p.status === "actif" && !usedIds.has(p.id)
  );
  const femelles = pigeons.filter(
    (p) => p.sex === "F" && p.status === "actif" && !usedIds.has(p.id)
  );

  const [maleId, setMaleId] = useState("");
  const [femaleId, setFemaleId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const submit = async (e) => {
    e.preventDefault();
    if (!maleId || !femaleId) return;

    try {
      await createCouple({
        male_id: parseInt(maleId, 10),
        female_id: parseInt(femaleId, 10),
        formed_at: date,
      }).unwrap();

      setMaleId("");
      setFemaleId("");
      setDate(new Date().toISOString().slice(0, 10));
      onClose();
      if (onSuccess) onSuccess();
      toast.success("Couple créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création du couple:", error);
      toast.error("Erreur lors de la création du couple");
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">
          Former un couple
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Mâle</Label>
          <Select value={maleId} onValueChange={setMaleId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner…" />
            </SelectTrigger>
            <SelectContent>
              {males.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Aucun mâle disponible
                </div>
              )}
              {males.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.bague} — {p.race}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Femelle</Label>
          <Select value={femaleId} onValueChange={setFemaleId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner…" />
            </SelectTrigger>
            <SelectContent>
              {femelles.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Aucune femelle disponible
                </div>
              )}
              {femelles.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.bague} — {p.race}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Date de formation</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Créer"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
