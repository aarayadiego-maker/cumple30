import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

/** Lista completa de confirmaciones -- requiere sesión de admin (RLS). */
export function useRsvps() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) setError(error.message);
      else setRows(data ?? []);
    } catch (err) {
      setError(err.message || "No pudimos conectar con la base de datos.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { rows, loading, error, recargar };
}
