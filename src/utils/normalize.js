/**
 * Quita tildes y pasa a minúsculas, igual que el normalize() de Python
 * de la versión anterior -- para que "tia eli" encuentre "Tía Eli".
 */
export function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
