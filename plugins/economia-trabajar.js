import { obtenerUsuario, guardarUsuario, formatearMonto } from "../economyDB.js";

const ENFRIAMIENTO_MS = 60 * 60 * 1000; // 1 hora
const GANANCIA_MIN = 50;
const GANANCIA_MAX = 300;

const TRABAJOS = [
  "atendiste una cafetería",
  "ayudaste a resolver un problema de programación",
  "hiciste un delivery",
  "diste clases de anime",
  "vendiste stickers de Yui",
  "cuidaste gatitos",
  "hiciste un cover de una canción",
];

export default {
  command: ["trabajar", "work"],
  category: "Economia",
  description: "Trabaja para ganar Yui (cada 1 hora).",

  run: async (sock, msg, args, context) => {
    const { sender, chatId } = context;
    const numero = sender.split("@")[0].split(":")[0];

    const usuario = obtenerUsuario(numero);
    const ahora = Date.now();
    const tiempoRestante = usuario.ultimoTrabajo + ENFRIAMIENTO_MS - ahora;

    if (tiempoRestante > 0) {
      const minutos = Math.ceil(tiempoRestante / (60 * 1000));
      return await sock.sendMessage(
        chatId,
        { text: `⏳ Estás cansada/o. Vuelve a trabajar en *${minutos} minuto(s)*.` },
        { quoted: msg }
      );
    }

    const ganancia =
      Math.floor(Math.random() * (GANANCIA_MAX - GANANCIA_MIN + 1)) + GANANCIA_MIN;
    const trabajo = TRABAJOS[Math.floor(Math.random() * TRABAJOS.length)];

    guardarUsuario(numero, {
      saldo: usuario.saldo + ganancia,
      ultimoTrabajo: ahora,
    });

    await sock.sendMessage(
      chatId,
      {
        text:
          `💼 Hoy ${trabajo} y ganaste:\n` +
          `💵 +${formatearMonto(ganancia)}`,
        mentions: [sender],
      },
      { quoted: msg }
    );
  },
};
