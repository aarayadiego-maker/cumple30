export default function StepBaile({ value, onChange }) {
  return (
    <div className="step" data-step="baile">
      <h2>Terminando la tarde seguimos el webeo, ¿apañas? &#128520;</h2>
      <p className="apoyo">Lugar por confirmar.</p>
      <select className="input-select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>Elige una opción</option>
        <option value="Sí o sí">Sí o sí</option>
        <option value="No">No</option>
      </select>
    </div>
  );
}
