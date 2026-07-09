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

function barraProgreso(porcentaje = 100, largo = 15) {
  const llenos = Math.round((porcentaje / 100) * largo);
  return "▓".repeat(llenos) + "░".repeat(largo - llenos);
}

function mensajeCargando() {
  const estados = [
    "🔄 Inicializando motores de descarga...",
    "🔍 Analizando enlace de YouTube...",
    "📡 Conectando con el servidor...",
    "⚡ Procesando paquete de video...",
    "🎯 Preparando archivo para envío...",
  ];
  return estados[Math.floor(Math.random() * estados.length)];
}

function esLinkYouTube(url) {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
  return pattern.test(url);
}

export default {
  command: ["video", "ytvideo", "mp4"],
  category: "Descargas",
  description:
    "Busca o descarga un video de YouTube. Uso: video <nombre> o video <link de YouTube>",
  run: async (sock, msg, args, context) => {
    const { chatId } = context;
    const entrada = args.join(" ").trim();

    if (!entrada) {
      await sock.sendMessage(
        chatId,
        {
          text:
            "❀ Escribe el nombre del video o pega un enlace de YouTube.\n" +
            "Ejemplo: *video* shape of you\n" +
            "Ejemplo: *video* https://youtu.be/abc123",
        },
        { quoted: msg }
      );
      return;
    }

    try {
      let url = entrada;
      let tituloBusqueda = entrada;

      if (!esLinkYouTube(entrada)) {
        await sock.sendMessage(
          chatId,
          { text: `🔎 Buscando *${entrada}*...` },
          { quoted: msg }
        );

        const searchUrl = `${baseUrl}/api/search/youtube?apiKey=${apiKey}&query=${encodeURIComponent(
          entrada
        )}`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        const resultados =
          searchData.result || searchData.data || searchData.results || [];
        const primerVideo = Array.isArray(resultados) ? resultados[0] : resultados;

        if (!primerVideo || !primerVideo.url) {
          await sock.sendMessage(
            chatId,
            { text: "❌ No encontré resultados para esa búsqueda." },
            { quoted: msg }
          );
          return;
        }

        url = primerVideo.url;
        tituloBusqueda = primerVideo.title || entrada;
      }

      await sock.sendMessage(
        chatId,
        { text: `╔═══════════════════╗\n║  🚀 THEYUI-MD · DOWNLOADER    ║\n╚═══════════════════╝\n\n${mensajeCargando()}` },
        { quoted: msg }
      );

      const downloadUrl = `${baseUrl}/api/download/ytvideo?url=${encodeURIComponent(url)}&apiKey=${apiKey}`;
      const downloadRes = await fetch(downloadUrl);
      const downloadData = await downloadRes.json();

      const info = downloadData.result;

      if (!downloadData.status || !info || !info.download_url) {
        await sock.sendMessage(
          chatId,
          { text: "❌ No pude descargar el video. Verifica que el enlace o la búsqueda sean válidos." },
          { quoted: msg }
        );
        return;
      }

      const titulo = info.title || tituloBusqueda || "Video sin título";
      const duracion = formatearDuracion(info.duration);
      const tamaño = bytesToMB(info.size);
      const vistas = info.views ? new Intl.NumberFormat().format(info.views) : "N/A";
      const likes = info.likes ? new Intl.NumberFormat().format(info.likes) : "N/A";

      const archivoRes = await fetch(info.download_url);
      const tipoContenido = archivoRes.headers.get("content-type") || "";

      if (!archivoRes.ok || !tipoContenido.startsWith("video")) {
        await sock.sendMessage(
          chatId,
          { text: "❌ El servidor no devolvió un video válido, intenta de nuevo en unos segundos." },
          { quoted: msg }
        );
        return;
      }

      const bufferVideo = Buffer.from(await archivoRes.arrayBuffer());

      if (bufferVideo.length < 10000) {
        await sock.sendMessage(
          chatId,
          { text: "❌ El video descargado llegó incompleto o dañado, intenta con otro." },
          { quoted: msg }
        );
        return;
      }

      if (info.thumbnail) {
        const caption = `╔═══════════════════╗
║  🎬 *VIDEO LISTO*      ║
╠════════════════════╣
║  📌 Título: ${titulo.slice(0, 40)}${titulo.length > 40 ? "…" : ""}
║  ⏱️  Duración: ${duracion}
║  📦 Tamaño: ${tamaño}
║  👁️  Vistas: ${vistas}
║  👍 Likes: ${likes}
║  📊 Calidad: ${info.quality || "Media"}
║  ───────────────────────
║  ${barraProgreso(100)} 100%
║  ✅ Enviando video...
╚═════════════════════════╝
⚡ TheYui-MD · Tecnología de vanguardia`;

        await sock.sendMessage(
          chatId,
          {
            image: { url: info.thumbnail },
            caption: caption,
          },
          { quoted: msg }
        );
      }

      await sock.sendMessage(
        chatId,
        {
          video: bufferVideo,
          caption: `📹 *${titulo}*\n⏱️ ${duracion} · 📦 ${tamaño}\n\n✨ *TheYui-MD* — Más que un bot, una leyenda.`,
          fileName: `${titulo.slice(0, 60)}.mp4`,
          mimetype: "video/mp4",
        },
        { quoted: msg }
      );
    } catch (err) {
      console.log("❌ Error en el comando video:", err);
      await sock.sendMessage(
        chatId,
        { text: "❌ Ocurrió un error al procesar el video." },
        { quoted: msg }
      );
    }
  },
};