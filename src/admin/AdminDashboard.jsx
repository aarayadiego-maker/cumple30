export default function AdminDashboard({ rows }) {
  let confirmados = 0;
  let noAsisten = 0;
  let totalAcompanantes = 0;
  let necesitanVan = 0;
  const vanPorComuna = {};
  let vanABailar = 0;

  for (const r of rows) {
    // En este modelo, cada fila = una familia/grupo que SÍ confirmó
    // asistencia (el formulario público solo permite confirmar "voy",
    // no "no voy" -- si agregas esa opción, ajusta este conteo).
    confirmados += 1;
    const acompanantes = (r.companions ?? []).length;
    totalAcompanantes += acompanantes;

    if (r.needs_transport === "Sí") {
      necesitanVan += 1;
      const comuna = r.comuna_other || r.comuna || "Sin especificar";
      vanPorComuna[comuna] = (vanPorComuna[comuna] ?? 0) + 1;
    }
    if (r.dance === "Sí o sí") vanABailar += 1;
  }

  const totalAsistentes = confirmados + totalAcompanantes;

  return (
    <>
      <section className="admin-stats">
        <div className="stat-card">
          <span className="stat-num">{rows.length}</span>
          <span className="stat-label">Total de respuestas</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{confirmados}</span>
          <span className="stat-label">Invitados confirmados</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{noAsisten}</span>
          <span className="stat-label">No asistirán</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{totalAcompanantes}</span>
          <span className="stat-label">Total de acompañantes</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{totalAsistentes}</span>
          <span className="stat-label">Total estimado de asistentes</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{necesitanVan}</span>
          <span className="stat-label">Necesitan van</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{vanABailar}</span>
          <span className="stat-label">Van a bailar</span>
        </div>
      </section>

      {Object.keys(vanPorComuna).length > 0 && (
        <section className="admin-comunas">
          <h3>Van por comuna</h3>
          <ul>
            {Object.entries(vanPorComuna).map(([comuna, cantidad]) => (
              <li key={comuna}><strong>{comuna}</strong>: {cantidad}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
