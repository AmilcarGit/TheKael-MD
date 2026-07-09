import { obtenerUsuario, guardarUsuario, formatearMonto, tieneEfecto } from "../economyDB.js";

const ENFRIAMIENTO_MS = 60 * 60 * 1000;
const GANANCIA_MIN = 100;
const GANANCIA_MAX = 800;

const TRABAJOS = [
  "atendiste una cafetería", "programaste una app móvil", "diseñaste un sitio web",
  "cuidaste niños", "vendiste ropa vintage", "hiciste un curso de inglés",
  "reparaste computadoras", "diste clases de matemáticas", "cocinaste para un restaurante",
  "pintaste un cuadro", "escribiste un poema", "editaste un video"
];

export default {
  command: ["trabajar", "work"],
  category: "Economia",
  description: "Trabaja para ganar Yui (cada 1 hora). Tus inversiones aumentan las ganancias.",
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

    let ganancia = Math.floor(Math.random() * (GANANCIA_MAX - GANANCIA_MIN + 1)) + GANANCIA_MIN;

    // Aplicar efectos
    const vipOro = tieneEfecto(numero, "vip_oro");
    const vipPlatino = tieneEfecto(numero, "vip_platino");
    const socio = tieneEfecto(numero, "socio");

    if (vipPlatino) {
      ganancia = ganancia * 3;
    } else if (vipOro) {
      ganancia = ganancia * 2;
    }

    if (socio) {
      ganancia = ganancia + 50;
    }

    const trabajo = TRABAJOS[Math.floor(Math.random() * TRABAJOS.length)];

    guardarUsuario(numero, {
      saldo: usuario.saldo + ganancia,
      ultimoTrabajo: ahora,
    });

    let mensajeExtra = "";
    if (vipPlatino) mensajeExtra = " ✨ (VIP Platino x3)";
    else if (vipOro) mensajeExtra = " ✨ (VIP Oro x2)";
    if (socio) mensajeExtra += " 🤝 (+50 socio)";

    await sock.sendMessage(
      chatId,
      {
        text: `💼 Hoy ${trabajo} y ganaste:\n💵 +${formatearMonto(ganancia)}${mensajeExtra}`,
        mentions: [sender],
      },
      { quoted: msg }
    );
  }
};