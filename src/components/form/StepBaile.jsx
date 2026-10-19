export default function StepBaile({ value, onChange }) {
  return (
    <div className="step" data-step="baile">
      <h2>Tú fuiste seleccionado para seguir la fiesta hasta el amanecer &#128520; ¿Te sumas?</h2>
      <p className="apoyo">
        Hay varias piezas disponibles, el checkout es a las 12 del domingo,
        son cupos limitados entonces debo dar los nombres con antelación y la
        cuota son 13.000 por persona.
      </p>
      <select className="input-select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>Elige una opción</option>
        <option value="Sí o sí">Sí o sí</option>
        <option value="No">No</option>
      </select>
    </div>
  );
}
