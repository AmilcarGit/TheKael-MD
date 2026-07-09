import { formatearMonto } from "../economyDB.js";

const ITEMS = [
  {
    id: "inversion_basica",
    nombre: "Inversión Básica",
    precio: 1000,
    descripcion: "Te da 50 Yui de interés cada hora (máx 500/hora)",
    emoji: "📈",
    efecto: "interes_basico"
  },
  {
    id: "inversion_plus",
    nombre: "Inversión Plus",
    precio: 5000,
    descripcion: "Te da 200 Yui de interés cada hora (máx 2000/hora)",
    emoji: "📊",
    efecto: "interes_plus"
  },
  {
    id: "vip_oro",
    nombre: "Pase VIP Oro",
    precio: 10000,
    descripcion: "Duplica todas tus ganancias (trabajo, diario, intereses)",
    emoji: "👑",
    efecto: "vip_oro"
  },
  {
    id: "vip_platino",
    nombre: "Pase VIP Platino",
    precio: 25000,
    descripcion: "Triplica todas tus ganancias (trabajo, diario, intereses)",
    emoji: "💎",
    efecto: "vip_platino"
  },
  {
    id: "socio",
    nombre: "Socio Comercial",
    precio: 15000,
    descripcion: "Ganas un 5% de todas las compras de otros usuarios",
    emoji: "🤝",
    efecto: "socio"
  }
];

export default {
  command: ["tienda", "shop"],
  category: "Economia",
  description: "Muestra la tienda con items que te hacen ganar más dinero.",
  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    let texto = `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n`;
    texto += `  🛍️ *TIENDA DE YUI* 🛍️\n`;
    texto += `  _Invierte para ganar más dinero_ 💵\n`;
    texto += `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n\n`;

    for (const item of ITEMS) {
      texto += `${item.emoji} *${item.nombre}*\n`;
      texto += `   💵 Precio: ${formatearMonto(item.precio)}\n`;
      texto += `   📝 ${item.descripcion}\n`;
      texto += `   🔑 ID: ${item.id}\n\n`;
    }

    texto += `🦋┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🦋\n`;
    texto += `💕 Para comprar escribe: *comprar <ID>*\n`;
    texto += `🌹 Ejemplo: *comprar inversion_basica*\n`;
    texto += `📌 Tus efectos activos se aplican automáticamente.`;

    await sock.sendMessage(chatId, { text: texto }, { quoted: msg });
  }
};