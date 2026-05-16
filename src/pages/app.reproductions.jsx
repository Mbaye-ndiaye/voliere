import { useState } from "react";
import {
  useCreateReproductionMutation,
  useGetCouplesQuery,
  useGetPigeonsQuery,
  useGetReproductionsQuery,
} from "@/lib/redux/voliereApi";
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
import { Baby, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function ReproductionsPage() {
  const { data: reproductions = [], isLoading } = useGetReproductionsQuery();
  const { data: couples = [] } = useGetCouplesQuery();
  const { data: pigeons = [] } = useGetPigeonsQuery();
  const [open, setOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const detailRepro = detailId != null 
    ? reproductions.find((r) => r.id === detailId) ?? null 
    : null;

  if (isLoading) {
    return (
      <div className="text-muted-foreground">
        Chargement des reproductions…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-bold">Reproductions</h1>
          <p className="text-muted-foreground mt-1">
            {reproductions.length} portées
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" /> Nouvelle portée
            </Button>
          </DialogTrigger>
          <ReproForm onClose={() => setOpen(false)} />
        </Dialog>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {reproductions.map((r) => {
          const couple = couples.find((c) => c.id === r.couple);
          // Le backend renvoie male et female comme des objets complets
          const m = couple 
            ? (typeof couple.male === 'object' ? couple.male : pigeons.find((p) => p.id === couple.male))
            : undefined;
          const f = couple 
            ? (typeof couple.female === 'object' ? couple.female : pigeons.find((p) => p.id === couple.female))
            : undefined;

          return (
            <div
              key={r.id}
              role="button"
              tabIndex={0}
              onClick={() => setDetailId(r.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setDetailId(r.id);
                }
              }}
              className="bg-card rounded-2xl p-5 border border-border cursor-pointer transition hover:border-primary/40 hover:ring-1 hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-bold">#{r.id}</div>
                  <div className="text-xs text-muted-foreground">
                    Couple #{r.couple} · {m?.bague} × {f?.bague}
                  </div>
                </div>
              </div>

              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Ponte</dt>
                  <dd>{new Date(r.pond_date).toLocaleDateString("fr-FR")}</dd>
                </div>
                {r.hatch_date && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Éclosion</dt>
                    <dd>
                      {new Date(r.hatch_date).toLocaleDateString("fr-FR")}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Pigeonneaux</dt>
                  <dd className="font-medium">{r.count}</dd>
                </div>
              </dl>
            </div>
          );
        })}
        {reproductions.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">
            Aucune reproduction enregistrée.
          </p>
        )}
      </div>

      <ReproductionDetailSheet
        open={detailId != null}
        onOpenChange={(o) => {
          if (!o) setDetailId(null);
        }}
        reproduction={detailRepro}
        couples={couples}
        pigeons={pigeons}
      />
    </div>
  );
}

function ReproductionDetailSheet({ open, onOpenChange, reproduction, couples, pigeons }) {
  if (!reproduction) return null;

  const couple = couples.find((c) => c.id === reproduction.couple);
  const m = couple 
    ? (typeof couple.male === 'object' ? couple.male : pigeons.find((p) => p.id === couple.male))
    : undefined;
  const f = couple 
    ? (typeof couple.female === 'object' ? couple.female : pigeons.find((p) => p.id === couple.female))
    : undefined;

  // Calculer la durée d'incubation si les deux dates sont présentes
  const incubationDays = reproduction.hatch_date && reproduction.pond_date
    ? Math.floor((new Date(reproduction.hatch_date) - new Date(reproduction.pond_date)) / (1000 * 60 * 60 * 24))
    : null;

  // Trouver les bébés si disponibles
  const babies = reproduction.baby_ids 
    ? pigeons.filter(p => reproduction.baby_ids.includes(p.id))
    : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l p-0 sm:max-w-md"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b px-6 pb-4 pt-2">
            <div className="flex items-start justify-between gap-2 pr-8">
              <SheetTitle className="font-display text-xl">
                Reproduction n°{reproduction.id}
              </SheetTitle>
            </div>
            <Badge className="mt-2 w-fit" variant="default">
              {reproduction.count} pigeonneau{reproduction.count > 1 ? "x" : ""}
            </Badge>
          </SheetHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
            {/* Informations du couple */}
            <section>
              <h3 className="mb-3 text-sm font-semibold tracking-tight">
                Couple parental
              </h3>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="text-center mb-3">
                  <div className="text-sm font-medium">Couple #{reproduction.couple}</div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-center flex-1 text-sm">
                    <div className="font-bold text-base">♂ Mâle</div>
                    <div className="text-xs text-muted-foreground mt-1">{m?.bague ?? "—"}</div>
                    {m && (
                      <div className="text-xs text-muted-foreground">
                        {m.race}
                      </div>
                    )}
                  </div>
                  <div className="text-2xl">×</div>
                  <div className="text-center flex-1 text-sm">
                    <div className="font-bold text-base">♀ Femelle</div>
                    <div className="text-xs text-muted-foreground mt-1">{f?.bague ?? "—"}</div>
                    {f && (
                      <div className="text-xs text-muted-foreground">
                        {f.race}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Dates importantes */}
            <section>
              <h3 className="mb-3 text-sm font-semibold tracking-tight">
                Chronologie
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Date de ponte</span>
                  <span className="font-medium">
                    {new Date(reproduction.pond_date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {reproduction.hatch_date && (
                  <>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Date d'éclosion</span>
                      <span className="font-medium">
                        {new Date(reproduction.hatch_date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    {incubationDays && (
                      <div className="flex justify-between items-center p-3 rounded-lg bg-accent/20">
                        <span className="text-sm text-muted-foreground">Durée d'incubation</span>
                        <span className="font-medium">
                          {incubationDays} jour{incubationDays > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {!reproduction.hatch_date && (
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      En attente d'éclosion
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Pigeonneaux */}
            <section>
              <h3 className="mb-3 text-sm font-semibold tracking-tight">
                Pigeonneaux ({reproduction.count})
              </h3>
              {babies.length > 0 ? (
                <div className="space-y-2">
                  {babies.map((baby) => (
                    <div
                      key={baby.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center">
                        <Baby className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{baby.bague}</div>
                        <div className="text-xs text-muted-foreground">
                          {baby.race} • {baby.sex === "M" ? "Mâle" : "Femelle"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                  Aucun pigeonneau enregistré
                </div>
              )}
            </section>

            {/* Notes */}
            {reproduction.notes && (
              <section>
                <h3 className="mb-3 text-sm font-semibold tracking-tight">
                  Notes
                </h3>
                <div className="p-3 rounded-lg bg-muted/50 text-sm">
                  {reproduction.notes}
                </div>
              </section>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ReproForm({ onClose }) {
  const { data: couples = [] } = useGetCouplesQuery();
  const { data: pigeons = [] } = useGetPigeonsQuery();
  const [createReproduction, { isLoading }] = useCreateReproductionMutation();

  const [coupleId, setCoupleId] = useState("");
  const [pondDate, setPondDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [hatchDate, setHatchDate] = useState("");
  const [count, setCount] = useState(2);

  const couplesActifs = couples.filter((c) => c.active);

  const submit = async (e) => {
    e.preventDefault();
    if (!coupleId) return;

    try {
      await createReproduction({
        couple: parseInt(coupleId, 10),
        pond_date: pondDate,
        hatch_date: hatchDate || null,
        count,
        baby_ids: [],
      }).unwrap();

      onClose();
      toast.success("Reproduction enregistrée avec succès");
    } catch (error) {
      console.error("Erreur lors de la création de la reproduction:", error);
      toast.error("Erreur lors de l'enregistrement de la reproduction");
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">
          Nouvelle reproduction
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Couple</Label>
          <Select value={coupleId} onValueChange={setCoupleId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner…" />
            </SelectTrigger>
            <SelectContent>
              {couplesActifs.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Aucun couple actif
                </div>
              )}
              {couplesActifs.map((c) => {
                // Le backend renvoie male et female comme des objets complets
                const m = typeof c.male === 'object' ? c.male : pigeons.find((p) => p.id === c.male);
                const f = typeof c.female === 'object' ? c.female : pigeons.find((p) => p.id === c.female);
                return (
                  <SelectItem key={c.id} value={String(c.id)}>
                    #{c.id} ({m?.bague} × {f?.bague})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Date de ponte</Label>
            <Input
              type="date"
              value={pondDate}
              onChange={(e) => setPondDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Date d'éclosion</Label>
            <Input
              type="date"
              value={hatchDate}
              onChange={(e) => setHatchDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Nombre de pigeonneaux</Label>
          <Input
            type="number"
            min={0}
            max={10}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            required
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            Enregistrer
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default ReproductionsPage;
