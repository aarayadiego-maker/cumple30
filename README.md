# Invitación 30 y siempre — React + Supabase + GitHub Pages

Invitación de cumpleaños con confirmación de asistencia y panel de
administración. Sin login para los invitados — solo tú (el admin)
necesitas una cuenta.

## Qué es cada cosa

- **Frontend**: React + Vite + Tailwind CSS v4.
- **Base de datos + Auth**: Supabase (plan gratis alcanza de sobra).
- **Hosting**: GitHub Pages, publicado automáticamente con GitHub Actions
  cada vez que hagas `git push` a la rama `main`.

---

## Antes de empezar: necesitas crear 2 cosas tú mismo

Yo no puedo crear cuentas ni repos en tu nombre — necesito que hagas
estos dos pasos y me (o te) pases los datos que piden.

### 1. Crear el repositorio en GitHub

1. Entra a [github.com/new](https://github.com/new).
2. Nombre del repositorio: **`cumple30`** (si usas otro nombre, edítalo
   también en `vite.config.js` línea `base: "/cumple30/"` y en
   `index.html` donde dice `/cumple30/`).
3. Visibilidad: puede ser público o privado, da lo mismo para Pages.
4. NO marques "Add a README" (ya tenemos uno).
5. Crea el repo. Verás una URL tipo `git@github.com:TU_USUARIO/cumple30.git`.

Luego, desde esta carpeta del proyecto:

```bash
cd "invitacion-cumple30"
git init
git add -A
git commit -m "Invitación de cumpleaños: primera versión"
git branch -M main
git remote add origin git@github.com:TU_USUARIO/cumple30.git
git push -u origin main
```

(Si usas HTTPS en vez de SSH, la URL es
`https://github.com/TU_USUARIO/cumple30.git` y GitHub te pedirá
usuario + un "personal access token" como contraseña la primera vez.)

### 2. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta
   gratis (puedes usar tu cuenta de GitHub para entrar más rápido).
2. "New Project". Ponle el nombre que quieras (ej. `cumple30`), elige
   una contraseña de base de datos (guárdala, no la necesitas de nuevo
   salvo casos avanzados) y la región más cercana (ej. `South America
   (São Paulo)`).
3. Espera ~2 minutos a que se cree el proyecto.
4. Ve a **SQL Editor** (ícono de rayo en el menú izquierdo) → **New
   query**. Abre el archivo `supabase/schema.sql` de este proyecto,
   copia TODO su contenido, pégalo ahí, y dale **Run**. Esto crea las
   3 tablas (`guests`, `event_config`, `rsvps`), carga tu lista de
   invitados real, y deja todas las reglas de seguridad (RLS) listas.
5. Ve a **Settings → API**. Ahí vas a ver:
   - **Project URL** → esto es tu `VITE_SUPABASE_URL`.
   - **anon public** key → esto es tu `VITE_SUPABASE_ANON_KEY`.
   - **NUNCA copies la "service_role" key a ningún lado del frontend.**
     Esa es secreta y le da acceso total a la base de datos saltándose
     todas las reglas de seguridad.
6. Crea tu usuario de administrador: ve a **Authentication → Users →
   Add user → Create new user**. Pon tu email y una contraseña. Con
   esas credenciales entras al panel admin (`/admin`).

---

## Configurar las variables de entorno

### Para desarrollo local

Copia `.env.example` a `.env.local` y reemplaza los valores con los
que obtuviste en Supabase (Settings → API):

```bash
cp .env.example .env.local
```

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-public-key
```

Luego:

```bash
npm install
npm run dev
```

Abre `http://localhost:5173/cumple30/`.

### Para producción (GitHub Actions)

GitHub Actions construye el sitio en cada push, así que las variables
tienen que vivir como **Secrets** del repositorio (no en el código):

1. En GitHub, ve a tu repo → **Settings → Secrets and variables →
   Actions → New repository secret**.
2. Crea `VITE_SUPABASE_URL` con el Project URL.
3. Crea `VITE_SUPABASE_ANON_KEY` con la anon public key.

La anon key terminará visible dentro del JavaScript compilado que
cualquiera puede descargar — **eso es normal y seguro**, es una clave
diseñada para ser pública; lo que de verdad protege los datos son las
políticas de Row Level Security que ya quedaron configuradas en
`schema.sql` (los invitados no pueden leer la lista de confirmaciones
de otros, por ejemplo).

---

## Activar GitHub Pages

1. En tu repo de GitHub: **Settings → Pages**.
2. En "Build and deployment" → **Source**, elige **GitHub Actions**
   (no "Deploy from a branch").
3. Haz un push a `main` (o ve a la pestaña **Actions** del repo y
   corre manualmente el workflow "Deploy a GitHub Pages").
4. Cuando el workflow termine en verde, tu sitio queda en:
   `https://TU_USUARIO.github.io/cumple30/`

### Importante: actualiza el usuario real en el código

Busca `USUARIO` en `index.html` (etiquetas Open Graph, 2 líneas) y
reemplázalo por tu usuario real de GitHub, para que la vista previa de
WhatsApp apunte a la URL correcta. Vuelve a hacer commit + push.

---

## URLs finales

- **Invitación pública**: `https://TU_USUARIO.github.io/cumple30/`
- **Panel de administración**: `https://TU_USUARIO.github.io/cumple30/admin`
  (inicia sesión con el email/contraseña que creaste en Supabase
  Authentication → Users)

---

## Cómo modificar los datos del evento

Todo (título, descripción, fecha, hora, dirección, link de Maps,
indicaciones, activar/desactivar confirmaciones) se edita desde
**Panel admin → Configuración → Guardar cambios**. Se actualiza al
tiro en la web pública, sin tocar código ni redeployar.

## Cómo editar la lista de invitados

Por ahora se edita directo en Supabase: **Table Editor → guests**.
Cada fila es `name` (nombre exacto), `companions` (lista de
acompañantes) y `dance_invited` (si le toca la pregunta del webeo).
También puedes volver a correr `supabase/schema.sql` completo si
prefieres editar el archivo y recargar todo de una (ojo: eso borra y
re-inserta TODA la tabla `guests`, no toca `rsvps`).

## Cómo revisar confirmaciones y exportar a CSV

**Panel admin → Invitados**: tabla con buscador, filtros por
movilización/baile, columnas ordenables (click en el encabezado), y
botón **Exportar CSV** (se abre bien en Excel, con tildes).

## Cómo ver el Dashboard

**Panel admin → Dashboard**: total de respuestas, acompañantes,
estimado total de asistentes, cuántos necesitan van (agrupado por
comuna), y cuántos van al webeo.

---

## Decisiones técnicas que vale la pena que sepas

- **No hay opción "No asistiré"**: el flujo actual (igual que la
  versión anterior del proyecto) es que cada invitado completa el
  formulario SOLO si va a ir. Si quieres agregar la opción de "no
  voy", es un cambio razonable pero no estaba en el diseño original
  aprobado — avísame y lo armamos.
- **La lista de invitados vive en Supabase** (tabla `guests`), no
  duplicada en el código — tanto el formulario público (autocompletado)
  como la función `submit_rsvp()` que valida en el servidor leen de
  ahí. Una sola fuente de verdad.
- **Anti-spam**: hay un campo "honeypot" invisible en el formulario
  (los bots genéricos lo rellenan, las personas no lo ven). No hay
  CAPTCHA porque con una lista cerrada de invitados reales ya es difícil
  abusar del formulario sin saber nombres exactos de la familia.
- **Seguridad de la tabla `rsvps`**: los invitados NUNCA leen ni
  escriben esa tabla directamente — todo pasa por la función
  `submit_rsvp()` (RPC) que valida el nombre contra `guests` antes de
  guardar. Solo tu usuario admin autenticado puede hacer `SELECT`
  directo sobre `rsvps`.
- **Rutas limpias en GitHub Pages** (`/admin` sin "#"): GitHub Pages es
  hosting 100% estático y no sabe redirigir rutas desconocidas a
  `index.html`. Se resolvió con el truco
  [spa-github-pages](https://github.com/rafgraph/spa-github-pages)
  (un `public/404.html` que redirige de vuelta, y un script en
  `index.html` que reconstruye la ruta original).

---

## Checklist de pruebas antes de compartir el link

Después de publicar, verifica tú mismo:

- [ ] Abre la URL pública desde tu celular (datos móviles, no wifi de
      tu casa, para simular un invitado real).
- [ ] La imagen de portada se ve completa, sin cortes.
- [ ] Completa el formulario con un nombre real de la lista y envíalo.
- [ ] Entra a `/admin`, inicia sesión, y verifica que tu confirmación
      de prueba aparezca en la tabla de Invitados.
- [ ] Intenta entrar a `/admin` sin iniciar sesión — no debe mostrar
      datos de invitados, solo el formulario de login.
- [ ] Cambia algo en Configuración (ej. la hora) y revisa que se vea
      reflejado en la página pública al recargarla.
- [ ] Botón "Cómo llegar" abre Google Maps.
- [ ] Manda el link por WhatsApp a ti mismo y revisa que aparezca la
      vista previa con imagen, título y descripción (puede tardar
      unos minutos en actualizarse la primera vez — WhatsApp cachea
      las vistas previas).
- [ ] Exporta el CSV desde el admin y ábrelo en Excel.

Si algo de esto falla, dímelo con el detalle de qué paso exacto no
funcionó y seguimos afinando.
