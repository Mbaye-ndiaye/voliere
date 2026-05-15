import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function resolveApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL?.trim?.();

  if (!raw) {
    throw new Error("VITE_API_URL is missing");
  }

  return raw.replace(/\/+$/, "");
}

const baseUrl = resolveApiBaseUrl();
function unwrapPaginated(response) {
    if (Array.isArray(response))
        return response;
    return response.results ?? [];
}
export const voliereApi = createApi({
    reducerPath: "voliereApi",
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            let token = null;
            try {
                const st = getState();
                token = st.auth?.accessToken ?? null;
            }
            catch {
                /* getState indisponible */
            }
            if (!token && typeof window !== "undefined") {
                try {
                    token = localStorage.getItem("access_token");
                }
                catch {
                    token = null;
                }
            }
            if (token)
                headers.set("Authorization", `Bearer ${token}`);
            headers.set("Accept", "application/json");
            return headers;
        },
    }),
    tagTypes: ["Pigeon", "Couple", "Reproduction", "Sortie", "Cage", "CageHistory", "Stats"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: "/auth/login/",
                method: "POST",
                body,
            }),
        }),
        getStats: builder.query({
            query: () => "/dashboard/stats/",
            transformResponse: (r) => ({
                pigeons: r.total_pigeons,
                couples: r.active_couples,
                reproductions: r.total_reproductions,
                sorties: r.total_sorties ?? 0,
                cages: r.cages_total,
            }),
            providesTags: [{ type: "Stats", id: "STATS" }],
        }),
        getPigeons: builder.query({
            query: () => "/pigeons/",
            transformResponse: (r) => unwrapPaginated(r),
            providesTags: (result) => result
                ? [
                    ...result.map(({ id }) => ({ type: "Pigeon", id })),
                    { type: "Pigeon", id: "LIST" },
                ]
                : [{ type: "Pigeon", id: "LIST" }],
        }),
        createPigeon: builder.mutation({
            query: (body) => ({
                url: "/pigeons/",
                method: "POST",
                body: {
                    ...body,
                    status: body.status ?? "actif",
                    parent_male: body.parent_male ?? null,
                    parent_female: body.parent_female ?? null,
                },
            }),
            invalidatesTags: [{ type: "Pigeon", id: "LIST" }, { type: "Stats", id: "STATS" }],
        }),
        updatePigeon: builder.mutation({
            query: ({ id, patch }) => ({
                url: `/pigeons/${id}/`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (_r, _e, { id }) => [
                { type: "Pigeon", id },
                { type: "Pigeon", id: "LIST" },
                { type: "Stats", id: "STATS" },
            ],
        }),
        getCouples: builder.query({
            query: () => "/couples/",
            transformResponse: (r) => unwrapPaginated(r),
            providesTags: (result) => result
                ? [
                    ...result.map(({ id }) => ({ type: "Couple", id })),
                    { type: "Couple", id: "LIST" },
                ]
                : [{ type: "Couple", id: "LIST" }],
        }),
        createCouple: builder.mutation({
            query: (body) => ({
                url: "/couples/",
                method: "POST",
                body: { ...body, active: body.active ?? true },
            }),
            invalidatesTags: [{ type: "Couple", id: "LIST" }, { type: "Stats", id: "STATS" }],
        }),
        updateCouple: builder.mutation({
            query: ({ id, patch }) => ({
                url: `/couples/${id}/`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (_r, _e, { id }) => [
                { type: "Couple", id },
                { type: "Couple", id: "LIST" },
                { type: "Stats", id: "STATS" },
            ],
        }),
        getReproductions: builder.query({
            query: () => "/reproductions/",
            transformResponse: (r) => {
                const list = unwrapPaginated(r);
                return list.map((row) => ({
                    ...row,
                    baby_ids: Array.isArray(row.baby_ids) && row.baby_ids.length > 0
                        ? row.baby_ids
                        : Array.isArray(row.babies)
                            ? row.babies
                            : [],
                }));
            },
            providesTags: (result) => result
                ? [
                    ...result.map(({ id }) => ({ type: "Reproduction", id })),
                    { type: "Reproduction", id: "LIST" },
                ]
                : [{ type: "Reproduction", id: "LIST" }],
        }),
        createReproduction: builder.mutation({
            query: (body) => ({
                url: "/reproductions/",
                method: "POST",
                body: {
                    couple: body.couple,
                    pond_date: body.pond_date,
                    hatch_date: body.hatch_date ?? null,
                    count: body.count,
                    baby_ids: body.baby_ids ?? [],
                },
            }),
            invalidatesTags: [{ type: "Reproduction", id: "LIST" }, { type: "Stats", id: "STATS" }],
        }),
        getSorties: builder.query({
            query: () => "/sorties/",
            transformResponse: (r) => unwrapPaginated(r),
            providesTags: (result) => result
                ? [
                    ...result.map(({ id }) => ({ type: "Sortie", id })),
                    { type: "Sortie", id: "LIST" },
                ]
                : [{ type: "Sortie", id: "LIST" }],
        }),
        createSortie: builder.mutation({
            query: (body) => ({
                url: "/sorties/",
                method: "POST",
                body: {
                    pigeon: body.pigeon,
                    type: body.type,
                    date: body.date,
                    /* Django : CharField sans null=True — chaîne vide, pas null. */
                    buyer: body.buyer === undefined || body.buyer === null || String(body.buyer).trim() === ""
                        ? ""
                        : String(body.buyer),
                    price: body.price === undefined || body.price === null || body.price === ""
                        ? null
                        : String(body.price),
                    reason: body.reason === undefined || body.reason === null || String(body.reason).trim() === ""
                        ? ""
                        : String(body.reason),
                },
            }),
            invalidatesTags: [
                { type: "Sortie", id: "LIST" },
                { type: "Pigeon", id: "LIST" },
                { type: "Cage", id: "LIST" },
                { type: "Stats", id: "STATS" },
            ],
        }),
         addCage: builder.mutation({
        query: (body) => ({
            url: "/cages/",
            method: "POST",
            body: {
            code: body.code,
            pigeon: body.pigeon ?? null,
            couple: body.couple ?? null,
            },
        }),
        invalidatesTags: [
            { type: "Cage", id: "LIST" },
            { type: "Stats", id: "STATS" },
        ],
        }),
        getCages: builder.query({
            query: () => "/cages/",
            transformResponse: (r) => unwrapPaginated(r),
            providesTags: (result) => result
                ? [
                    ...result.map(({ id }) => ({ type: "Cage", id })),
                    { type: "Cage", id: "LIST" },
                ]
                : [{ type: "Cage", id: "LIST" }],
        }),
        getCageHistory: builder.query({
            query: (cageId) => `/cages/${cageId}/history/`,
            transformResponse: (r) => Array.isArray(r) ? r : unwrapPaginated(r),
            providesTags: (_result, _err, cageId) => [{ type: "CageHistory", id: cageId }],
        }),
        createCageHistoryEvent: builder.mutation({
            query: ({ cageId, kind }) => ({
                url: `/cages/${cageId}/history/`,
                method: "POST",
                body: { kind },
            }),
            invalidatesTags: (_r, _e, { cageId }) => [{ type: "CageHistory", id: cageId }],
        }),
        updateCage: builder.mutation({
            query: ({ id, patch }) => ({
                url: `/cages/${id}/`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (_r, _e, { id }) => [
                { type: "Cage", id },
                { type: "Cage", id: "LIST" },
                { type: "CageHistory", id },
                { type: "Stats", id: "STATS" },
            ],
        }),
    }),

   
});


export const { useLoginMutation, useGetStatsQuery, useGetPigeonsQuery, useCreatePigeonMutation, useUpdatePigeonMutation, useGetCouplesQuery, useCreateCoupleMutation, useUpdateCoupleMutation, useGetReproductionsQuery, useCreateReproductionMutation, useGetSortiesQuery, useCreateSortieMutation, useGetCagesQuery, useGetCageHistoryQuery, useCreateCageHistoryEventMutation, useUpdateCageMutation,useAddCageMutation, } = voliereApi;
