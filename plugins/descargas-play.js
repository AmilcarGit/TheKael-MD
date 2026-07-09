import { config } from "../config.js";
import { registrarManejador } from "../interactiveManager.js";

const { baseUrl, apiKey } = config.apis.edward;
const MAX_RESULTADOS = 8;
const TIEMPO_EXPIRACION_MS = 5 * 60 * 1000;

const busquedasPendientes = new Map();

function formatearDuracion(segundos) {
  if (!segundos && segundos !== 0) return "Desconocida";
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${seg}`;
}

async function descargarYEnviarAudio(sock, chatId, msg, video, tituloFallback) {
  const downloadUrl = `${baseUrl}/api/download/ytaudio?url=${encodeURIComponent(
    video.url
  )}&apiKey=${apiKey}`;
  const downloadRes = await fetch(downloadUrl);
  const downloadData = await downloadRes.json();

  const info = downloadData.result;

  if (!downloadData.status || !info || !info.download_url) {
    await sock.sendMessage(
      chatId,
      { text: "❌ No pude obtener el audio de ese video, intenta con otra canción." },
      { quoted: msg }
    );
    return;
  }

  const titulo = info.title || video.title || tituloFallback;
  const duracion = formatearDuracion(info.duration);

  const archivoRes = await fetch(info.download_url);
  const tipoContenido = archivoRes.headers.get("content-type") || "";

  if (!archivoRes.ok || !tipoContenido.startsWith("audio")) {
    await sock.sendMessage(
      chatId,
      { text: "❌ El servidor no devolvió un audio válido, intenta de nuevo en unos segundos." },
      { quoted: msg }
    );
    return;
  }

  const bufferAudio = Buffer.from(await archivoRes.arrayBuffer());

  if (bufferAudio.length < 5000) {
    await sock.sendMessage(
      chatId,
      { text: "❌ El audio descargado llegó incompleto o dañado, intenta con otra canción." },
      { quoted: msg }
    );
    return;
  }

  if (info.thumbnail) {
    await sock.sendMessage(
      chatId,
      {
        image: { url: info.thumbnail },
        caption:
          `❀ *${titulo}*\n` +
          `⏱️ Duración: ${duracion}\n\n` +
          `_Enviando audio..._`,
      },
      { quoted: msg }
    );
  }

  await sock.sendMessage(
    chatId,
    {
      audio: bufferAudio,
      mimetype: "audio/mpeg",
      fileName: `${titulo.slice(0, 60)}.mp3`,
    },
    { quoted: msg }
  );
}

registrarManejador("playselect", async (sock, msg, context, rowId) => {
  const { chatId, sender } = context;
  const [, chatKey, indiceStr] = rowId.split(":");
  const indice = parseInt(indiceStr, 10);

  const pendiente = busquedasPendientes.get(chatKey);

  if (!pendiente || Date.now() > pendiente.expira) {
    await sock.sendMessage(
      chatId,
      { text: "⌛ Esta búsqueda ya expiró, vuelve a usar *play* para buscar de nuevo." },
      { quoted: msg }
    );
    return;
  }

  if (pendiente.solicitante !== sender) {
    await sock.sendMessage(
      chatId,
      { text: "⚠️ Solo quien pidió la búsqueda puede elegir una opción." },
      { quoted: msg }
    );
    return;
  }

  const video = pendiente.resultados[indice];
  if (!video) {
    await sock.sendMessage(
      chatId,
      { text: "❌ Esa opción ya no es válida." },
      { quoted: msg }
    );
    return;
  }

  busquedasPendientes.delete(chatKey);

  await sock.sendMessage(
    chatId,
    { text: `⬇️ Descargando *${video.title}*...` },
    { quoted: msg }
  );

  try {
    await descargarYEnviarAudio(sock, chatId, msg, video, pendiente.query);
  } catch (err) {
    console.log("❌ Error descargando selección de play:", err);
    await sock.sendMessage(
      chatId,
      { text: "❌ Ocurrió un error descargando la canción." },
      { quoted: msg }
    );
  }
});

export default {
  command: ["play", "mp3", "musica"],
  category: "Descargas",
  description: "Busca una canción en YouTube y muestra una lista para elegir. Uso: play <nombre de la canción>",
  run: async (sock, msg, args, context) => {
    const { chatId, sender } = context;
    const query = args.join(" ").trim();

    if (!query) {
      await sock.sendMessage(
        chatId,
        { text: "❀ Escribe el nombre de la canción.\nEjemplo: *play* shape of you" },
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
      resultados = resultados.filter((v) => v && v.url).slice(0, MAX_RESULTADOS);

      if (resultados.length === 0) {
        await sock.sendMessage(
          chatId,
          { text: "❌ No encontré resultados para esa búsqueda." },
          { quoted: msg }
        );
        return;
      }

      const chatKey = `${chatId}_${sender}_${Date.now()}`;
      busquedasPendientes.set(chatKey, {
        resultados,
        query,
        solicitante: sender,
        expira: Date.now() + TIEMPO_EXPIRACION_MS,
      });

      const filas = resultados.map((video, i) => ({
        title: video.title?.slice(0, 60) || `Resultado ${i + 1}`,
        description: `⏱️ ${formatearDuracion(video.duration)}${
          video.author?.name ? ` · 📺 ${video.author.name}` : ""
        }`,
        rowId: `playselect:${chatKey}:${i}`,
      }));

      await sock.sendMessage(
        chatId,
        {
          text: `Encontré *${resultados.length}* resultados para *${query}*.\nElige el que quieras descargar 👇`,
          footer: "TheYui-MD 💕",
          title: "🎵 Resultados de búsqueda",
          buttonText: "Ver opciones",
          sections: [
            {
              title: "Resultados",
              rows: filas,
            },
          ],
        },
        { quoted: msg }
      );
    } catch (err) {
      console.log("❌ Error en el comando play:", err);
      await sock.sendMessage(
        chatId,
        { text: "❌ Ocurrió un error buscando la canción." },
        { quoted: msg }
      );
    }
  },
};
