import baileysPkg from "@whiskeysockets/baileys";
import sharp from "sharp";
import webp from "node-webpmux";

const { downloadMediaMessage } = baileysPkg;

const PACK_STICKER = "𝚃𝙷𝙴𝚈𝚄𝙸🦋";
const AUTOR_STICKER = "© AmilcarGit 2026";

async function agregarMetadataSticker(webpBuffer) {
  const img = new webp.Image();

  const json = {
    "sticker-pack-id": "thekael-yui-md",
    "sticker-pack-name": PACK_STICKER,
    "sticker-pack-publisher": AUTOR_STICKER,
    emojis: ["🦋"],
  };

  const exifAttr = Buffer.from([
    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
    0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
  ]);
  const jsonBuffer = Buffer.from(JSON.stringify(json), "utf-8");
  const exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);

  await img.load(webpBuffer);
  img.exif = exif;

  return await img.save(null);
}

export default {
  command: ["sticker", "s", "stiker"],
  category: "Media",
  description:
    "Convierte una imagen en sticker. Responde a una imagen con *sticker*, o envía la imagen con ese texto en el mensaje.",

  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
    const mensajeCitado = contextInfo?.quotedMessage;

    let mensajeObjetivo = msg;

    if (mensajeCitado?.imageMessage) {
      mensajeObjetivo = {
        key: {
          remoteJid: chatId,
          id: contextInfo.stanzaId,
          participant: contextInfo.participant,
        },
        message: mensajeCitado,
      };
    }

    const tieneImagen = Boolean(mensajeObjetivo.message?.imageMessage);
    const tieneVideoOGif = Boolean(
      mensajeObjetivo.message?.videoMessage ||
        mensajeCitado?.videoMessage
    );

    if (!tieneImagen && !tieneVideoOGif) {
      return await sock.sendMessage(
        chatId,
        {
          text:
            "💕 Responde a una imagen con *sticker* (o envíala junto con ese texto) para convertirla.",
        },
        { quoted: msg }
      );
    }

    if (tieneVideoOGif) {
      return await sock.sendMessage(
        chatId,
        {
          text: "⚠️ Por ahora solo puedo convertir *imágenes* a sticker, los videos/GIFs aún no.",
        },
        { quoted: msg }
      );
    }

    try {
      const buffer = await downloadMediaMessage(mensajeObjetivo, "buffer", {});

      const webpBuffer = await sharp(buffer)
        .resize(512, 512, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .webp({ quality: 80 })
        .toBuffer();

      let stickerFinal = webpBuffer;
      try {
        stickerFinal = await agregarMetadataSticker(webpBuffer);
      } catch (errMetadata) {
        console.log("No se pudo agregar metadata al sticker:", errMetadata);
      }

      await sock.sendMessage(
        chatId,
        { sticker: stickerFinal },
        { quoted: msg }
      );
    } catch (err) {
      console.log(err);
      await sock.sendMessage(
        chatId,
        { text: "❌ No pude convertir la imagen a sticker. Intenta con otra imagen." },
        { quoted: msg }
      );
    }
  },
};
