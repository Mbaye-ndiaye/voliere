import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { Toaster } from "@/components/ui/sonner";
import { AppLayout } from "@/components/AppLayout";
import IndexRedirect from "@/pages/index.jsx";
import LoginPage from "@/pages/login.jsx";
import Dashboard from "@/pages/app.dashboard.jsx";
import CagesPage from "@/pages/app.cages.jsx";
import PigeonsPage from "@/pages/app.pigeons.jsx";
import CouplesPage from "@/pages/app.couples.jsx";
import ReproductionsPage from "@/pages/app.reproductions.jsx";
import SortiesPage from "@/pages/app.sorties.jsx";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cages" element={<CagesPage />} />
            <Route path="pigeons" element={<PigeonsPage />} />
            <Route path="couples" element={<CouplesPage />} />
            <Route path="reproductions" element={<ReproductionsPage />} />
            <Route path="sorties" element={<SortiesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster richColors position="top-center" />
      </BrowserRouter>
    </Provider>
  );
}
