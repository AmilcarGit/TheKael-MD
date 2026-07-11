import { config } from "../config.js";

const { baseUrl, apiKey } = config.apis.edward;
const MAX_RESULTADOS = 8;

function formatearDuracion(segundos) {
  if (!segundos && segundos !== 0) return "Desconocida";
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60).toString().padStart(2, "0");
  return `${min}:${seg}`;
}

function formatearVistas(vistas) {
  if (!vistas) return "N/A";
  const num = parseInt(vistas);
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function obtenerMiniatura(video) {
  return (
    video.thumbnail ||
    video.cover ||
    video.image ||
    video.video_thumbnail ||
    video.origin_cover ||
    null
  );
}

export default {
  command: ["tiktoksearch", "ttsearch"],
  category: "busquedas",
  description: "Busca videos de TikTok y muestra sus miniaturas. Uso: tiktoksearch <búsqueda>",
  run: async (sock, msg, args, context) => {
    const { chatId } = context;
    const query = args.join(" ").trim();

    if (!query) {
      await sock.sendMessage(
        chatId,
        { text: "🌸 Escribe lo que quieres buscar en TikTok.\nEjemplo: *tiktoksearch* baile" },
        { quoted: msg }
      );
      return;
    }

    try {
      await sock.sendMessage(
        chatId,
        { text: `🔎 Buscando *${query}* en TikTok...` },
        { quoted: msg }
      );

      const searchUrl = `${baseUrl}/api/search/tiktok?apiKey=${apiKey}&query=${encodeURIComponent(query)}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      let resultados = searchData.result || searchData.data || searchData.results || [];
      if (!Array.isArray(resultados)) {
        resultados = resultados ? [resultados] : [];
      }
      resultados = resultados.slice(0, MAX_RESULTADOS);

      if (resultados.length === 0) {
        await sock.sendMessage(
          chatId,
          { text: "❌ No encontré videos para esa búsqueda." },
          { quoted: msg }
        );
        return;
      }

      if (!global.tiktokCache) global.tiktokCache = new Map();
      global.tiktokCache.set(chatId, resultados);

      await sock.sendMessage(
        chatId,
        { text: `🌸 Encontré *${resultados.length}* videos para *${query}*, aquí los tienes 👇` },
        { quoted: msg }
      );

      for (let i = 0; i < resultados.length; i++) {
        const video = resultados[i];
        const miniatura = obtenerMiniatura(video);
        const titulo = video.title || "Sin título";
        const autor = video.author?.nickname || video.author || video.uploader || "Desconocido";
        const duracion = formatearDuracion(video.duration);
        const vistas = formatearVistas(video.views || video.stats?.plays);

        const caption =
          `🎥 *${i + 1}.* ${titulo.slice(0, 60)}\n` +
          `👤 ${autor}  ⏱️ ${duracion}  👁️ ${vistas}`;

        try {
          if (miniatura) {
            await sock.sendMessage(
              chatId,
              { image: { url: miniatura }, caption },
              { quoted: msg }
            );
          } else {
            await sock.sendMessage(chatId, { text: caption }, { quoted: msg });
          }
        } catch (err) {
          console.error(`❌ No se pudo enviar la miniatura ${i + 1} de TikTok:`, err);
        }
      }

      await sock.sendMessage(
        chatId,
        {
          text:
            `💕 Para descargar (costo 15 Yui) escribe: *tiktok <número>*\n` +
            `🌹 Ejemplo: *tiktok 1*`,
        },
        { quoted: msg }
      );
    } catch (err) {
      console.error("❌ Error en tiktoksearch:", err);
      await sock.sendMessage(
        chatId,
        { text: "❌ Ocurrió un error buscando en TikTok." },
        { quoted: msg }
      );
    }
  },
};
