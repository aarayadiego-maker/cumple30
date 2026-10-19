import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useGuests } from "../../hooks/useGuests";
import { SOLO_OPTION, OTRA_COMUNA } from "../../data/constants";
import Decor from "../Decor";
import ProgressBar from "./ProgressBar";
import StepNombre from "./StepNombre";
import StepAcompanantes from "./StepAcompanantes";
import StepCompartir from "./StepCompartir";
import StepMovilizacion from "./StepMovilizacion";
import StepComuna from "./StepComuna";
import StepBaile from "./StepBaile";

const ESTADO_INICIAL = {
  guestName: null,
  guestCompanions: [],
  danceInvited: false,
  selectedCompanions: [],
  sideDish: "",
  needsTransport: "",
  comuna: "",
  comunaOther: "",
  dance: "",
};

function getActiveSteps(estado) {
  const steps = ["nombre"];
  if (estado.guestCompanions.length > 0) steps.push("acompanantes");
  steps.push("ensalada", "movilizacion");
  if (estado.needsTransport === "Sí") steps.push("comuna");
  if (estado.danceInvited) steps.push("baile");
  return steps;
}

export default function RsvpForm({ onEnviado, onCancelar }) {
  const { guests, loading: cargandoInvitados, searchGuests } = useGuests();
  const [estado, setEstado] = useState(ESTADO_INICIAL);
  const [paso, setPaso] = useState("nombre");
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);
  const [honeypot, setHoneypot] = useState(""); // campo trampa anti-spam

  const pasos = getActiveSteps(estado);
  const idxActual = pasos.indexOf(paso);
  const esUltimoPaso = idxActual === pasos.length - 1;

  function actualizar(cambios) {
    setEstado((prev) => ({ ...prev, ...cambios }));
  }

  function seleccionarNombre(nombre) {
    const datos = guests[nombre];
    setEstado((prev) => ({
      ...prev,
      guestName: nombre,
      guestCompanions: datos?.companions ?? [],
      danceInvited: !!datos?.danceInvited,
      selectedCompanions: [],
    }));
  }

  function invalidarNombre() {
    setEstado((prev) => ({
      ...prev,
      guestName: null,
      guestCompanions: [],
      danceInvited: false,
      selectedCompanions: [],
    }));
  }

  function validarPasoActual() {
    switch (paso) {
      case "nombre":
        return !!estado.guestName;
      case "acompanantes":
        return estado.selectedCompanions.length > 0;
      case "ensalada":
        return !!estado.sideDish.trim();
      case "movilizacion":
        return !!estado.needsTransport;
      case "comuna":
        if (!estado.comuna) return false;
        if (estado.comuna === OTRA_COMUNA && !estado.comunaOther.trim()) return false;
        return true;
      case "baile":
        return !!estado.dance;
      default:
        return false;
    }
  }

  function siguiente() {
    if (!validarPasoActual()) return;
    const steps = getActiveSteps(estado);
    const idx = steps.indexOf(paso);
    if (idx < steps.length - 1) setPaso(steps[idx + 1]);
  }

  function atras() {
    const steps = getActiveSteps(estado);
    const idx = steps.indexOf(paso);
    if (idx > 0) {
      setPaso(steps[idx - 1]);
    } else {
      onCancelar();
    }
  }

  async function enviar() {
    if (!validarPasoActual()) return;

    // Honeypot: si un bot rellenó este campo invisible, fingimos éxito
    // sin tocar la base de datos.
    if (honeypot.trim() !== "") {
      onEnviado();
      return;
    }

    setEnviando(true);
    setErrorEnvio(null);

    const companions = estado.selectedCompanions.includes(SOLO_OPTION)
      ? []
      : estado.selectedCompanions;

    const { error } = await supabase.rpc("submit_rsvp", {
      p_guest_name: estado.guestName,
      p_companions: companions,
      p_side_dish: estado.sideDish.trim(),
      p_needs_transport: estado.needsTransport,
      p_comuna: estado.comuna,
      p_comuna_other: estado.comunaOther,
      p_dance: estado.dance,
    });

    setEnviando(false);

    if (error) {
      setErrorEnvio(error.message || "No se pudo enviar tu confirmación.");
      return;
    }
    onEnviado();
  }

  return (
    <section className="screen formulario">
      <Decor icon="star-outline" className="decor-form-1" />
      <Decor icon="star-filled" className="decor-form-2" />
      <Decor icon="zigzag" className="decor-form-3" />
      <Decor icon="balloon-black" className="decor-form-4" />
      <Decor icon="disco-ball" className="decor-form-5" />
      <Decor icon="balloon-black" className="decor-form-6" />

      <ProgressBar pasos={pasos} idxActual={idxActual} />

      {paso === "nombre" && (
        <StepNombre
          guestName={estado.guestName}
          cargando={cargandoInvitados}
          onBuscar={searchGuests}
          onSeleccionar={seleccionarNombre}
          onInvalidar={invalidarNombre}
        />
      )}
      {paso === "acompanantes" && (
        <StepAcompanantes
          companions={estado.guestCompanions}
          seleccionados={estado.selectedCompanions}
          onCambiar={(sel) => actualizar({ selectedCompanions: sel })}
        />
      )}
      {paso === "ensalada" && (
        <StepCompartir
          value={estado.sideDish}
          onChange={(v) => actualizar({ sideDish: v })}
        />
      )}
      {paso === "movilizacion" && (
        <StepMovilizacion
          value={estado.needsTransport}
          onChange={(v) =>
            actualizar({
              needsTransport: v,
              ...(v === "No" ? { comuna: "", comunaOther: "" } : {}),
            })
          }
        />
      )}
      {paso === "comuna" && (
        <StepComuna
          comuna={estado.comuna}
          comunaOther={estado.comunaOther}
          onComuna={(v) => actualizar({ comuna: v })}
          onComunaOther={(v) => actualizar({ comunaOther: v })}
        />
      )}
      {paso === "baile" && (
        <StepBaile value={estado.dance} onChange={(v) => actualizar({ dance: v })} />
      )}

      {/* Campo trampa para bots: invisible para personas, un bot genérico
          lo rellena igual. No usa "display:none" (algunos bots lo
          detectan) sino que lo saca fuera de pantalla. */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
        aria-hidden="true"
      />

      {errorEnvio && <p className="error">{errorEnvio}</p>}

      <div className="nav-buttons">
        <button type="button" className="btn btn-secondary" onClick={atras}>
          Atrás
        </button>
        {esUltimoPaso ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={!validarPasoActual() || enviando}
            onClick={enviar}
          >
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            disabled={!validarPasoActual()}
            onClick={siguiente}
          >
            Siguiente
          </button>
        )}
      </div>
    </section>
  );
}
