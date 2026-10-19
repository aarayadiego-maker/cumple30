import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // No tiramos la app entera: la página pública igual puede mostrar la
  // portada, solo fallarán las partes que necesitan datos (RSVP/admin).
  console.error(
    "[supabase] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
      "Revisa tu archivo .env (local) o los Secrets de GitHub Actions (producción)."
  );
}

export const supabase = createClient(url ?? "", anonKey ?? "");
