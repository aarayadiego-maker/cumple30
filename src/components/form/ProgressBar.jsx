import avatar from "../../assets/images/avatar-progreso.png";

export default function ProgressBar({ pasos, idxActual }) {
  const progreso = (idxActual + 1) / pasos.length;

  return (
    <div className="progress-wrap">
      <div className="progress-track" style={{ "--progreso": progreso }}>
        <div className="progress-track-line"></div>
        <img src={avatar} alt="" className="progress-avatar" />
      </div>
    </div>
  );
}
