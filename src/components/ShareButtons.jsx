import { descargarICS } from "../utils/ics";

export default function ShareButtons({ config }) {
  const shareUrl = window.location.href.split("#")[0];

  async function compartir() {
    const datos = {
      title: config.titulo,
      text: config.descripcion,
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(datos);
      } catch {
        // el usuario canceló el share sheet, no hacemos nada
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Copiamos el link al portapapeles. ¡Ya lo puedes pegar en WhatsApp!");
    }
  }

  return (
    <div className="btn-group">
      <a
        href={config.maps_url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary"
        style={{ textDecoration: "none", textAlign: "center" }}
      >
        Cómo llegar
      </a>
      <button type="button" className="btn btn-secondary" onClick={() => descargarICS(config)}>
        Agregar al calendario
      </button>
      <button type="button" className="btn btn-secondary" onClick={compartir}>
        Compartir invitación
      </button>
    </div>
  );
}
