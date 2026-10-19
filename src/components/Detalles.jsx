import piscina from "../assets/images/piscina.jpg";
import quincho from "../assets/images/quincho.jpg";
import jardin from "../assets/images/jardin.jpg";
import Decor from "./Decor";
import ShareButtons from "./ShareButtons";
import { useFadeIn } from "../hooks/useFadeIn";

export default function Detalles({ config, onAsistire }) {
  const { ref: refCard, visible: cardVisible } = useFadeIn();
  const { ref: refIntro, visible: introVisible } = useFadeIn();

  return (
    <section className="screen detalles">
      <Decor icon="star-outline" className="decor-detalles-1" />
      <Decor icon="zigzag" className="decor-detalles-2" />

      <p
        ref={refIntro}
        className={`mensaje-intro fade-in ${introVisible ? "visible" : ""}`}
      >
        Hace años que no celebro mi cumpleaños y este, quisiera hacerlo junto a
        ustedes. Será un día de piscina y asado a las afueras de Santiago.
      </p>

      <div className="collage-photos">
        <div className="photo-cutout photo-piscina">
          <img src={piscina} alt="Piscina de la parcela" />
          <span className="tape"></span>
        </div>
        <div className="photo-cutout photo-quincho">
          <img src={quincho} alt="Quincho de la parcela" />
          <span className="tape"></span>
        </div>
        <div className="photo-cutout photo-jardin">
          <img src={jardin} alt="Área verde de la parcela" />
          <span className="tape"></span>
        </div>
      </div>

      <div
        ref={refCard}
        className={`detalles-card fade-in ${cardVisible ? "visible" : ""}`}
      >
        <h2 className="titulo-detalle">Los detalles</h2>
        <ul className="lista-detalles">
          <li><strong>Fecha:</strong> {config.fecha}</li>
          <li><strong>Hora:</strong> {config.hora}</li>
          <li>
            <strong>Dirección:</strong> {config.direccion}
            {config.indicaciones && (
              <>
                <br />
                <span>{config.indicaciones}</span>
              </>
            )}
          </li>
        </ul>

        {config.rsvp_enabled ? (
          <button type="button" className="btn btn-primary" onClick={onAsistire}>
            Asistiré
          </button>
        ) : (
          <p className="error" style={{ marginBottom: "1rem" }}>
            Las confirmaciones están cerradas por ahora.
          </p>
        )}

        <div style={{ marginTop: "1rem" }}>
          <ShareButtons config={config} />
        </div>
      </div>
    </section>
  );
}
