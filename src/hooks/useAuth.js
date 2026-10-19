import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

/**
 * Sesión de administrador vía Supabase Auth (email + contraseña).
 * El único usuario autorizado es el que tú crees manualmente en el
 * dashboard de Supabase (Authentication -> Users -> Add user).
 */
export function useAuth() {
  const [session, setSession] = useState(undefined); // undefined = cargando, null = sin sesión
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      setSession(nuevaSesion);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(email, password) {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return false;
    }
    return true;
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return { session, loading: session === undefined, error, login, logout };
}
