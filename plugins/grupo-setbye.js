import { actualizarConfigGrupo, obtenerConfigGrupo } from "../groupSettings.js";

export default {
  command: ["setbye"],
  category: "Grupo",
  description:
    "Personaliza el mensaje de despedida. Uso: setbye <texto> (usa {user}, {grupo}, {total}). setbye reset para volver al mensaje por defecto.",
  groupOnly: true,
  adminOnly: true,

  run: async (sock, msg, args, context) => {
    const { chatId } = context;
    const opcion = args[0]?.toLowerCase();

    if (opcion === "reset" || opcion === "borrar") {
      actualizarConfigGrupo(chatId, { despedidaCustom: null });
      return await sock.sendMessage(
        chatId,
        { text: "✅ Despedida restaurada al mensaje por defecto." },
        { quoted: msg }
      );
    }

    const texto = args.join(" ").trim();

    if (!texto) {
      const actual = obtenerConfigGrupo(chatId);
      return await sock.sendMessage(
        chatId,
        {
          text:
            `╭─「 🌸 *SETBYE* 」\n` +
            `│ Uso: *setbye <texto>*\n` +
            `│\n` +
            `│ Variables disponibles:\n` +
            `│ • {user} — menciona al que se fue\n` +
            `│ • {grupo} — nombre del grupo\n` +
            `│ • {total} — total de miembros\n` +
            `│\n` +
            `│ *setbye reset* — volver al default\n` +
            `╰────────────────\n\n` +
            (actual.despedidaCustom
              ? `📋 Mensaje actual:\n${actual.despedidaCustom}`
              : `📋 Actualmente usando el mensaje por defecto.`),
        },
        { quoted: msg }
      );
    }

    actualizarConfigGrupo(chatId, { despedidaCustom: texto });

    await sock.sendMessage(
      chatId,
      {
        text:
          `✅ Mensaje de despedida actualizado.\n\n` +
          `📋 Vista previa:\n${texto
            .replace(/{user}/g, "@usuario")
            .replace(/{grupo}/g, "Este Grupo")
            .replace(/{total}/g, "49")}`,
      },
      { quoted: msg }
    );
  },
};
