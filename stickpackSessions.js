const DURACION_SESION_MS = 5 * 60 * 1000; // 5 minutos de inactividad máxima

// clave = `${chatId}:${numeroSender}` -> { packName, authorName, cantidad, expiraEn }
const sesionesActivas = new Map();

function clave(chatId, numero) {
  return `${chatId}:${numero}`;
}

export function iniciarSesionPack(chatId, numero, packName, authorName) {
  sesionesActivas.set(clave(chatId, numero), {
    packName,
    authorName,
    cantidad: 0,
    expiraEn: Date.now() + DURACION_SESION_MS,
  });
}

export function obtenerSesionPack(chatId, numero) {
  const k = clave(chatId, numero);
  const sesion = sesionesActivas.get(k);

  if (!sesion) return null;

  if (Date.now() > sesion.expiraEn) {
    sesionesActivas.delete(k);
    return null;
  }

  return sesion;
}

export function registrarStickerEnSesion(chatId, numero) {
  const k = clave(chatId, numero);
  const sesion = sesionesActivas.get(k);
  if (!sesion) return null;

  sesion.cantidad += 1;
  sesion.expiraEn = Date.now() + DURACION_SESION_MS;
  return sesion;
}

export function finalizarSesionPack(chatId, numero) {
  const k = clave(chatId, numero);
  const sesion = sesionesActivas.get(k);
  sesionesActivas.delete(k);
  return sesion || null;
}
