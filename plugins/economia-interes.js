import { obtenerUsuario, guardarUsuario, formatearMonto, tieneEfecto } from "../economyDB.js";

export default {
  command: ["interes", "cobrar"],
  category: "Economia",
  requiereRegistro: true,
  description: "Cobra los intereses generados por tus inversiones.",
  run: async (sock, msg, args, context) => {
    const { sender, chatId } = context;
    const numero = sender.split("@")[0].split(":")[0];

    const usuario = obtenerUsuario(numero);
    const ahora = Date.now();
    const tiempoDesdeUltimo = ahora - (usuario.ultimoInteres || 0);

    const horas = Math.min(Math.floor(tiempoDesdeUltimo / (60 * 60 * 1000)), 10);

    if (horas === 0) {
      return await sock.sendMessage(
        chatId,
        { text: "⏳ Debes esperar al menos 1 hora para cobrar intereses." },
        { quoted: msg }
      );
    }

    let interesBase = 0;
    const vipOro = tieneEfecto(numero, "vip_oro");
    const vipPlatino = tieneEfecto(numero, "vip_platino");
    const cursoFinanciero = tieneEfecto(numero, "interes_plus");

    if (tieneEfecto(numero, "interes_basico")) {
      interesBase = 50 * horas;
    }
    if (tieneEfecto(numero, "interes_plus") || cursoFinanciero) {
      interesBase = 200 * horas;
    }
    // Acciones empresa genera más
    if (tieneEfecto(numero, "acciones_empresa")) {
      interesBase = 500 * horas;
    }

    if (interesBase === 0) {
      return await sock.sendMessage(
        chatId,
        { text: "❌ No tienes inversiones activas. Compra una en *tienda*." },
        { quoted: msg }
      );
    }

    let totalInteres = interesBase;
    if (vipPlatino) totalInteres = interesBase * 3;
    else if (vipOro) totalInteres = interesBase * 2;

    const maximoPorHora = vipPlatino ? 3000 : vipOro ? 2000 : 1000;
    if (totalInteres > maximoPorHora * horas) {
      totalInteres = maximoPorHora * horas;
    }

    guardarUsuario(numero, {
      saldo: usuario.saldo + totalInteres,
      ultimoInteres: ahora
    });

    await sock.sendMessage(
      chatId,
      {
        text: `💵 Has cobrado ${formatearMonto(totalInteres)} en intereses.\n📊 ${horas} hora(s) acumuladas.\n✨ Sigue invirtiendo para ganar más.`,
        mentions: [sender]
      },
      { quoted: msg }
    );
  }
};