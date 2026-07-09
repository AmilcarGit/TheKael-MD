import { obtenerUsuario, guardarUsuario, formatearMonto } from "../economyDB.js";

export default {
  command: ["daryui", "givemoney", "addmoney"],
  category: "Owner",
  description: "Da Yui a un usuario (solo owner). Uso: daryui <número> <cantidad>",
  ownerOnly: true,
  run: async (sock, msg, args, context) => {
    const { chatId, sender } = context;
    const numeroOwner = sender.split("@")[0].split(":")[0];

    let destinatario = null;
    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
      destinatario = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
      destinatario = msg.message.extendedTextMessage.contextInfo.participant;
    } else if (args[0] && args[0].match(/^\d+$/)) {
      destinatario = `${args[0]}@s.whatsapp.net`;
    }

    if (!destinatario) {
      return await sock.sendMessage(
        chatId,
        { text: "🌸 Menciona a un usuario, responde a su mensaje o escribe su número.\nEjemplo: *daryui 51910227479 500*" },
        { quoted: msg }
      );
    }

    const numeroDestino = destinatario.split("@")[0].split(":")[0];
    const cantidad = parseInt(args.find(a => /^\d+$/.test(a)), 10);

    if (!cantidad || cantidad <= 0) {
      return await sock.sendMessage(
        chatId,
        { text: "💵 Escribe una cantidad válida para dar.\nEjemplo: *daryui 500*" },
        { quoted: msg }
      );
    }

    const usuario = obtenerUsuario(numeroDestino);
    const nuevoSaldo = usuario.saldo + cantidad;
    guardarUsuario(numeroDestino, { saldo: nuevoSaldo });

    await sock.sendMessage(
      chatId,
      {
        text: `✅ *Transferencia de Yui*\n\n💵 Has dado ${formatearMonto(cantidad)} a @${numeroDestino}\n💰 Nuevo saldo: ${formatearMonto(nuevoSaldo)}\n\n🌸 ¡Que disfrute su recompensa!`,
        mentions: [destinatario, sender]
      },
      { quoted: msg }
    );
  }
};