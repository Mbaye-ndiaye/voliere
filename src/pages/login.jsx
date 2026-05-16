import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoginMutation } from "@/lib/redux/voliereApi";
import { setCredentials } from "@/lib/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bird } from "lucide-react";
import { toast } from "sonner";

/** RTK Query rejette `unwrap()` avec un objet `{ status, data?, error? }` */
function isRtkQueryRejected(err) {
  return typeof err === "object" && err !== null && "status" in err;
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  useEffect(() => {
    if (accessToken) {
      navigate("/app/dashboard");
    }
  }, [accessToken, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      // Envoyer email au lieu de username
      const data = await login({ email: email, password }).unwrap();
      
      if (!data?.access) {
        setError("Réponse API invalide : pas de jeton d'accès.");
        return;
      }
      
      dispatch(
        setCredentials({
          access: data.access,
          refresh: data.refresh ?? "",
          email: email.trim(),
        })
      );
      
      toast.success("Connexion réussie !");
      navigate("/app/dashboard");
    } catch (err) {
      console.error("Échec connexion:", err);
      let msg = "Identifiants incorrects ou serveur injoignable.";
      
      if (isRtkQueryRejected(err)) {
        if (err.status === "PARSING_ERROR") {
          msg = "Réponse du serveur illisible (JSON attendu sur /api/auth/login/).";
        } else if (err.status === "FETCH_ERROR") {
          msg = "Impossible de joindre l'API (réseau ou CORS).";
        } else if (typeof err.status === "number" && err.status === 401) {
          const d = err.data;
          msg = d?.error ?? "Mot de passe ou utilisateur incorrect.";
        } else if (typeof err.status === "number") {
          msg = `Erreur serveur (${err.status}).`;
        }
      } else if (err instanceof Error && err.message) {
        msg = err.message;
      }
      
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{ background: "var(--gradient-warm)" }}
          >
            <Bird className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold">Volière</h1>
          <p className="text-muted-foreground mt-2">
            Gestion intelligente de votre colombier
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-card rounded-2xl p-8 space-y-5"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div>
            <h2 className="font-display text-2xl">Bienvenue</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Connectez-vous avec un compte Django (API JWT).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Identifiant</Label>
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={isLoading}
          >
            {isLoading ? "Connexion…" : "Se connecter"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Pas encore de compte ? </span>
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              S'inscrire
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
