import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoginMutation } from "@/lib/redux/voliereApi";
import { setCredentials } from "@/lib/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bird } from "lucide-react";
/** RTK Query rejette `unwrap()` avec un objet `{ status, data?, error? }` — pas d’export `isFetchBaseQueryError` dans toutes les versions du toolkit. */
function isRtkQueryRejected(err) {
    return typeof err === "object" && err !== null && "status" in err;
}
function LoginPage() {
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const accessToken = useAppSelector(
  (s) => s.auth.accessToken
    );
    useEffect(() => {
    if (accessToken) {
        navigate("/app/dashboard");
    }
    }, [accessToken, navigate]);
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await login({ email, password }).unwrap();
            if (!data?.access) {
                setError("Réponse API invalide : pas de jeton d’accès.");
                return;
            }
            dispatch(setCredentials({
                access: data.access,
                refresh: data.refresh ?? "",
                email: data.user?.email?.trim() || email.trim(),
            }));
            navigate("/app/dashboard");
        }
        catch (err) {
            console.error("Échec connexion:", err);
            let msg = "Identifiants incorrects ou serveur injoignable.";
            if (isRtkQueryRejected(err)) {
                if (err.status === "PARSING_ERROR") {
                    msg =
                        "Réponse du serveur illisible (JSON attendu sur /api/auth/login/). Ouvrez l’onglet Réponse du réseau.";
                }
                else if (err.status === "FETCH_ERROR") {
                    msg = "Impossible de joindre l’API (réseau ou CORS).";
                }
                else if (typeof err.status === "number" && err.status === 401) {
                    const d = err.data;
                    msg = d?.error ?? "Mot de passe ou utilisateur incorrect.";
                }
                else if (typeof err.status === "number") {
                    msg = `Erreur serveur (${err.status}).`;
                }
            }
            else if (err instanceof Error && err.message) {
                msg = err.message;
            }
            setError(msg);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-4", style: { background: "var(--gradient-hero)" }, children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg", style: { background: "var(--gradient-warm)" }, children: _jsx(Bird, { className: "w-8 h-8 text-primary-foreground" }) }), _jsx("h1", { className: "font-display text-4xl font-bold", children: "Voli\u00E8re" }), _jsx("p", { className: "text-muted-foreground mt-2", children: "Gestion intelligente de votre colombier" })] }), _jsxs("form", { onSubmit: onSubmit, className: "bg-card rounded-2xl p-8 space-y-5", style: { boxShadow: "var(--shadow-soft)" }, children: [_jsxs("div", { children: [_jsx("h2", { className: "font-display text-2xl", children: "Bienvenue" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Connectez-vous avec un compte Django (API JWT)." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Identifiant" }), _jsx(Input, { id: "email", type: "text", value: email, onChange: (e) => setemail(e.target.value), autoComplete: "email ", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Mot de passe" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), autoComplete: "current-password", required: true })] }), error && (_jsx("div", { className: "text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2", children: error })), _jsx(Button, { type: "submit", className: "w-full h-11 text-base", disabled: isLoading, children: isLoading ? "Connexion…" : "Se connecter" })] })] }) }));
}

export default LoginPage;
