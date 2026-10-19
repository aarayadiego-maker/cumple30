import { useState } from "react";

export default function AdminEventConfig({ config, onGuardar }) {
  const [form, setForm] = useState(config);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  function campo(nombre, valor) {
    setForm((prev) => ({ ...prev, [nombre]: valor }));
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      await onGuardar(form);
      setMensaje({ tipo: "ok", texto: "Cambios guardados. La invitación pública ya se actualizó." });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message || "No se pudo guardar." });
    }
    setGuardando(false);
  }

  return (
    <section className="admin-section">
      <h3>Configuración del evento</h3>
      <form onSubmit={manejarSubmit} className="admin-form-grid">
        <label>
          Título
          <input value={form.titulo} onChange={(e) => campo("titulo", e.target.value)} />
        </label>
        <label>
          Descripción
          <input value={form.descripcion} onChange={(e) => campo("descripcion", e.target.value)} />
        </label>
        <label>
          Fecha (texto que se muestra)
          <input value={form.fecha} onChange={(e) => campo("fecha", e.target.value)} />
        </label>
        <label>
          Hora (texto que se muestra)
          <input value={form.hora} onChange={(e) => campo("hora", e.target.value)} />
        </label>
        <label>
          Dirección
          <input value={form.direccion} onChange={(e) => campo("direccion", e.target.value)} />
        </label>
        <label>
          Link de Google Maps
          <input value={form.maps_url} onChange={(e) => campo("maps_url", e.target.value)} />
        </label>
        <label style={{ gridColumn: "1 / -1" }}>
          Indicaciones adicionales
          <textarea
            rows={3}
            value={form.indicaciones ?? ""}
            onChange={(e) => campo("indicaciones", e.target.value)}
          />
        </label>
        <label>
          Confirmaciones de asistencia
          <select
            value={form.rsvp_enabled ? "si" : "no"}
            onChange={(e) => campo("rsvp_enabled", e.target.value === "si")}
          >
            <option value="si">Activadas</option>
            <option value="no">Desactivadas</option>
          </select>
        </label>

        <div style={{ gridColumn: "1 / -1" }}>
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
      {mensaje && (
        <p className={mensaje.tipo === "error" ? "error" : ""} style={{ fontStyle: "normal", marginTop: "1rem" }}>
          {mensaje.texto}
        </p>
      )}
    </section>
  );
}
