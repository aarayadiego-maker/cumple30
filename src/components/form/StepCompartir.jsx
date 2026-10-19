export default function StepCompartir({ value, onChange }) {
  return (
    <div className="step" data-step="ensalada">
      <h2>Para compartir</h2>
      <p className="apoyo">
        Comeremos un asadito! yo pondré la carne y algunos bebestibles, si tu
        puedes traer alguna ensalada, acompañamiento o algo más para la
        parrilla ideal! Y si quieres tomar algo especial también tráelo!
      </p>
      <input
        type="text"
        className="input-text"
        placeholder="Ej: Ensalada de tomate y una bebida"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
