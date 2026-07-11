import * as subbotManager from "../subbotManager.js";

export default {
  command: ["code", "codigo"],
  category: "General",
  description: "Genera tu propio código de vinculación para crear un subbot con tu número.",

  run: async (sock, msg, args, context) => {
    const { chatId, sender } = context;
    const numero = sender.split("@")[0].split(":")[0];
    const esGrupo = chatId.endsWith("@g.us");
    const destino = sender;

    if (subbotManager.existeSubbot(numero)) {
      return await sock.sendMessage(
        chatId,
        { text: "⚠️ Ya tienes un subbot activo o conectándose con tu número." },
        { quoted: msg }
      );
    }

    if (esGrupo) {
      await sock.sendMessage(
        chatId,
        { text: "📩 Te mandé tu código de vinculación por privado." },
        { quoted: msg }
      );
    }

    try {
      await sock.sendMessage(destino, {
        text: "⏳ Generando tu código de vinculación...",
      });
    } catch (err) {
      return await sock.sendMessage(
        chatId,
        { text: "❌ No pude escribirte por privado. Mándame primero un mensaje directo (fuera del grupo) y vuelve a intentar *code*." },
        { quoted: msg }
      );
    }

    try {
      await subbotManager.crearSubbot(numero, {
        onPairingCode: async (code) => {
          await sock.sendMessage(destino, {
            text:
              `🦋 *Tu código de vinculación*\n\n` +
              `📱 Número: ${numero}\n\n` +
              `Ve a WhatsApp > Dispositivos vinculados > Vincular con número de teléfono, e ingresa el código de abajo.\n\n` +
              `⏳ El código expira en unos minutos, si no lo usas a tiempo escribe *code* de nuevo.`,
          });
          await sock.sendMessage(destino, { text: code });
        },
        onEstado: async (texto) => {
          try {
            await sock.sendMessage(destino, { text: texto });
          } catch (_) {}
        },
      });
    } catch (err) {
      await sock.sendMessage(destino, {
        text: `❌ ${err.message || "No se pudo generar tu código."}`,
      });
    }
  },
};
