import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { normalize } from "../utils/normalize";

/**
 * Trae la lista de invitados desde Supabase (tabla `guests`), que es la
 * ÚNICA fuente de verdad -- la usan tanto el autocompletado del
 * formulario público como la función RPC que valida las respuestas en
 * el servidor. Nada de listas duplicadas en el frontend.
 */
export function useGuests() {
  const [guests, setGuests] = useState({}); // { "Nombre": { companions: [], danceInvited: bool } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        const { data, error } = await supabase
          .from("guests")
          .select("name, companions, dance_invited");

        if (cancelado) return;

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        const mapa = {};
        for (const fila of data ?? []) {
          mapa[fila.name] = {
            companions: fila.companions ?? [],
            danceInvited: !!fila.dance_invited,
          };
        }
        setGuests(mapa);
        setLoading(false);
      } catch (err) {
        if (!cancelado) {
          setError(err.message || "No pudimos conectar con la base de datos.");
          setLoading(false);
        }
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  function searchGuests(query, limit = 8) {
    const q = normalize(query);
    if (!q) return [];
    return Object.keys(guests)
      .filter((nombre) => normalize(nombre).includes(q))
      .slice(0, limit);
  }

  function findGuest(name) {
    const target = normalize(name);
    return Object.keys(guests).find((g) => normalize(g) === target) ?? null;
  }

  return { guests, loading, error, searchGuests, findGuest };
}
