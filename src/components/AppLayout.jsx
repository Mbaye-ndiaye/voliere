import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "@/lib/redux/authSlice";
import { voliereApi } from "@/lib/redux/voliereApi";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { LayoutDashboard, Bird, Heart, Baby, LogOut, Grid3x3, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/app/cages", label: "Volière", icon: Grid3x3 },
  { to: "/app/pigeons", label: "Pigeons", icon: Bird },
  { to: "/app/couples", label: "Couples", icon: Heart },
  { to: "/app/reproductions", label: "Reproductions", icon: Baby },
  { to: "/app/sorties", label: "Sorties", icon: DoorOpen },
];

export function AppLayout() {
  const email = useAppSelector((s) => s.auth.email);
  const username = email ? email.split("@")[0] : "Utilisateur";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(voliereApi.util.resetApiState());
    navigate("/login");
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="font-display text-2xl font-bold">Volière</h1>
          <p className="text-xs opacity-70 mt-1">Gestion colombophile</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = location.pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "hover:bg-sidebar-accent/50",
                )}
              >
                <Icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2 text-xs opacity-70">
            Connecté: <span className="font-medium opacity-100">{username}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-sidebar text-sidebar-foreground">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="font-display text-lg font-bold">Volière</h1>
          <button type="button" onClick={handleLogout} className="text-xs opacity-80">
            Déconnexion
          </button>
        </div>
        <nav className="flex overflow-x-auto gap-1 px-2 pb-2">
          {nav.map((n) => {
            const active = location.pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs whitespace-nowrap",
                  active ? "bg-sidebar-accent" : "opacity-80",
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="flex-1 overflow-x-hidden pt-28 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}