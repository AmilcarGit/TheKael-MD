export default {
  command: ["reiniciar", "restart"],
  category: "Owner",
  description: "Reinicia el bot por completo (incluye subbots).",
  ownerOnly: true,

  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    await sock.sendMessage(
      chatId,
      { text: "🔄 Reiniciando TheYui-MD, vuelvo en unos segundos..." },
      { quoted: msg }
    );

    setTimeout(() => {
      process.exit(0);
    }, 1500);
  },
};
