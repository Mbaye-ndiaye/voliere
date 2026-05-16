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
import { Baby, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ReproductionsPage() {
  const { data: reproductions = [], isLoading } = useGetReproductionsQuery();
  const { data: couples = [] } = useGetCouplesQuery();
  const { data: pigeons = [] } = useGetPigeonsQuery();
  const [open, setOpen] = useState(false);

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
              className="bg-card rounded-2xl p-5 border border-border"
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
    </div>
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

    await createReproduction({
      couple: parseInt(coupleId, 10),
      pond_date: pondDate,
      hatch_date: hatchDate || null,
      count,
      baby_ids: [],
    }).unwrap();

    onClose();
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
