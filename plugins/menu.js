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
  busquedas: "🔭",
  Descargas: "🌹",
  Utilidades: "🔧",
  Grupo: "👑",
  Economia: "💰",
  Diversión: "🎮",
  Anime: "💕",
  Ai: "🦾",
  Seguridad: "🛡️",
  Owner: "💎",
  Otros: "✨",
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

function agruparPorCategoria(allPlugins) {
  const categorias = {};
  for (const plugin of allPlugins) {
    const categoria = plugin.category || "Otros";
    if (!categorias[categoria]) categorias[categoria] = [];
    categorias[categoria].push(plugin);
  }
  return categorias;
}

function encabezadoBot(sender, allPlugins) {
  const fecha = new Date().toLocaleString("es-PE", {
    timeZone: "America/Lima",
    dateStyle: "full",
    timeStyle: "short",
  });
  const totalComandos = allPlugins.reduce((acc, p) => acc + p.command.length, 0);
  const numero = sender.split("@")[0].split(":")[0];
  const uptime = formatearUptime(process.uptime());

  let texto = `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n`;
  texto += `  ✨ *${config.botName.toUpperCase()}* ✨\n`;
  texto += `  _Tu waifu inteligente_ 💕\n`;
  texto += `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n\n`;

  texto += `╭─🎀 *INFO٭BOT* 🎀\n`;
  texto += `│ 👤 @${numero}\n`;
  texto += `│ 💎 ${config.creator}\n`;
  texto += `│ 💵 Yui  │ ⏱️ ${uptime}\n`;
  texto += `│ ⚡ ${totalComandos} cmd  │ 📦 ${allPlugins.length} plugins\n`;
  texto += `│ 🕐 ${fecha}\n`;
  texto += `╰───────────────◉\n`;

  return texto;
}

function textoCategorias(categorias, nombresCategorias) {
  let texto = `\n🌹 *MIS COMANDOS* 🦋 🕹 𝐈𝐀 𝐄𝐍 𝐃𝐄𝐒𝐀𝐑𝐑𝐎𝐋𝐋𝐎 📡\n\n`;
  texto += `╭─🗂️ *CATEGORÍAS* 🗂️\n`;

  nombresCategorias.forEach((categoria, i) => {
    const icono = ICONOS_CATEGORIA[categoria] || "✨";
    const cantidad = categorias[categoria].length;
    texto += `│\n`;
    texto += `│ *${i + 1}.* ${icono} ${categoria} (${cantidad})\n`;
  });

  texto += `│\n╰────────────────────╯\n\n`;
  texto += `💕 Escribe *menu <número>* o *menu <categoría>* para ver esos comandos.\n`;
  texto += `Ejemplo: *menu 1*  o  *menu ${nombresCategorias[0]}*`;

  return texto;
}

function textoDetalleCategoria(categoria, comandosCategoria) {
  const icono = ICONOS_CATEGORIA[categoria] || "✨";
  let texto = `\n╭─${icono} *${categoria}* ${icono}\n`;

  comandosCategoria.forEach((plugin) => {
    const comandoPrincipal = plugin.command[0];
    const alias = plugin.command.slice(1).length > 0
      ? ` (${plugin.command.slice(1).join(", ")})`
      : "";
    texto += `│\n`;
    texto += `│ ➤ *${comandoPrincipal}*${alias}\n`;
    texto += `│   ${plugin.description || "Sin descripción"}\n`;
  });

  texto += `│\n╰────────────────────╯\n\n`;
  texto += `💕 Escribe *menu* para ver todas las categorías.`;

  return texto;
}

function piePagina() {
  let texto = `\n🦋┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🦋\n`;
  texto += `💕 _Sin prefijo — escribe el comando directo_\n`;
  texto += `📚 _Bot hecho con fines educativos_\n`;
  texto += `🌹 *${config.botName}* — Leal · Rápida · Inteligente 🌹`;
  return texto;
}

export default {
  command: ["menu", "help", "ayuda"],
  category: "General",
  description: "Muestra el menú de comandos por categorías.",
  run: async (sock, msg, args, context) => {
    const { sender, chatId, allPlugins } = context;

    const categorias = agruparPorCategoria(allPlugins);
    const nombresCategorias = Object.keys(categorias).sort();
    const busqueda = args.join(" ").trim().toLowerCase();

    let texto;

    if (!busqueda) {
      texto = encabezadoBot(sender, allPlugins);
      texto += textoCategorias(categorias, nombresCategorias);
    } else {
      let categoriaElegida = null;

      const comoNumero = parseInt(busqueda);
      if (!isNaN(comoNumero) && nombresCategorias[comoNumero - 1]) {
        categoriaElegida = nombresCategorias[comoNumero - 1];
      } else {
        categoriaElegida = nombresCategorias.find(
          (c) => c.toLowerCase() === busqueda || c.toLowerCase().includes(busqueda)
        );
      }

      if (!categoriaElegida) {
        texto = `❌ No encontré esa categoría.\n\n`;
        texto += textoCategorias(categorias, nombresCategorias);
      } else {
        texto = textoDetalleCategoria(categoriaElegida, categorias[categoriaElegida]);
      }
    }

    texto += piePagina();

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
