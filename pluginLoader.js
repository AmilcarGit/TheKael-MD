import fs from "fs";
import path from "path";
import url from "url";
import chalk from "chalk";
import { config } from "./config.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const pluginsPath = path.join(__dirname, "plugins");

/**
 * Carga todos los plugins de la carpeta /plugins de forma dinámica.
 * Cada plugin debe exportar por defecto un objeto:
 * {
 *   command: ["hola", "hi"],   // palabras clave que activan el plugin (sin prefijo)
 *   description: "texto",     // opcional, para un futuro menú
 *   run: async (sock, msg, args, context) => { ... }
 * }
 */
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

  const total = files.length;

  for (let i = 0; i < total; i++) {
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

    const cargados = plugins.length;
    const barraLargo = 20;
    const llenos = Math.round(((i + 1) / total) * barraLargo);
    const barra = "▓".repeat(llenos) + "░".repeat(barraLargo - llenos);

    process.stdout.write(
      `\r🦋 Cargando plugins ${chalk.cyan(barra)} ${i + 1}/${total} `
    );
  }

  process.stdout.write("\n");

  const categorias = {};
  for (const p of plugins) {
    const cat = p.category || "Otros";
    categorias[cat] = (categorias[cat] || 0) + 1;
  }

  console.log(chalk.magentaBright(`\n╭─「 📦 *${config.botName}* 」`));
  console.log(chalk.green(`│ ✅ ${plugins.length} plugin(s) cargado(s) correctamente`));

  for (const [cat, cantidad] of Object.entries(categorias).sort()) {
    console.log(chalk.gray(`│    · ${cat}: ${cantidad}`));
  }

  if (invalidos.length > 0) {
    console.log(chalk.yellow(`│ ⚠️  ${invalidos.length} inválido(s): ${invalidos.join(", ")}`));
  }

  if (errores.length > 0) {
    console.log(chalk.red(`│ ❌ ${errores.length} con error al cargar:`));
    for (const { file, err } of errores) {
      console.log(chalk.red(`│    · ${file} → ${err.message || err}`));
    }
  }

  console.log(chalk.magentaBright(`╰────────────────────────\n`));

  return plugins;
}
