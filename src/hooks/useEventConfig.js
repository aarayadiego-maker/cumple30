import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";

const EVENT_ID = 1; // fila única en event_config

const DEFAULTS = {
  id: EVENT_ID,
  titulo: "30 y siempre",
  descripcion: "Te invito a celebrar mis 15... 18 años después.",
  fecha: "Sábado 14 de Noviembre",
  hora: "Desde las 11:00 hrs hasta las 19:00 hrs",
  direccion: "Camino San Javier, Malloco, RM",
  maps_url:
    "https://www.google.com/maps/search/?api=1&query=Camino+San+Javier%2C+Malloco%2C+RM",
  indicaciones: "",
  imagen_portada_url: "",
  rsvp_enabled: true,
};

/**
 * Lee (y opcionalmente escribe, desde el admin) la configuración del
 * evento. Vive en una sola fila de Supabase para que el admin pueda
 * cambiar fecha/hora/dirección sin tocar código ni redeployar.
 */
export function useEventConfig() {
  const [config, setConfig] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("event_config")
        .select("*")
        .eq("id", EVENT_ID)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else if (data) {
        setConfig(data);
      }
    } catch (err) {
      setError(err.message || "No pudimos conectar con la base de datos.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  async function guardar(cambios) {
    const { data, error } = await supabase
      .from("event_config")
      .update(cambios)
      .eq("id", EVENT_ID)
      .select()
      .single();
    if (error) throw error;
    setConfig(data);
    return data;
  }

  return { config, loading, error, guardar, recargar };
}
