export default function ShareButtons({ config }) {
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
    </div>
  );
}
