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

const MIN_RESULTADOS = 10;
const MAX_RESULTADOS = 15;

export default {
  command: ["ytsearch", "buscarvideo", "ysearch"],
  category: "Descargas",
  description:
    "Busca en YouTube y muestra una lista de resultados. Uso: ytsearch <nombre>",
  run: async (sock, msg, args, context) => {
    const { chatId } = context;
    const query = args.join(" ").trim();

    if (!query) {
      await sock.sendMessage(
        chatId,
        { text: "❀ Escribe qué quieres buscar.\nEjemplo: *ytsearch* shape of you" },
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

      const searchUrl = `${baseUrl}/api/search/youtube?apiKey=${apiKey}&query=${encodeURIComponent(
        query
      )}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      let resultados =
        searchData.result || searchData.data || searchData.results || [];
      if (!Array.isArray(resultados)) {
        resultados = resultados ? [resultados] : [];
      }

      if (resultados.length === 0) {
        await sock.sendMessage(
          chatId,
          { text: "❌ No encontré resultados para esa búsqueda." },
          { quoted: msg }
        );
        return;
      }

      // Siempre mostramos entre 10 y 15 resultados (según lo que
      // devuelva la API; si trae menos de 10, mostramos los que haya).
      const cantidad = Math.min(
        Math.max(resultados.length, MIN_RESULTADOS),
        MAX_RESULTADOS
      );
      const lista = resultados.slice(0, cantidad);

      let texto = `╔═══════════════════╗\n║  🔎 *RESULTADOS YOUTUBE*  ║\n╚═══════════════════╝\n\n`;
      texto += `Búsqueda: *${query}*\n\n`;

      lista.forEach((video, i) => {
        const titulo = video.title || "Sin título";
        const duracion = formatearDuracion(video.duration);
        const canal = video.author?.name || video.channel || "Desconocido";

        texto += `*${i + 1}.* ${titulo}\n`;
        texto += `   ⏱️ ${duracion} · 📺 ${canal}\n`;
        texto += `   🔗 ${video.url}\n\n`;
      });

      texto += `_Usa *play <nombre>* o *video <nombre/link>* para descargar cualquiera de estos._`;

      await sock.sendMessage(chatId, { text: texto }, { quoted: msg });
    } catch (err) {
      console.log("❌ Error en el comando ytsearch:", err);
      await sock.sendMessage(
        chatId,
        { text: "❌ Ocurrió un error buscando en YouTube." },
        { quoted: msg }
      );
    }
  },
};
