export default {
  command: ["grupoinfo", "infogrupo"],
  category: "Grupo",
  description: "Muestra información del grupo: nombre, descripción, miembros y admins.",
  groupOnly: true,

  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    let metadata;
    try {
      metadata = await sock.groupMetadata(chatId);
    } catch (e) {
      return await sock.sendMessage(
        chatId,
        { text: "❌ No pude obtener la información del grupo." },
        { quoted: msg }
      );
    }

    const totalMiembros = metadata.participants.length;
    const admins = metadata.participants.filter((p) => p.admin);
    const totalAdmins = admins.length;

    const fechaCreacion = metadata.creation
      ? new Date(metadata.creation * 1000).toLocaleDateString("es-HN")
      : "Desconocida";

    const descripcion = metadata.desc?.trim()
      ? metadata.desc.trim()
      : "_Sin descripción_";

    let texto = `╭─「 📋 *INFO DEL GRUPO* 」\n`;
    texto += `│ 🏷️ Nombre: *${metadata.subject}*\n`;
    texto += `│ 🆔 ID: ${metadata.id}\n`;
    texto += `│ 📅 Creado: ${fechaCreacion}\n`;
    texto += `│ 👥 Miembros: ${totalMiembros}\n`;
    texto += `│ 👑 Admins: ${totalAdmins}\n`;
    texto += `╰────────────────\n\n`;
    texto += `📝 *Descripción:*\n${descripcion}`;

    await sock.sendMessage(chatId, { text: texto }, { quoted: msg });
  },
};
