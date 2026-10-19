export default function StepMovilizacion({ value, onChange }) {
  return (
    <div className="step" data-step="movilizacion">
      <h2>¿Necesitas movilización?</h2>
      <p className="apoyo">
        Contrataremos una van. El valor dependerá de la cantidad de personas y
        la distancia.
      </p>
      <div className="opciones-radio">
        {["Sí", "No"].map((opcion) => (
          <button
            key={opcion}
            type="button"
            className={`btn-opcion ${value === opcion ? "activo" : ""}`}
            onClick={() => onChange(opcion)}
          >
            {opcion}
          </button>
        ))}
      </div>
    </div>
  );
}
