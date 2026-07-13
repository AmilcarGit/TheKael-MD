import { config } from "../config.js";

export default {
  command: ["creador", "owner", "dueño", "dueno"],
  category: "General",
  description: "Muestra información de contacto del creador del bot.",

  run: async (sock, msg, args, context) => {
    const { chatId } = context;
    const numeros = config.ownerNumbers;

    const listaNumeros = numeros.map((n) => `📱 wa.me/${n}`).join("\n");

    const texto =
      `👑 *Creador de ${config.botName}*\n\n` +
      `🦋 Nombre: ${config.creator}\n` +
      `${listaNumeros}\n\n` +
      `_Si tienes dudas, sugerencias o encontraste un error, puedes escribirle directo._`;

    await sock.sendMessage(chatId, { text: texto }, { quoted: msg });

    for (const numero of numeros) {
      const vcard =
        `BEGIN:VCARD\n` +
        `VERSION:3.0\n` +
        `FN:${config.creator}\n` +
        `ORG:${config.botName};\n` +
        `TEL;type=CELL;type=VOICE;waid=${numero}:+${numero}\n` +
        `END:VCARD`;

      await sock.sendMessage(
        chatId,
        {
          contacts: {
            displayName: config.creator,
            contacts: [{ vcard }],
          },
        },
        { quoted: msg }
      );
    }
  },
};
