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

const ICONOS_CATEGORIA = {
  General: "🦋",
  Grupo: "👑",
  Descargas: "🌹",
  Anime: "💕",
  Owner: "💎",
  Info: "🎀",
  Otros: "✨",
};

function formatearUptime(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = Math.floor(segundos % 60);
  return `${h}h ${m}m ${s}s`;
}

export default {
  command: ["menu", "help", "ayuda"],
  category: "General",
  description: "Muestra el menú de comandos ordenado por categorías.",
  run: async (sock, msg, args, context) => {
    const { sender, chatId, allPlugins } = context;

    const categorias = {};
    for (const plugin of allPlugins) {
      const categoria = plugin.category || "Otros";
      if (!categorias[categoria]) categorias[categoria] = [];
      categorias[categoria].push(plugin);
    }

    const fecha = new Date().toLocaleString("es-HN", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const totalComandos = allPlugins.reduce(
      (acc, p) => acc + p.command.length,
      0
    );
    const numero = sender.split("@")[0].split(":")[0];
    const uptime = formatearUptime(process.uptime());
    const nombresCategorias = Object.keys(categorias).sort();

    let texto = `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n`;
    texto += `   👑 *${config.botName.toUpperCase()}* 👑\n`;
    texto += `   _Tu waifu inteligente para WhatsApp_ 🦋\n`;
    texto += `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n\n`;

    texto += `╭─🌹 *ACERCA DE MÍ* 🌹\n`;
    texto += `│ Hola, soy *${config.botName}* 💕\n`;
    texto += `│ Tu asistente waifu, creada para\n`;
    texto += `│ hacer tu día más fácil y divertido.\n`;
    texto += `│ Siempre contigo, siempre leal. 💖\n`;
    texto += `╰────────────────╯\n\n`;

    texto += `╭─🎀 *ESTADÍSTICAS* 🎀\n`;
    texto += `│ 🟢 Estado: Online\n`;
    texto += `│ 💎 Creador: ${config.creator}\n`;
    texto += `│ 👤 Usuario: @${numero}\n`;
    texto += `│ ⏱️ Activa desde: ${uptime}\n`;
    texto += `│ ⚡ Comandos: ${totalComandos}\n`;
    texto += `│ 📦 Plugins: ${allPlugins.length}\n`;
    texto += `│ 🕐 Fecha: ${fecha}\n`;
    texto += `╰────────────────╯\n`;

    for (const categoria of nombresCategorias) {
      const icono = ICONOS_CATEGORIA[categoria] || "✨";
      texto += `\n╭─${icono} *${categoria.toUpperCase()}* ${icono}\n`;
      for (const plugin of categorias[categoria]) {
        const comandoPrincipal = plugin.command[0];
        texto += `│ ➤ *${comandoPrincipal}*\n`;
        texto += `│   ${plugin.description || "Sin descripción"}\n`;
      }
      texto += `╰────────────────╯\n`;
    }

    texto += `\n🦋┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🦋\n`;
    texto += `💕 _No se usa prefijo — escribe el comando directo_\n`;
    texto += `👑 _Powered by ${config.creator}_\n`;
    texto += `🌹 *${config.botName}* — Inteligente · Rápida · Segura · Leal 🌹`;

    const imagen = await obtenerImagenMenu();

    if (imagen) {
      await sock.sendMessage(
        chatId,
        {
          image: imagen,
          caption: texto,
          mentions: [sender],
        },
        { quoted: msg }
      );
    } else {
      await sock.sendMessage(
        chatId,
        {
          text: texto,
          mentions: [sender],
        },
        { quoted: msg }
      );
    }
  },
};
