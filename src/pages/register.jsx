import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useRegisterMutation } from "@/lib/redux/voliereApi";
import { setCredentials } from "@/lib/redux/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bird } from "lucide-react";
import { toast } from "sonner";

function isRtkQueryRejected(err) {
  return typeof err === "object" && err !== null && "status" in err;
}

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      const data = await register({
        username,
        email,
        password,
      }).unwrap();

      if (!data?.access) {
        setError("Réponse API invalide : pas de jeton d'accès.");
        return;
      }

      // Connexion automatique après inscription
      dispatch(
        setCredentials({
          access: data.access,
          refresh: data.refresh ?? "",
          email: data.user?.email || email,
        })
      );

      toast.success("Compte créé avec succès !");
      navigate("/login");
    } catch (err) {
      console.error("Échec inscription:", err);
      let msg = "Erreur lors de la création du compte.";

      if (isRtkQueryRejected(err)) {
        if (err.status === "PARSING_ERROR") {
          msg = "Réponse du serveur illisible.";
        } else if (err.status === "FETCH_ERROR") {
          msg = "Impossible de joindre l'API (réseau ou CORS).";
        } else if (typeof err.status === "number" && err.status === 400) {
          const d = err.data;
          // Afficher les erreurs de validation
          if (d?.username) {
            msg = `Nom d'utilisateur : ${d.username[0]}`;
          } else if (d?.email) {
            msg = `Email : ${d.email[0]}`;
          } else if (d?.password) {
            msg = `Mot de passe : ${d.password[0]}`;
          } else {
            msg = "Données invalides. Vérifiez vos informations.";
          }
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
            <h2 className="font-display text-2xl">Créer un compte</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Inscrivez-vous pour commencer à gérer votre volière.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              minLength={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
              autoComplete="new-password"
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">
              Au moins 8 caractères
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
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
            {isLoading ? "Création en cours…" : "Créer mon compte"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Déjà un compte ? </span>
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
