import { COMUNAS, OTRA_COMUNA } from "../../data/constants";

export default function StepComuna({ comuna, comunaOther, onComuna, onComunaOther }) {
  return (
    <div className="step" data-step="comuna">
      <h2>¿Desde qué punto de Santiago?</h2>
      <p className="apoyo">Para calcular el recorrido de la van.</p>
      <select
        className="input-select"
        value={comuna}
        onChange={(e) => onComuna(e.target.value)}
      >
        <option value="" disabled>Elige una comuna</option>
        {COMUNAS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
        <option value={OTRA_COMUNA}>{OTRA_COMUNA}</option>
      </select>
      {comuna === OTRA_COMUNA && (
        <input
          type="text"
          className="input-text"
          placeholder="¿Qué comuna?"
          value={comunaOther}
          onChange={(e) => onComunaOther(e.target.value)}
        />
      )}
    </div>
  );
}
