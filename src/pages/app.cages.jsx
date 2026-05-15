import React, { useMemo, useState } from "react";
import {
  Bird,
  Filter,
  Home,
  LayoutGrid,
  List,
  User,
  Users,
} from "lucide-react";

import { useGetCagesQuery, useGetPigeonsQuery, useGetCouplesQuery } from "@/lib/redux/voliereApi";

function cageDisplayId(code) {
  return code;
}

function pigeonAgeLabel(birthDate) {
  if (!birthDate) return "—";

  const d = new Date(birthDate);

  if (Number.isNaN(d.getTime())) return "—";

  const now = new Date();

  let y = now.getFullYear() - d.getFullYear();

  const md = now.getMonth() - d.getMonth();

  if (md < 0 || (md === 0 && now.getDate() < d.getDate())) {
    y--;
  }

  return y <= 0 ? "< 1 an" : `${y} an${y > 1 ? "s" : ""}`;
}

function cageState(cage) {
  if (cage.couple) return "couple";
  if (cage.pigeon) return "pigeon";
  return "libre";
}

export default function CagesPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");
  const { data: cages = [], isLoading } = useGetCagesQuery();
  const { data: pigeons = [] } = useGetPigeonsQuery();
  const { data: couples = [] } = useGetCouplesQuery();
  
  const cagesFormatted = useMemo(() => {
    return cages.map((cage) => ({
      ...cage,
      pigeon: cage.pigeon,
      couple: cage.couple
        ? {
            ...cage.couple,
            male: cage.couple.male,
            female: cage.couple.female,
          }
        : null,
    }));
  }, [cages]);
  
  const sortedCages = useMemo(() => {
    return [...cages].sort((a, b) =>
      a.code.localeCompare(b.code, undefined, {
        numeric: true,
      })
    );
  }, [cages]);

  const filteredCages = useMemo(() => {
    if (filter === "all") return sortedCages;
    return sortedCages.filter((c) => cageState(c) === filter);
  }, [sortedCages, filter]);

  const selected =
    selectedId != null
      ? cages.find((c) => c.id === selectedId)
      : null;

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* HEADER */}
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white p-2 shadow">
              <Home className="h-5 w-5" />
            </div>

            <h1 className="text-3xl font-bold">
              Volière A
            </h1>
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              Libre
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              1 pigeon
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500"></span>
              Couple
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border bg-white px-3 py-2"
          >
            <option value="all">Toutes les cages</option>
            <option value="libre">Libres</option>
            <option value="pigeon">1 pigeon</option>
            <option value="couple">Couples</option>
          </select>

          <div className="flex overflow-hidden rounded-lg border bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-sky-500 text-white"
                  : ""
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-sky-500 text-white"
                  : ""
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* GRID VIEW */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {filteredCages.map((cage) => (
            <CageTile
              key={cage.id}
              cage={cage}
              selected={selectedId === cage.id}
              onClick={() =>
                setSelectedId(
                  selectedId === cage.id ? null : cage.id
                )
              }
            />
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">
                  Cage
                </th>

                <th className="px-4 py-3 text-left">
                  Statut
                </th>

                <th className="px-4 py-3 text-left">
                  Détails
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCages.map((cage) => {
                const st = cageState(cage);

                return (
                  <tr
                    key={cage.id}
                    className="cursor-pointer border-t hover:bg-gray-50"
                    onClick={() =>
                      setSelectedId(cage.id)
                    }
                  >
                    <td className="px-4 py-3 font-bold">
                      {cage.code}
                    </td>

                    <td className="px-4 py-3">
                      {st === "libre" && (
                        <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                          Libre
                        </span>
                      )}

                      {st === "pigeon" && (
                        <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">
                          1 pigeon
                        </span>
                      )}

                      {st === "couple" && (
                        <span className="rounded bg-orange-100 px-2 py-1 text-sm text-orange-700">
                          Couple
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {st === "pigeon" &&
                        cage.pigeon?.bague}

                      {st === "couple" &&
                        `${cage.couple?.male?.bague} + ${cage.couple?.female?.bague}`}

                      {st === "libre" && "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL PANEL */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ${
          selected ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selected && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-2xl font-bold">
                  Cage {selected.code}
                </h2>

                {cageState(selected) === "libre" && (
                  <span className="mt-2 inline-block rounded bg-green-100 px-3 py-1 text-sm text-green-700">
                    Libre
                  </span>
                )}

                {cageState(selected) === "pigeon" && (
                  <span className="mt-2 inline-block rounded bg-red-100 px-3 py-1 text-sm text-red-700">
                    1 pigeon
                  </span>
                )}

                {cageState(selected) === "couple" && (
                  <span className="mt-2 inline-block rounded bg-orange-100 px-3 py-1 text-sm text-orange-700">
                    Couple
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedId(null)}
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
              >
                Fermer
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {selected.pigeon && (
                <PigeonMiniCard pigeon={selected.pigeon} />
              )}

              {selected.couple && (
                <div className="space-y-3">
                  <PigeonMiniCard
                    pigeon={{
                      ...selected.couple.male,
                      sex: "M",
                    }}
                  />

                  <PigeonMiniCard
                    pigeon={{
                      ...selected.couple.female,
                      sex: "F",
                    }}
                  />
                </div>
              )}

              {cageState(selected) === "libre" && (
                <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500">
                  Cage vide
                </div>
              )}

              {/* Section Historique - comme dans l'image */}
              <div className="mt-6 border-t pt-4">
                <h3 className="mb-3 font-semibold text-gray-700">Historique</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">12/03/2026</span>
                    <span className="text-gray-800">Couple affecté</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">05/02/2026</span>
                    <span className="text-gray-800">Cage nettoyée</span>
                  </div>
                  <button className="mt-2 text-sm text-sky-600 hover:underline">
                    Voir tout l'historique
                  </button>
                </div>
              </div>

              {/* Section Actions - comme dans l'image */}
              <div className="mt-6 border-t pt-4">
                <h3 className="mb-3 font-semibold text-gray-700">Actions</h3>
                <div className="flex flex-col gap-2">
                  <button className="rounded-lg bg-sky-500 px-4 py-2 text-left text-sm text-white hover:bg-sky-600">
                    Affecter un pigeon
                  </button>
                  <button className="rounded-lg bg-orange-500 px-4 py-2 text-left text-sm text-white hover:bg-orange-600">
                    Affecter un couple
                  </button>
                  <button className="rounded-lg bg-gray-500 px-4 py-2 text-left text-sm text-white hover:bg-gray-600">
                    Libérer la cage
                  </button>
                  <button className="rounded-lg border border-gray-300 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                    Voir historique complet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div
          onClick={() => setSelectedId(null)}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}
    </div>
  );
}

function CageTile({
  cage,
  selected,
  onClick,
}) {
  const st = cageState(cage);

  const styles =
    st === "libre"
      ? "border-green-300 bg-green-50 text-green-700"
      : st === "pigeon"
      ? "border-red-300 bg-red-50 text-red-700"
      : "border-orange-300 bg-orange-50 text-orange-700";

  return (
    <button
      onClick={onClick}
      className={`aspect-square rounded-2xl border-2 p-4 transition hover:scale-105 ${styles} ${
        selected
          ? "ring-4 ring-sky-400"
          : ""
      }`}
    >
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <span className="text-sm font-bold">
          {cageDisplayId(cage.code)}
        </span>

        {st === "libre" && (
          <Bird className="h-10 w-10" />
        )}

        {st === "pigeon" && (
          <Bird className="h-10 w-10 fill-current" />
        )}

        {st === "couple" && (
          <div className="flex">
            <Bird className="h-7 w-7 fill-current" />
            <Bird className="h-7 w-7 fill-current" />
          </div>
        )}

        <span className="text-center text-xs">
          {st === "libre" && "Libre"}

          {st === "pigeon" &&
            cage.pigeon?.bague}

          {st === "couple" &&
            `${cage.couple?.male?.bague} + ${cage.couple?.female?.bague}`}
        </span>
      </div>
    </button>
  );
}

function PigeonMiniCard({ pigeon }) {
  return (
    <div className="mb-3 flex gap-4 rounded-xl border bg-gray-50 p-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-200">
        <Bird className="h-8 w-8 text-gray-500" />
      </div>

      <div className="space-y-1">
        <div>
          <span
            className={`rounded px-2 py-1 text-xs ${
              pigeon.sex === "M"
                ? "bg-sky-100 text-sky-700"
                : "bg-pink-100 text-pink-700"
            }`}
          >
            {pigeon.sex === "M"
              ? "Mâle"
              : "Femelle"}
          </span>
        </div>

        <p>
          <strong>Bague :</strong>{" "}
          {pigeon.bague}
        </p>

        <p>
          <strong>Race :</strong>{" "}
          {pigeon.race || "—"}
        </p>

        <p>
          <strong>Âge :</strong>{" "}
          {pigeonAgeLabel(
            pigeon.birth_date
          )}
        </p>
      </div>
    </div>
  );
}