import { useState } from "react";

export default function StepNombre({ guestName, cargando, onBuscar, onSeleccionar, onInvalidar }) {
  const [texto, setTexto] = useState(guestName ?? "");
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarError, setMostrarError] = useState(false);

  function manejarCambio(e) {
    const valor = e.target.value;
    setTexto(valor);
    onInvalidar();
    if (!valor.trim()) {
      setSugerencias([]);
      setMostrarError(false);
      return;
    }
    const matches = onBuscar(valor);
    setSugerencias(matches);
    setMostrarError(matches.length === 0);
  }

  function elegir(nombre) {
    setTexto(nombre);
    setSugerencias([]);
    setMostrarError(false);
    onSeleccionar(nombre);
  }

  return (
    <div className="step" data-step="nombre">
      <h2>¿Cómo te llamas?</h2>
      <p className="apoyo">
        Escribe tu nombre y elige la opción que te corresponda en la lista.
      </p>
      <input
        type="text"
        className="input-text"
        autoComplete="off"
        placeholder={cargando ? "Cargando invitados..." : "Ej: Tia Eli"}
        value={texto}
        onChange={manejarCambio}
        disabled={cargando}
      />
      <div className="sugerencias">
        {sugerencias.map((nombre) => (
          <div key={nombre} className="sugerencia-item" onClick={() => elegir(nombre)}>
            {nombre}
          </div>
        ))}
      </div>
      {mostrarError && (
        <p className="error">No encontramos tu nombre, revisa cómo lo escribiste</p>
      )}
    </div>
  );
}
