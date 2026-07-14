import {
  obtenerUsuario,
  guardarUsuario,
  formatearMonto,
  quitarItem,
  agregarItem,
  contarItem,
} from "../economyDB.js";

const ITEMS = [
  { id: "inversion_basica", nombre: "Inversión Básica" },
  { id: "inversion_plus", nombre: "Inversión Plus" },
  { id: "vip_oro", nombre: "Pase VIP Oro" },
  { id: "vip_platino", nombre: "Pase VIP Platino" },
  { id: "socio", nombre: "Socio Comercial" },
  { id: "amuleto_suerte", nombre: "Amuleto de la Suerte" },
  { id: "cafe_energetico", nombre: "Café Energético" },
  { id: "fabrica_stickers", nombre: "Fábrica de Stickers" },
  { id: "acciones_empresa", nombre: "Acciones de Empresa" },
  { id: "curso_financiero", nombre: "Curso Financiero" },
];

const DURACION_MS = 5 * 60 * 1000;
let subastaActiva = null;
let temporizador = null;

function nombreItem(id) {
  return ITEMS.find((i) => i.id === id)?.nombre || id;
}

async function finalizarSubasta(sock, chatId) {
  if (!subastaActiva) return;

  const { itemId, vendedor, mejorPostor, mejorMonto } = subastaActiva;
  subastaActiva = null;

  if (!mejorPostor) {
    agregarItem(vendedor, itemId);
    await sock.sendMessage(chatId, {
      text: `🔨 La subasta de *${nombreItem(itemId)}* terminó sin pujas. El item vuelve a su dueño.`,
    });
    return;
  }

  const vendedorUsuario = obtenerUsuario(vendedor);
  guardarUsuario(vendedor, { saldo: vendedorUsuario.saldo + mejorMonto });
  agregarItem(mejorPostor, itemId);

  await sock.sendMessage(chatId, {
    text:
      `🔨 *¡Subasta finalizada!*\n\n` +
      `🎁 Item: ${nombreItem(itemId)}\n` +
      `🏆 Ganador: @${mejorPostor}\n` +
      `💵 Precio final: ${formatearMonto(mejorMonto)}`,
    mentions: [`${mejorPostor}@s.whatsapp.net`],
  });
}

export default {
  command: ["subasta", "pujar"],
  category: "Economia",
  description: "Subasta un item de tu inventario o puja por el activo.",

  run: async (sock, msg, args, context) => {
    const { sender, chatId, body } = context;
    const numero = sender.split("@")[0].split(":")[0];
    const comando = body.trim().split(/\s+/)[0].toLowerCase();

    if (comando === "pujar") {
      if (!subastaActiva) {
        return await sock.sendMessage(
          chatId,
          { text: "❌ No hay ninguna subasta activa en este momento." },
          { quoted: msg }
        );
      }

      const monto = parseInt(args[0], 10);
      if (!monto || monto <= subastaActiva.mejorMonto) {
        return await sock.sendMessage(
          chatId,
          {
            text: `❌ Tu puja debe ser mayor a ${formatearMonto(subastaActiva.mejorMonto)}.\nUso: *pujar <monto>*`,
          },
          { quoted: msg }
        );
      }

      if (numero === subastaActiva.vendedor) {
        return await sock.sendMessage(
          chatId,
          { text: "❌ No puedes pujar por tu propio item." },
          { quoted: msg }
        );
      }

      const usuario = obtenerUsuario(numero);
      if (usuario.saldo < monto) {
        return await sock.sendMessage(
          chatId,
          { text: `❌ No tienes suficiente saldo para pujar eso. Tienes ${formatearMonto(usuario.saldo)}.` },
          { quoted: msg }
        );
      }

      subastaActiva.mejorMonto = monto;
      subastaActiva.mejorPostor = numero;

      return await sock.sendMessage(
        chatId,
        {
          text: `💰 @${numero} pujó *${formatearMonto(monto)}* por ${nombreItem(subastaActiva.itemId)}.`,
          mentions: [sender],
        },
        { quoted: msg }
      );
    }

    if (subastaActiva) {
      return await sock.sendMessage(
        chatId,
        { text: `⚠️ Ya hay una subasta activa de *${nombreItem(subastaActiva.itemId)}*. Usa *pujar <monto>* para participar.` },
        { quoted: msg }
      );
    }

    const itemId = args[0]?.toLowerCase();
    const precioInicial = parseInt(args[1], 10);

    if (!itemId || !precioInicial || precioInicial <= 0) {
      return await sock.sendMessage(
        chatId,
        {
          text:
            `🔨 Uso: *subasta <id_item> <precio_inicial>*\n` +
            `Ejemplo: *subasta vip_oro 3000*\n\n` +
            `Usa *inventario* para ver el ID de tus items.`,
        },
        { quoted: msg }
      );
    }

    if (contarItem(numero, itemId) === 0) {
      return await sock.sendMessage(
        chatId,
        { text: `❌ No tienes *${nombreItem(itemId)}* en tu inventario.` },
        { quoted: msg }
      );
    }

    quitarItem(numero, itemId);

    subastaActiva = {
      itemId,
      vendedor: numero,
      mejorMonto: precioInicial,
      mejorPostor: null,
    };

    if (temporizador) clearTimeout(temporizador);
    temporizador = setTimeout(() => finalizarSubasta(sock, chatId), DURACION_MS);

    await sock.sendMessage(
      chatId,
      {
        text:
          `🔨 *¡Nueva subasta!*\n\n` +
          `🎁 Item: ${nombreItem(itemId)}\n` +
          `💵 Precio inicial: ${formatearMonto(precioInicial)}\n` +
          `⏳ Termina en 5 minutos\n\n` +
          `Usa *pujar <monto>* para participar.`,
      },
      { quoted: msg }
    );
  },
};
