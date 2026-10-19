import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRsvps } from "../hooks/useRsvps";
import { useEventConfig } from "../hooks/useEventConfig";
import AdminLogin from "../admin/AdminLogin";
import AdminDashboard from "../admin/AdminDashboard";
import AdminGuestsTable from "../admin/AdminGuestsTable";
import AdminEventConfig from "../admin/AdminEventConfig";
import AdminPreview from "../admin/AdminPreview";

const TABS = ["Dashboard", "Invitados", "Configuración", "Vista previa"];

export default function AdminPage() {
  const { session, loading, error, login, logout } = useAuth();
  const [tab, setTab] = useState("Dashboard");

  if (loading) {
    return (
      <div className="admin-body">
        <p className="apoyo" style={{ textAlign: "center" }}>Cargando...</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLogin={login} error={error} />;
  }

  return <AdminPanel tab={tab} setTab={setTab} onLogout={logout} />;
}

function AdminPanel({ tab, setTab, onLogout }) {
  const { rows, loading: cargandoRsvps } = useRsvps();
  const { config, guardar } = useEventConfig();

  return (
    <div className="admin-body">
      <header className="admin-header">
        <h2>Panel de administración</h2>
        <div className="admin-actions">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={`btn ${tab === t ? "btn-primary" : "btn-secondary"} admin-btn-link`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
          <button type="button" className="btn btn-secondary admin-btn-link" onClick={onLogout}>
            Salir
          </button>
        </div>
      </header>

      {cargandoRsvps ? (
        <p className="apoyo" style={{ textAlign: "center" }}>Cargando datos...</p>
      ) : (
        <>
          {tab === "Dashboard" && <AdminDashboard rows={rows} />}
          {tab === "Invitados" && <AdminGuestsTable rows={rows} />}
          {tab === "Configuración" && <AdminEventConfig config={config} onGuardar={guardar} />}
          {tab === "Vista previa" && <AdminPreview />}
        </>
      )}
    </div>
  );
}
