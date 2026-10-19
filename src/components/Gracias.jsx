import Decor from "./Decor";

export default function Gracias() {
  return (
    <section className="screen gracias">
      <Decor icon="balloon-black" className="decor-gracias-1" />
      <Decor icon="disco-ball" className="decor-gracias-2" />
      <Decor icon="star-filled" className="decor-gracias-3" />
      <Decor icon="balloon-black" className="decor-gracias-4" />
      <Decor icon="zigzag" className="decor-gracias-5" />
      <Decor icon="star-outline" className="decor-gracias-6" />
      <h2>¡Gracias por confirmar!</h2>
      <p>Nos vemos pronto con un resumen de sus respuestas.</p>
    </section>
  );
}
