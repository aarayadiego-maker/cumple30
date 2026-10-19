import { useMemo, useState } from "react";
import { descargarCSV } from "../utils/csv";

export default function AdminGuestsTable({ rows }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroVan, setFiltroVan] = useState("todos");
  const [filtroBaile, setFiltroBaile] = useState("todos");
  const [orden, setOrden] = useState({ campo: "submitted_at", asc: false });

  const filasFiltradas = useMemo(() => {
    let resultado = [...rows];

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      resultado = resultado.filter((r) => r.guest_name.toLowerCase().includes(q));
    }
    if (filtroVan !== "todos") {
      resultado = resultado.filter((r) => r.needs_transport === filtroVan);
    }
    if (filtroBaile !== "todos") {
      resultado = resultado.filter((r) => r.dance === filtroBaile);
    }

    resultado.sort((a, b) => {
      const va = a[orden.campo] ?? "";
      const vb = b[orden.campo] ?? "";
      const cmp = String(va).localeCompare(String(vb));
      return orden.asc ? cmp : -cmp;
    });

    return resultado;
  }, [rows, busqueda, filtroVan, filtroBaile, orden]);

  function ordenarPor(campo) {
    setOrden((prev) =>
      prev.campo === campo ? { campo, asc: !prev.asc } : { campo, asc: true }
    );
  }

  return (
    <section className="admin-table-wrap" style={{ padding: "1rem" }}>
      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Buscar invitado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={filtroVan} onChange={(e) => setFiltroVan(e.target.value)}>
          <option value="todos">Van: todos</option>
          <option value="Sí">Necesita van</option>
          <option value="No">No necesita van</option>
        </select>
        <select value={filtroBaile} onChange={(e) => setFiltroBaile(e.target.value)}>
          <option value="todos">Baile: todos</option>
          <option value="Sí o sí">Va a bailar</option>
          <option value="No">No va a bailar</option>
        </select>
        <button type="button" className="btn btn-primary admin-btn-link" onClick={() => descargarCSV(filasFiltradas)}>
          Exportar CSV
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th onClick={() => ordenarPor("guest_name")}>Nombre</th>
            <th>Acompañantes</th>
            <th>Para compartir</th>
            <th onClick={() => ordenarPor("needs_transport")}>Van</th>
            <th>Comuna</th>
            <th onClick={() => ordenarPor("dance")}>Baile</th>
            <th onClick={() => ordenarPor("submitted_at")}>Fecha de envío</th>
          </tr>
        </thead>
        <tbody>
          {filasFiltradas.map((r) => (
            <tr key={r.id}>
              <td>{r.guest_name}</td>
              <td>{(r.companions ?? []).join(", ") || "—"}</td>
              <td>{r.side_dish}</td>
              <td>{r.needs_transport}</td>
              <td>{r.comuna_other || r.comuna || "—"}</td>
              <td>{r.dance || "—"}</td>
              <td>{new Date(r.submitted_at).toLocaleString("es-CL")}</td>
            </tr>
          ))}
          {filasFiltradas.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", fontStyle: "italic" }}>
                No hay confirmaciones que coincidan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
