import { obtenerConfigGrupo, actualizarConfigGrupo } from "../groupSettings.js";

export default {
  command: ["setyui"],
  category: "Grupo",
  description: "Activa o desactiva que solo el bot principal responda en el grupo (los subbots quedan en silencio). Uso: seryui on / seryui off",
  groupOnly: true,
  adminOnly: true,
  soloBotPrincipal: true,

  run: async (sock, msg, args, context) => {
    const { chatId } = context;
    const config = obtenerConfigGrupo(chatId);
    const opcion = args[0]?.toLowerCase();

    if (opcion !== "on" && opcion !== "off") {
      return await sock.sendMessage(
        chatId,
        {
          text:
            `🦋 *Modo exclusivo TheYui-MD*\n\n` +
            `Estado actual: ${config.soloPrincipal ? "✅ Activado" : "❌ Desactivado"}\n\n` +
            `Uso: *seryui on* — solo responde el bot principal, los subbots quedan en silencio en este grupo.\n` +
            `*seryui off* — todos los bots (principal y subbots) vuelven a responder normal.`,
        },
        { quoted: msg }
      );
    }

    const activar = opcion === "on";
    actualizarConfigGrupo(chatId, { soloPrincipal: activar });

    return await sock.sendMessage(
      chatId,
      {
        text: activar
          ? "✅ Listo, de ahora en adelante solo yo (el bot principal) responderé en este grupo. Los subbots quedan en silencio aquí."
          : "✅ Listo, los subbots pueden volver a responder normalmente en este grupo.",
      },
      { quoted: msg }
    );
  },
};
