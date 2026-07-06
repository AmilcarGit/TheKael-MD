import { config } from "../config.js";

const { baseUrl, apiKey } = config.apis.edward;

function formatearDuracion(segundos) {
  if (!segundos && segundos !== 0) return "Desconocida";
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${seg}`;
}

function bytesToMB(bytes) {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(2) + " MB";
}

export default {
  command: ["video", "ytvideo", "mp4"],
  category: "Descargas",
  description: "Busca un video en YouTube y lo envía. Uso: video <nombre del video>",
  run: async (sock, msg, args, context) => {
    const { chatId } = context;
    const query = args.join(" ").trim();

    if (!query) {
      await sock.sendMessage(
        chatId,
        { text: "❀ Escribe el nombre del video.\nEjemplo: *video* my heart will go on" },
        { quoted: msg }
      );
      return;
    }

    try {
      await sock.sendMessage(
        chatId,
        { text: `🔎 Buscando *${query}*...` },
        { quoted: msg }
      );

      const searchUrl = `${baseUrl}/api/search/youtube?apiKey=${apiKey}&query=${encodeURIComponent(query)}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      const resultados = searchData.result || searchData.data || searchData.results || [];
      const primerVideo = Array.isArray(resultados) ? resultados[0] : resultados;

      if (!primerVideo || !primerVideo.url) {
        await sock.sendMessage(
          chatId,
          { text: "❌ No encontré resultados para esa búsqueda." },
          { quoted: msg }
        );
        return;
      }

      const downloadUrl = `${baseUrl}/api/download/ytvideo?url=${encodeURIComponent(primerVideo.url)}&apiKey=${apiKey}`;
      const downloadRes = await fetch(downloadUrl);
      const downloadData = await downloadRes.json();

      const info = downloadData.result;

      if (!downloadData.status || !info || !info.download_url) {
        await sock.sendMessage(
          chatId,
          { text: "❌ No pude obtener el video, intenta con otro nombre." },
          { quoted: msg }
        );
        return;
      }

      const titulo = info.title || primerVideo.title || query;
      const duracion = formatearDuracion(info.duration);
      const tamaño = bytesToMB(info.size);

      if (info.thumbnail) {
        await sock.sendMessage(
          chatId,
          {
            image: { url: info.thumbnail },
            caption:
              `❀ *${titulo}*\n` +
              `⏱️ Duración: ${duracion}\n` +
              `📦 Tamaño: ${tamaño}\n\n` +
              `_Enviando video..._`,
          },
          { quoted: msg }
        );
      }

      await sock.sendMessage(
        chatId,
        {
          video: { url: info.download_url },
          caption: `📹 ${titulo}`,
          fileName: `${titulo.slice(0, 60)}.mp4`,
          mimetype: "video/mp4",
        },
        { quoted: msg }
      );
    } catch (err) {
      console.log("❌ Error en el comando video:", err);
      await sock.sendMessage(
        chatId,
        { text: "❌ Ocurrió un error buscando o descargando el video." },
        { quoted: msg }
      );
    }
  },
};