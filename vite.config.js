import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
//
// IMPORTANTE: GitHub Pages sirve los proyectos en
// https://USUARIO.github.io/NOMBRE_DEL_REPO/ — Vite necesita saber
// ese "NOMBRE_DEL_REPO" para generar rutas de assets correctas.
// Si llamas a tu repositorio distinto de "cumple30", cambia la
// siguiente línea para que coincida EXACTAMENTE (con las barras).
export default defineConfig({
  base: "/cumple30/",
  plugins: [react(), tailwindcss()],
});
