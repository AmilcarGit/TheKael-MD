import fs from "fs";
import path from "path";
import url from "url";
import chalk from "chalk";
import { config } from "./config.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const pluginsPath = path.join(__dirname, "plugins");

const ICONOS_CATEGORIA = {
  General: "🦋",
  Info: "🎀",
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

const ANCHO = 44;

let ultimoEstadoCarga = { invalidos: [], errores: [] };

export function obtenerEstadoUltimaCarga() {
  return ultimoEstadoCarga;
}

function centrar(texto, ancho) {
  const visible = texto.replace(/\x1b\[[0-9;]*m/g, "");
  const espacio = Math.max(0, ancho - visible.length);
  const izq = Math.floor(espacio / 2);
  const der = espacio - izq;
  return " ".repeat(izq) + texto + " ".repeat(der);
}

function fila(texto = "", color = (t) => t) {
  const visible = texto.replace(/\x1b\[[0-9;]*m/g, "");
  const relleno = Math.max(0, ANCHO - visible.length - 4);
  return (
    chalk.hex("#e07bff")("┃ ") +
    color(texto) +
    " ".repeat(relleno) +
    chalk.hex("#e07bff")(" ┃")
  );
}

function separador(caracterIzq = "┣", caracterDer = "┫") {
  return chalk.hex("#e07bff")(caracterIzq + "━".repeat(ANCHO - 2) + caracterDer);
}

function tope() {
  return chalk.hex("#ff9ecf")("┏" + "━".repeat(ANCHO - 2) + "┓");
}

function base() {
  return chalk.hex("#ff9ecf")("┗" + "━".repeat(ANCHO - 2) + "┛");
}

export async function loadPlugins() {
  const plugins = [];
  const invalidos = [];
  const errores = [];

  if (!fs.existsSync(pluginsPath)) {
    fs.mkdirSync(pluginsPath, { recursive: true });
  }

  const files = fs
    .readdirSync(pluginsPath)
    .filter((file) => file.endsWith(".js"));

  const total = files.length || 1;

  console.log("");
  console.log(chalk.hex("#ff9ecf")(centrar("✦ ⋆｡ 　˚ 　★ 　⋆", 50)));
  console.log(chalk.hex("#e07bff").bold(centrar(`Cargando ${config.botName}`, 50)));
  console.log("");

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      const pluginUrl = url.pathToFileURL(path.join(pluginsPath, file)).href;
      const module = await import(`${pluginUrl}?update=${Date.now()}`);
      const plugin = module.default;

      if (!plugin || !plugin.command || !plugin.run) {
        invalidos.push(file);
      } else {
        plugin.fileName = file;
        plugins.push(plugin);
      }
    } catch (err) {
      errores.push({ file, err });
    }

    const barraLargo = 24;
    const llenos = Math.round(((i + 1) / total) * barraLargo);
    const porcentaje = Math.round(((i + 1) / total) * 100);
    const barra =
      chalk.hex("#ff6fc4")("●".repeat(llenos)) +
      chalk.gray("·".repeat(barraLargo - llenos));

    process.stdout.write(
      `\r  ${barra}  ${chalk.hex("#e07bff").bold(porcentaje + "%")}   `
    );
  }

  process.stdout.write("\n\n");

  ultimoEstadoCarga = { invalidos, errores };

  const categorias = {};
  for (const p of plugins) {
    const cat = p.category || "Otros";
    categorias[cat] = (categorias[cat] || 0) + 1;
  }

  console.log(tope());
  console.log(fila(centrar(`🌸 ${config.botName} 🌸`, ANCHO - 4), chalk.white.bold));
  console.log(fila(centrar(`por ${config.creator}`, ANCHO - 4), chalk.hex("#d9a9ff")));
  console.log(separador());
  console.log(
    fila(
      `  ✅  ${plugins.length} comando(s) listo(s) para volar`,
      chalk.greenBright
    )
  );

  const nombresCategorias = Object.entries(categorias).sort();
  if (nombresCategorias.length > 0) {
    console.log(separador());
    for (let i = 0; i < nombresCategorias.length; i += 2) {
      const [catA, numA] = nombresCategorias[i];
      const iconoA = ICONOS_CATEGORIA[catA] || "✨";
      const colA = `${iconoA} ${catA}: ${numA}`;

      if (nombresCategorias[i + 1]) {
        const [catB, numB] = nombresCategorias[i + 1];
        const iconoB = ICONOS_CATEGORIA[catB] || "✨";
        const colB = `${iconoB} ${catB}: ${numB}`;
        const colAPad = colA.padEnd(19, " ");
        console.log(fila(`  ${colAPad} ${colB}`, chalk.hex("#d9a9ff")));
      } else {
        console.log(fila(`  ${colA}`, chalk.hex("#d9a9ff")));
      }
    }
  }

  if (invalidos.length > 0) {
    console.log(separador());
    console.log(fila(`  ⚠️  ${invalidos.length} archivo(s) inválido(s)`, chalk.yellow.bold));
    for (const file of invalidos) {
      console.log(fila(`     ‣ ${file}`, chalk.yellow));
    }
  }

  if (errores.length > 0) {
    console.log(separador());
    console.log(fila(`  ❌  ${errores.length} con error al cargar`, chalk.red.bold));
    for (const { file, err } of errores) {
      const mensaje = String(err.message || err).slice(0, 32);
      console.log(fila(`     ‣ ${file}`, chalk.red));
      console.log(fila(`       ${mensaje}`, chalk.redBright));
    }
  }

  console.log(base());
  console.log("");

  return plugins;
}
