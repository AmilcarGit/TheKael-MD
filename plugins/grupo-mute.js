export default {
  command: ["mute", "silenciar"],
  category: "Grupo",
  description: "Silencia a un usuario por un tiempo determinado. Ej: mute @user 30m",
  groupOnly: true,
  adminOnly: true,
  requiereBotAdmin: true,

  async run(sock, msg, args, context) {
    const { chatId } = context;

    let numero = "";
    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
      numero = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      numero = args[0].includes("@") ? args[0] : args[0] + "@s.whatsapp.net";
    }

    if (!numero) {
      return await sock.sendMessage(chatId, {
        text: "❀ Menciona al usuario y especifica el tiempo. Ej: *mute @usuario 30m*"
      }, { quoted: msg });
    }

    // Parsear tiempo (ej: "30m", "2h", "1d")
    const tiempoStr = args[args.length - 1] || "10m";
    let ms = 10 * 60 * 1000; // default 10 min

    if (tiempoStr.endsWith("m")) ms = parseInt(tiempoStr) * 60 * 1000;
    else if (tiempoStr.endsWith("h")) ms = parseInt(tiempoStr) * 60 * 60 * 1000;
    else if (tiempoStr.endsWith("d")) ms = parseInt(tiempoStr) * 24 * 60 * 60 * 1000;

    // Usar permissionsUpdate de Baileys para restringir el usuario
    try {
      await sock.groupParticipantsUpdate(chatId, [numero], "restrict");
      await sock.sendMessage(chatId, {
        text: `🔇 @${numero.split("@")[0]} ha sido *silenciado* por ${tiempoStr}.\n` +
              `No podrá enviar mensajes hasta que se cumpla el tiempo.`
      }, { quoted: msg });

      // Restablecer permisos después del tiempo
      setTimeout(async () => {
        try {
          await sock.groupParticipantsUpdate(chatId, [numero], "unrestrict");
          await sock.sendMessage(chatId, {
            text: `🔓 @${numero.split("@")[0]} ya puede enviar mensajes nuevamente.`
          });
        } catch (_) {}
      }, ms);

    } catch (err) {
      await sock.sendMessage(chatId, {
        text: "❌ No pude silenciar al usuario. Asegúrate de que soy admin del grupo."
      }, { quoted: msg });
    }
  },
};
