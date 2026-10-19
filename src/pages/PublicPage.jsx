import { useState, useRef } from "react";
import Portada from "../components/Portada";
import Detalles from "../components/Detalles";
import RsvpForm from "../components/form/RsvpForm";
import Gracias from "../components/Gracias";
import { useEventConfig } from "../hooks/useEventConfig";

export default function PublicPage() {
  const { config, loading } = useEventConfig();
  const [vista, setVista] = useState("detalles"); // "detalles" | "formulario" | "gracias"
  const formularioRef = useRef(null);
  const detallesRef = useRef(null);

  function abrirFormulario() {
    setVista("formulario");
    setTimeout(() => formularioRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function cancelarFormulario() {
    setVista("detalles");
    setTimeout(() => detallesRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function confirmacionEnviada() {
    setVista("gracias");
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 50);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="apoyo">Cargando invitación...</p>
      </div>
    );
  }

  return (
    <>
      <Portada />
      <div ref={detallesRef}>
        <Detalles config={config} onAsistire={abrirFormulario} />
      </div>
      {vista === "formulario" && (
        <div ref={formularioRef}>
          <RsvpForm onEnviado={confirmacionEnviada} onCancelar={cancelarFormulario} />
        </div>
      )}
      {vista === "gracias" && <Gracias />}
    </>
  );
}
