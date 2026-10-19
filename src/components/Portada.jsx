import portada from "../assets/images/portada.jpg";

export default function Portada() {
  return (
    <section className="screen portada">
      <img
        src={portada}
        alt="Invitación de cumpleaños: 30 y siempre"
        className="portada-img"
      />
      <div className="scroll-hint">
        <span>Desliza para ver los detalles</span>
        <div className="bounce-arrow">&darr;</div>
      </div>
    </section>
  );
}
