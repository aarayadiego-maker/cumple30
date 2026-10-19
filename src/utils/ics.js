/**
 * Genera un archivo .ics (iCalendar) compatible con Apple Calendar,
 * Google Calendar y Outlook, y dispara la descarga en el navegador.
 *
 * Necesita fechas ISO reales (no el texto libre "Sábado 14 de
 * Noviembre"), por eso event_config guarda fecha_inicio_iso /
 * fecha_fin_iso además del texto que se muestra en pantalla.
 */
function formatearFechaICS(isoString) {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

export function descargarICS(config) {
  const ahora = formatearFechaICS(new Date().toISOString());
  const inicio = formatearFechaICS(config.fecha_inicio_iso);
  const fin = formatearFechaICS(config.fecha_fin_iso);

  const escapar = (texto) =>
    String(texto ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");

  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitacion Cumple//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@invitacion-cumple`,
    `DTSTAMP:${ahora}`,
    `DTSTART:${inicio}`,
    `DTEND:${fin}`,
    `SUMMARY:${escapar(config.titulo)}`,
    `DESCRIPTION:${escapar(config.descripcion)}${config.indicaciones ? "\\n\\n" + escapar(config.indicaciones) : ""}`,
    `LOCATION:${escapar(config.direccion)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lineas.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cumple-30.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
