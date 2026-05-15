import { configureStore } from "@reduxjs/toolkit";
import { voliereApi } from "./voliereApi";
import authReducer from "./authSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        [voliereApi.reducerPath]: voliereApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(voliereApi.middleware),
});
