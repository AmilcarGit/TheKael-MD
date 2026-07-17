import { config } from "../config.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MENU_IMAGE_PATH = path.join(__dirname, "..", "assets", "menu.jpg");

let imagenMenuCache = null;

async function obtenerImagenMenu() {
  if (imagenMenuCache) return imagenMenuCache;
  try {
    imagenMenuCache = fs.readFileSync(MENU_IMAGE_PATH);
    return imagenMenuCache;
  } catch (err) {
    return null;
  }
}

const ANCHO = 34;
const LINEA = "⋆".repeat(ANCHO);
const LINEA_FINA = "─".repeat(ANCHO);

const ICONOS_CATEGORIA = {
  General: "🦋",
  Grupo: "👑",
  Descargas: "🌹",
  Busquedas: "🔎",
  Anime: "💕",
  Economia: "💰",
  Diversion: "🎮",
  Diversión: "🎮",
  Utilidades: "🔧",
  Media: "✨",
  Owner: "💎",
  Info: "🎀",
  Otros: "🌸",
};

function formatearUptime(segundos) {
  const d = Math.floor(segundos / 86400);
  const h = Math.floor((segundos % 86400) / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = Math.floor(segundos % 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function filaConPuntos(icono, etiqueta, valor) {
  const inicio = `  ${icono} ${etiqueta} `;
  const fin = ` ${valor}`;
  const puntos = Math.max(2, ANCHO - inicio.length - fin.length);
  return inicio + "·".repeat(puntos) + fin;
}

function tituloSeccion(icono, texto, cantidad) {
  return `\n  ${icono} 『 *${texto.toUpperCase()}* 』 — ${cantidad}\n  ${LINEA_FINA}`;
}

export default {
  command: ["menu", "help", "ayuda"],
  category: "General",
  description: "Muestra el menú de comandos.",
  run: async (sock, msg, args, context) => {
    const { sender, chatId, allPlugins } = context;

    const categorias = {};
    for (const plugin of allPlugins) {
      const categoria = plugin.category || "Otros";
      if (!categorias[categoria]) categorias[categoria] = [];
      categorias[categoria].push(plugin);
    }
    const nombresCategorias = Object.keys(categorias).sort();

    const fecha = new Date().toLocaleString("es-PE", {
      timeZone: "America/Lima",
      dateStyle: "long",
      timeStyle: "short",
    });
    const totalComandos = allPlugins.reduce((acc, p) => acc + p.command.length, 0);
    const numero = sender.split("@")[0].split(":")[0];
    const uptime = formatearUptime(process.uptime());

    let texto = `╭${LINEA}╮\n`;
    texto += `   👑 ${config.botName.toUpperCase()} 👑\n`;
    texto += `   ✧ Asistente Virtual Premium ✧\n`;
    texto += `╰${LINEA}╯\n\n`;

    texto += filaConPuntos("👤", "Usuario", `@${numero}`) + "\n";
    texto += filaConPuntos("💎", "Creador", config.creator) + "\n";
    texto += filaConPuntos("⚡", "Comandos", totalComandos) + "\n";
    texto += filaConPuntos("📦", "Plugins", allPlugins.length) + "\n";
    texto += filaConPuntos("⏱️", "Actividad", uptime) + "\n";
    texto += filaConPuntos("🕐", "Fecha", fecha) + "\n";

texto += filaConPuntos ("♬MIS COMANDOS𝄞", + "\n";

    for (const categoria of nombresCategorias) {
      const icono = ICONOS_CATEGORIA[categoria] || "🌸";
      texto += tituloSeccion(icono, categoria, categorias[categoria].length) + "\n";

      categorias[categoria].forEach((plugin, i) => {
        const comandoPrincipal = plugin.command[0];
        const alias = plugin.command.slice(1).length > 0
          ? ` · ${plugin.command.slice(1).join(", ")}`
          : "";
        texto += `  ➤ *${comandoPrincipal}*${alias}\n`;
        texto += `     ${plugin.description || "Sin descripción"}\n`;
        if (i < categorias[categoria].length - 1) texto += `\n`;
      });
    }

    texto += `\n${LINEA}\n`;
    texto += `   🌹 ${config.botName} — sin prefijo 🌹\n`;
    texto += `   v${process.env.npm_package_version || "1.0.0"} · hecho con 💕 por ${config.creator}`;

    const imagen = await obtenerImagenMenu();
    if (imagen) {
      await sock.sendMessage(
        chatId,
        { image: imagen, caption: texto, mentions: [sender] },
        { quoted: msg }
      );
    } else {
      await sock.sendMessage(
        chatId,
        { text: texto, mentions: [sender] },
        { quoted: msg }
      );
    }
  },
};
