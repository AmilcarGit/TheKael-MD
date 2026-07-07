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
  Diversión: "🎮",
  Utilidades: "🔧",
  Seguridad: "🛡️",
};

const CATEGORIAS_BOTONES = [
  { id: "menu_general", display: "General" },
  { id: "menu_grupo", display: "Grupo" },
  { id: "menu_descargas", display: "Descargas" },
  { id: "menu_anime", display: "Anime" },
  { id: "menu_owner", display: "Owner" },
  { id: "menu_info", display: "Info" },
];

function formatearUptime(segundos) {
  const d = Math.floor(segundos / 86400);
  const h = Math.floor((segundos % 86400) / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = Math.floor(segundos % 60);
  return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`;
}

function barraProgreso(porcentaje = 100, largo = 12) {
  const llenos = Math.round((porcentaje / 100) * largo);
  return "▓".repeat(llenos) + "░".repeat(largo - llenos);
}

function obtenerComandosPorCategoria(plugins, categoria) {
  return plugins.filter(p => (p.category || "Otros") === categoria);
}

function formatearComandos(plugins) {
  let texto = "";
  for (const plugin of plugins) {
    const comandoPrincipal = plugin.command[0];
    const alias = plugin.command.slice(1).length > 0
      ? ` (${plugin.command.slice(1).join(", ")})`
      : "";
    texto += `➤ *${comandoPrincipal}*${alias}\n`;
    texto += `  ${plugin.description || "Sin descripción"}\n`;
  }
  return texto;
}

export default {
  command: ["menu", "help", "ayuda"],
  category: "General",
  description: "Muestra el menú de comandos con botones interactivos.",
  run: async (sock, msg, args, context) => {
    const { sender, chatId, allPlugins } = context;
    const numero = sender.split("@")[0].split(":")[0];
    const categoriaArg = args.join(" ").toLowerCase().trim();

    // Si el mensaje es "menu <categoria>", mostrar solo esa categoría
    if (categoriaArg) {
      const categoriaMap = {
        general: "General",
        grupo: "Grupo",
        descargas: "Descargas",
        anime: "Anime",
        owner: "Owner",
        info: "Info",
        otros: "Otros",
      };

      const categoria = categoriaMap[categoriaArg];
      if (!categoria) {
        await sock.sendMessage(
          chatId,
          { text: "❌ Categoría no válida. Usa: General, Grupo, Descargas, Anime, Owner, Info." },
          { quoted: msg }
        );
        return;
      }

      const pluginsCategoria = obtenerComandosPorCategoria(allPlugins, categoria);
      if (pluginsCategoria.length === 0) {
        await sock.sendMessage(
          chatId,
          { text: `❌ No hay comandos en la categoría *${categoria}*.` },
          { quoted: msg }
        );
        return;
      }

      const icono = ICONOS_CATEGORIA[categoria] || "✨";
      const texto = `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n`;
      texto += `   ${icono} *${categoria.toUpperCase()}* ${icono}\n`;
      texto += `   _Comandos disponibles_\n`;
      texto += `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n\n`;
      texto += formatearComandos(pluginsCategoria);
      texto += `\n🦋┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🦋\n`;
      texto += `💕 Escribe *menu* para volver al menú principal.`;

      await sock.sendMessage(
        chatId,
        {
          text: texto,
          mentions: [sender],
        },
        { quoted: msg }
      );
      return;
    }

    // MENÚ PRINCIPAL CON BOTONES
    const fecha = new Date().toLocaleString("es-HN", {
      dateStyle: "full",
      timeStyle: "short",
    });

    const totalComandos = allPlugins.reduce(
      (acc, p) => acc + p.command.length,
      0
    );
    const uptime = formatearUptime(process.uptime());

    let texto = `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n`;
    texto += `   ✨ *${config.botName.toUpperCase()}* ✨\n`;
    texto += `   _Tu waifu inteligente para WhatsApp_ 💕\n`;
    texto += `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n\n`;

    texto += `╭─🌹 *ACERCA DE MÍ* 🌹\n`;
    texto += `│ Hola, soy *${config.botName}* 💖\n`;
    texto += `│ Tu asistente waifu, creada para\n`;
    texto += `│ hacer tu día más fácil y divertido.\n`;
    texto += `│ Siempre contigo, siempre leal. 🥰\n`;
    texto += `╰────────────────────────╯\n\n`;

    texto += `╭─🎀 *ESTADÍSTICAS* 🎀\n`;
    texto += `│ 🟢 Estado:  *Online* ${barraProgreso(100)} 100%\n`;
    texto += `│ 💎 Creador:  ${config.creator}\n`;
    texto += `│ 👤 Usuario:  @${numero}\n`;
    texto += `│ 💵 Moneda:   *Yui* 💵\n`;
    texto += `│ ⏱️ Uptime:   ${uptime}\n`;
    texto += `│ ⚡ Comandos: ${totalComandos} activos\n`;
    texto += `│ 📦 Plugins:  ${allPlugins.length} cargados\n`;
    texto += `│ 🕐 Fecha:   ${fecha}\n`;
    texto += `╰────────────────────────╯\n\n`;

    texto += `🦋 *SELECCIONA UNA CATEGORÍA* 🦋\n`;
    texto += `_Pulsa un botón para ver sus comandos._`;

    // Construir los botones
    const botones = CATEGORIAS_BOTONES.map((cat) => ({
      buttonId: cat.id,
      buttonText: { displayText: cat.display },
      type: 1,
    }));

    // Botón adicional para volver al menú principal (aunque ya se puede con "menu")
    botones.push({
      buttonId: "menu",
      buttonText: { displayText: "🏠 Menú principal" },
      type: 1,
    });

    const imagen = await obtenerImagenMenu();

    if (imagen) {
      await sock.sendMessage(
        chatId,
        {
          image: imagen,
          caption: texto,
          mentions: [sender],
          buttons: botones,
          headerType: 1,
        },
        { quoted: msg }
      );
    } else {
      await sock.sendMessage(
        chatId,
        {
          text: texto,
          mentions: [sender],
          buttons: botones,
          headerType: 1,
        },
        { quoted: msg }
      );
    }
  },
};