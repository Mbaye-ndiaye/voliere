import { createSlice } from "@reduxjs/toolkit";
function readLs(key) {
    try {
        if (typeof window === "undefined")
            return null;
        return localStorage.getItem(key);
    }
    catch {
        return null;
    }
}
function writeLs(key, value) {
    try {
        if (typeof window === "undefined")
            return;
        localStorage.setItem(key, value);
    }
    catch {
        /* navigateur privé, worker, quota… */
    }
}
function clearLs(keys) {
    try {
        if (typeof window === "undefined")
            return;
        keys.forEach((k) => localStorage.removeItem(k));
    }
    catch {
        /* idem */
    }
}
const initialState = {
    accessToken: readLs("access_token"),
    refreshToken: readLs("refresh_token"),
    username: readLs("username"),
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action) {
            state.accessToken = action.payload.access;
            state.refreshToken = action.payload.refresh;
            state.username = action.payload.username;
            writeLs("access_token", action.payload.access);
            writeLs("refresh_token", action.payload.refresh);
            writeLs("username", action.payload.username);
        },
        logout(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.username = null;
            clearLs(["access_token", "refresh_token", "username"]);
        },
    },
});
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
