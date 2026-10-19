export default function AdminPreview() {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="admin-section">
      <h3>Vista previa (celular)</h3>
      <p className="apoyo">Así se ve la invitación pública ahora mismo.</p>
      <div className="admin-preview-frame">
        <iframe src={base} title="Vista previa de la invitación" />
      </div>
    </section>
  );
}
