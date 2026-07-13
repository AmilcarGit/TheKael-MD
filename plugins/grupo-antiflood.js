import { actualizarConfigGrupo, obtenerConfigGrupo } from "../groupSettings.js";

export default {
  command: ["antiflood"],
  category: "Grupo",
  description: "Expulsa a quien mande demasiados mensajes muy seguido. Uso: antiflood on / antiflood off",
  groupOnly: true,
  adminOnly: true,

  run: async (sock, msg, args, context) => {
    const { chatId } = context;
    const opcion = args[0]?.toLowerCase();

    if (opcion !== "on" && opcion !== "off") {
      const actual = obtenerConfigGrupo(chatId);
      return await sock.sendMessage(
        chatId,
        {
          text:
            `🌊 *Antiflood*\n\n` +
            `Estado actual: *${actual.antiflood ? "Activado ✅" : "Desactivado ❌"}*\n\n` +
            `💕 *antiflood on* — activarlo\n` +
            `💕 *antiflood off* — desactivarlo`,
        },
        { quoted: msg }
      );
    }

    const nuevoValor = opcion === "on";
    actualizarConfigGrupo(chatId, { antiflood: nuevoValor });

    await sock.sendMessage(
      chatId,
      {
        text: nuevoValor
          ? "✅ Antiflood activado. Si alguien manda muchos mensajes seguidos muy rápido, se le borran, se le advierte, y si insiste se le expulsa."
          : "❌ Antiflood desactivado en este grupo.",
      },
      { quoted: msg }
    );
  },
};
