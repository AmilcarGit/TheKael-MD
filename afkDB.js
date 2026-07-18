// numero (string) -> { razon, desde }
const usuariosAfk = new Map();

export function marcarAfk(numero, razon) {
  usuariosAfk.set(numero, { razon: razon || "Sin razón especificada", desde: Date.now() });
}

export function quitarAfk(numero) {
  const estado = usuariosAfk.get(numero);
  if (!estado) return null;
  usuariosAfk.delete(numero);
  return estado;
}

export function obtenerAfk(numero) {
  return usuariosAfk.get(numero) || null;
}

export function estaAfk(numero) {
  return usuariosAfk.has(numero);
}

export function formatearTiempoAfk(desde) {
  const ms = Date.now() - desde;
  const minutos = Math.floor(ms / 60000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (dias > 0) return `${dias}d ${horas % 24}h`;
  if (horas > 0) return `${horas}h ${minutos % 60}m`;
  if (minutos > 0) return `${minutos}m`;
  return "unos segundos";
}
