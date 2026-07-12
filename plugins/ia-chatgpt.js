const historialPorUsuario = new Map();
const MAX_MENSAJES_HISTORIAL = 10;

export default {
  command: ["chatgpt", "gpt", "ia"],
  category: "Ai",
  description: "Habla con ChatGPT.",

  run: async (sock, msg, args, context) => {
    const { chatId, sender } = context;
    const pregunta = args.join(" ").trim();

    if (!pregunta) {
      await sock.sendMessage(
        chatId,
        { text: "🤖 Escribe algo después del comando.\nEjemplo: *chatgpt* ¿cuál es la capital de Perú?" },
        { quoted: msg }
      );
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      await sock.sendMessage(
        chatId,
        { text: "❌ No hay una clave de OpenAI configurada en el servidor." },
        { quoted: msg }
      );
      return;
    }

    const historial = historialPorUsuario.get(sender) || [];

    try {
      await sock.sendMessage(chatId, { text: "🤖 Pensando..." }, { quoted: msg });

      const mensajes = [
        {
          role: "system",
          content: "Eres una asistente de WhatsApp llamada TheYui-MD, amable y directa. Responde en español, corto y claro.",
        },
        ...historial,
        { role: "user", content: pregunta },
      ];

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: mensajes,
          max_tokens: 500,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Error de la API de OpenAI:", data);
        await sock.sendMessage(
          chatId,
          { text: `❌ Error al hablar con ChatGPT: ${data.error?.message || "error desconocido"}` },
          { quoted: msg }
        );
        return;
      }

      const respuesta = data.choices?.[0]?.message?.content?.trim();

      if (!respuesta) {
        await sock.sendMessage(
          chatId,
          { text: "❌ No obtuve respuesta de ChatGPT, intenta de nuevo." },
          { quoted: msg }
        );
        return;
      }

      const nuevoHistorial = [
        ...historial,
        { role: "user", content: pregunta },
        { role: "assistant", content: respuesta },
      ].slice(-MAX_MENSAJES_HISTORIAL);

      historialPorUsuario.set(sender, nuevoHistorial);

      await sock.sendMessage(chatId, { text: `🤖 ${respuesta}` }, { quoted: msg });
    } catch (err) {
      console.error("❌ Error en el comando chatgpt:", err);
      await sock.sendMessage(
        chatId,
        { text: "❌ Ocurrió un error al conectar con ChatGPT." },
        { quoted: msg }
      );
    }
  },
};
