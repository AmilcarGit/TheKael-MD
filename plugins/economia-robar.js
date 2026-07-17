import { obtenerUsuario, guardarUsuario, formatearMonto } from "../economyDB.js";

const PROBABILIDAD_EXITO = 0.4;
const PORCENTAJE_ROBADO_MIN = 0.1;
const PORCENTAJE_ROBADO_MAX = 0.3;
const MULTA_SI_FALLA = 0.15;
const ENFRIAMIENTO_MS = 30 * 60 * 1000;
const SALDO_MINIMO_VICTIMA = 200;

const ultimosIntentos = new Map();

export default {
  command: ["robar"],
  category: "Economia",
  requiereRegistro: true,
  description: "Intenta robarle Yui a otro usuario (mencionando o respondiendo).",

  run: async (sock, msg, args, context) => {
    const { sender, chatId } = context;
    const numero = sender.split("@")[0].split(":")[0];

    let objetivo = null;
    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
      objetivo = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
      objetivo = msg.message.extendedTextMessage.contextInfo.participant;
    }

    if (!objetivo) {
      return await sock.sendMessage(
        chatId,
        { text: "🔫 Menciona o responde a quien le quieres robar.\nEjemplo: *robar* (respondiendo a un mensaje)" },
        { quoted: msg }
      );
    }

    const numeroObjetivo = objetivo.split("@")[0].split(":")[0];

    if (numeroObjetivo === numero) {
      return await sock.sendMessage(
        chatId,
        { text: "❌ No puedes robarte a ti mismo/a." },
        { quoted: msg }
      );
    }

    const ahora = Date.now();
    const ultimoIntento = ultimosIntentos.get(numero) || 0;
    const restante = ultimoIntento + ENFRIAMIENTO_MS - ahora;

    if (restante > 0) {
      const minutos = Math.ceil(restante / (60 * 1000));
      return await sock.sendMessage(
        chatId,
        { text: `⏳ Estás escondiéndote de la policía. Vuelve a intentar robar en *${minutos} minuto(s)*.` },
        { quoted: msg }
      );
    }

    const ladron = obtenerUsuario(numero);
    const victima = obtenerUsuario(numeroObjetivo);

    if (victima.saldo < SALDO_MINIMO_VICTIMA) {
      return await sock.sendMessage(
        chatId,
        { text: `❌ Esa persona no tiene suficiente efectivo para valer la pena (mínimo ${formatearMonto(SALDO_MINIMO_VICTIMA)}).` },
        { quoted: msg }
      );
    }

    ultimosIntentos.set(numero, ahora);

    const exito = Math.random() < PROBABILIDAD_EXITO;

    if (exito) {
      const porcentaje = PORCENTAJE_ROBADO_MIN + Math.random() * (PORCENTAJE_ROBADO_MAX - PORCENTAJE_ROBADO_MIN);
      const monto = Math.floor(victima.saldo * porcentaje);

      guardarUsuario(numeroObjetivo, { saldo: victima.saldo - monto });
      guardarUsuario(numero, { saldo: ladron.saldo + monto });

      return await sock.sendMessage(
        chatId,
        {
          text: `🔫 ¡Le robaste *${formatearMonto(monto)}* a @${numeroObjetivo}!`,
          mentions: [objetivo],
        },
        { quoted: msg }
      );
    } else {
      const multa = Math.floor(ladron.saldo * MULTA_SI_FALLA);
      guardarUsuario(numero, { saldo: Math.max(0, ladron.saldo - multa) });

      return await sock.sendMessage(
        chatId,
        { text: `🚨 Te atraparon intentando robar a @${numeroObjetivo} y pagaste una multa de *${formatearMonto(multa)}*.`,
          mentions: [objetivo],
        },
        { quoted: msg }
      );
    }
  },
};