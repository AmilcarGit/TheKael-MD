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
    const { sender, chatId, allPlugins, body } = context;
    const numero = sender.split("@")[0].split(":")[0];

    // Determinar la categoría solicitada
    let categoriaSolicitada = null;
    const argumento = args.join(" ").toLowerCase().trim();

    // Mapeo de nombres de categorías
    const categoriaMap = {
      general: "General",
      grupo: "Grupo",
      descargas: "Descargas",
      anime: "Anime",
      owner: "Owner",
      info: "Info",
      otros: "Otros",
    };

    // Si el argumento es un ID de botón (empieza con "menu_")
    if (argumento.startsWith("menu_")) {
      const catKey = argumento.replace("menu_", "");
      if (catKey === "principal") {
        // Volver al menú principal
        categoriaSolicitada = null;
      } else {
        categoriaSolicitada = categoriaMap[catKey] || null;
      }
    } else if (argumento) {
      // Si el usuario escribió "menu general" o "menu_general" (sin prefijo "menu_")
      const catKey = argumento.replace("menu_", "").replace(" ", "").trim();
      categoriaSolicitada = categoriaMap[catKey] || categoriaMap[argumento] || null;
    }

    // Si se solicitó una categoría válida, mostrarla
    if (categoriaSolicitada) {
      const pluginsCategoria = obtenerComandosPorCategoria(allPlugins, categoriaSolicitada);
      if (pluginsCategoria.length === 0) {
        await sock.sendMessage(
          chatId,
          { text: `❌ No hay comandos en la categoría *${categoriaSolicitada}*.` },
          { quoted: msg }
        );
        return;
      }

      const icono = ICONOS_CATEGORIA[categoriaSolicitada] || "✨";
      let texto = `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n`;
      texto += `   ${icono} *${categoriaSolicitada.toUpperCase()}* ${icono}\n`;
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

    // Botón para volver al menú principal
    botones.push({
      buttonId: "menu_principal",
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