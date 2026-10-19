import { SOLO_OPTION } from "../../data/constants";

export default function StepAcompanantes({ companions, seleccionados, onCambiar }) {
  const opciones = [...companions, SOLO_OPTION];

  function alternar(nombre, marcado) {
    if (nombre === SOLO_OPTION) {
      onCambiar(marcado ? [SOLO_OPTION] : []);
      return;
    }
    let nuevos = seleccionados.filter((n) => n !== SOLO_OPTION);
    nuevos = marcado ? [...nuevos, nombre] : nuevos.filter((n) => n !== nombre);
    onCambiar(nuevos);
  }

  return (
    <div className="step" data-step="acompanantes">
      <h2>¿Pareja o hijos?</h2>
      <p className="apoyo">Marca quiénes te acompañan.</p>
      <div className="opciones-check">
        {opciones.map((nombre) => (
          <label key={nombre} className="check-item">
            <input
              type="checkbox"
              checked={seleccionados.includes(nombre)}
              onChange={(e) => alternar(nombre, e.target.checked)}
            />
            {nombre}
          </label>
        ))}
      </div>
    </div>
  );
}
