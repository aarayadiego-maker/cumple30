/**
 * Arma un CSV compatible con Excel (BOM UTF-8 para que las tildes se
 * vean bien) y dispara la descarga en el navegador.
 */
export function descargarCSV(rows) {
  const headers = [
    "Nombre",
    "Acompañantes",
    "Para compartir",
    "Necesita van",
    "Comuna",
    "Comuna (otra)",
    "Baile",
    "Fecha de envío",
  ];

  const escapar = (valor) => {
    const texto = String(valor ?? "");
    if (/[",\n;]/.test(texto)) {
      return `"${texto.replace(/"/g, '""')}"`;
    }
    return texto;
  };

  const filas = rows.map((r) =>
    [
      r.guest_name,
      (r.companions ?? []).join(", "),
      r.side_dish,
      r.needs_transport,
      r.comuna,
      r.comuna_other,
      r.dance,
      r.submitted_at,
    ]
      .map(escapar)
      .join(",")
  );

  const csv = [headers.join(","), ...filas].join("\r\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "confirmaciones_cumple30.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
