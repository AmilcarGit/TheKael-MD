const FORTUNAS = [
  {
    nivel: "🌟 Gran Fortuna",
    emoji: "🌸",
    mensaje: "El universo está de tu lado. ¡Hoy todo será perfecto! Disfruta cada momento."
  },
  {
    nivel: "✨ Mediana Fortuna",
    emoji: "🦋",
    mensaje: "Buenas noticias llegarán pronto. Mantén tu corazón abierto."
  },
  {
    nivel: "🍀 Pequeña Fortuna",
    emoji: "🌿",
    mensaje: "Un pequeño detalle hará tu día especial. ¡Sonríe!"
  },
  {
    nivel: "💫 Fortuna Regular",
    emoji: "🌙",
    mensaje: "Un día tranquilo, sin sobresaltos. Aprovecha para descansar."
  },
  {
    nivel: "🍂 Mala Fortuna",
    emoji: "🌧️",
    mensaje: "Hoy será un día de aprendizaje. No temas a los desafíos."
  },
  {
    nivel: "💀 Gran Mala Fortuna",
    emoji: "⚡",
    mensaje: "Cuidado con las decisiones importantes. Tómate tu tiempo."
  },
  {
    nivel: "🌸 Fortuna de Amor",
    emoji: "💕",
    mensaje: "El amor tocará tu puerta. Prepárate para una sorpresa."
  },
  {
    nivel: "🎵 Fortuna Musical",
    emoji: "🎶",
    mensaje: "La música te traerá alegría. Escucha tu canción favorita."
  },
  {
    nivel: "💎 Fortuna de Riqueza",
    emoji: "💰",
    mensaje: "Llegará dinero inesperado. ¡Ahorra para un capricho!"
  },
  {
    nivel: "📚 Fortuna de Estudio",
    emoji: "📖",
    mensaje: "Tu esfuerzo intelectual dará frutos. Sigue estudiando."
  },
  {
    nivel: "🌅 Fortuna de Viajes",
    emoji: "✈️",
    mensaje: "Un viaje inesperado cambiará tu perspectiva. ¡Prepara las maletas!"
  },
  {
    nivel: "🍵 Fortuna de Paz",
    emoji: "🍵",
    mensaje: "La tranquilidad llegará a tu vida. Respira hondo y relájate."
  },
  {
    nivel: "🌺 Fortuna de Alegría",
    emoji: "🌺",
    mensaje: "La alegría te rodeará hoy. Comparte tu felicidad con los demás."
  },
  {
    nivel: "🌊 Fortuna de Cambio",
    emoji: "🌊",
    mensaje: "Grandes cambios se aproximan. Acepta el flujo de la vida."
  },
  {
    nivel: "🌌 Fortuna de Sueños",
    emoji: "🌌",
    mensaje: "Tus sueños están más cerca de lo que crees. No dejes de perseguirlos."
  },
  {
    nivel: "🌹 Fortuna de Pasión",
    emoji: "🌹",
    mensaje: "La pasión despertará en ti. Sigue lo que te hace vibrar."
  },
  {
    nivel: "🌻 Fortuna de Optimismo",
    emoji: "🌻",
    mensaje: "El optimismo te guiará hoy. Todo saldrá mejor de lo esperado."
  },
  {
    nivel: "🌙 Fortuna de Intuición",
    emoji: "🌙",
    mensaje: "Escucha tu intuición, ella te llevará por el camino correcto."
  },
  {
    nivel: "🍂 Fortuna de Desapego",
    emoji: "🍂",
    mensaje: "Aprende a soltar lo que ya no te sirve. El vacío traerá nuevas oportunidades."
  },
  {
    nivel: "🍀 Fortuna de Sorpresas",
    emoji: "🍀",
    mensaje: "Una sorpresa agradable te espera. Mantén los ojos abiertos."
  },
  {
    nivel: "🎉 Fortuna de Celebración",
    emoji: "🎉",
    mensaje: "Celebra los pequeños logros. Hoy es un buen día para festejar."
  },
  {
    nivel: "🎶 Fortuna de Armonía",
    emoji: "🎶",
    mensaje: "La armonía llegará a tus relaciones. Escucha con el corazón."
  },
  {
    nivel: "🎨 Fortuna de Creatividad",
    emoji: "🎨",
    mensaje: "Tu creatividad fluirá hoy. Aprovecha para crear algo hermoso."
  },
  {
    nivel: "📝 Fortuna de Comunicación",
    emoji: "📝",
    mensaje: "Tus palabras tendrán poder hoy. Comunica con claridad y amor."
  },
  {
    nivel: "🔮 Fortuna de Misterio",
    emoji: "🔮",
    mensaje: "Un misterio se resolverá hoy. Confía en el proceso."
  },
  {
    nivel: "🧘 Fortuna de Calma",
    emoji: "🧘",
    mensaje: "Encuentra la calma en medio del caos. Respira y fluye."
  },
  {
    nivel: "🎯 Fortuna de Metas",
    emoji: "🎯",
    mensaje: "Tus metas están al alcance. Da un paso más hacia ellas."
  },
  {
    nivel: "💪 Fortuna de Fuerza",
    emoji: "💪",
    mensaje: "Tienes la fuerza para superar cualquier obstáculo. Confía en ti."
  },
  {
    nivel: "🧠 Fortuna de Sabiduría",
    emoji: "🧠",
    mensaje: "La sabiduría te iluminará hoy. Una decisión importante será acertada."
  },
  {
    nivel: "❤️ Fortuna de Salud",
    emoji: "❤️",
    mensaje: "Tu salud mejorará. Cuida tu cuerpo y mente."
  },
  {
    nivel: "💼 Fortuna de Trabajo",
    emoji: "💼",
    mensaje: "Éxito en el trabajo. Tu esfuerzo será reconocido."
  },
  {
    nivel: "🏆 Fortuna de Éxito",
    emoji: "🏆",
    mensaje: "El éxito te sonreirá hoy. Celebra tus logros."
  },
  {
    nivel: "🌟 Fortuna de Brillo",
    emoji: "🌟",
    mensaje: "Brillarás hoy como nunca. Todos notarán tu luz."
  },
  {
    nivel: "🌱 Fortuna de Crecimiento",
    emoji: "🌱",
    mensaje: "Estás creciendo como persona. El proceso es hermoso."
  },
  {
    nivel: "🌺 Fortuna de Flores",
    emoji: "🌺",
    mensaje: "La vida florece a tu alrededor. Disfruta de la belleza."
  },
  {
    nivel: "🍃 Fortuna de Frescura",
    emoji: "🍃",
    mensaje: "Un día fresco y renovador. Sal a disfrutar del aire."
  },
  {
    nivel: "🌊 Fortuna de Olas",
    emoji: "🌊",
    mensaje: "Deja que las olas te lleven. No resistas al cambio."
  },
  {
    nivel: "🔥 Fortuna de Pasión",
    emoji: "🔥",
    mensaje: "La pasión arde en tu interior. Síguela con valor."
  },
  {
    nivel: "💎 Fortuna de Valor",
    emoji: "💎",
    mensaje: "Eres una joya. No dejes que nadie te haga sentir menos."
  },
  {
    nivel: "🌈 Fortuna de Esperanza",
    emoji: "🌈",
    mensaje: "La esperanza renace. Un nuevo comienzo te espera."
  },
  {
    nivel: "☀️ Fortuna de Luz",
    emoji: "☀️",
    mensaje: "La luz iluminará tu camino. Sigue hacia adelante."
  },
  {
    nivel: "🌙 Fortuna de Noche",
    emoji: "🌙",
    mensaje: "La noche trae consigo paz y reflexión. Descansa bien."
  },
  {
    nivel: "⭐ Fortuna de Estrellas",
    emoji: "⭐",
    mensaje: "Las estrellas te guían. Pide un deseo, se cumplirá."
  },
  {
    nivel: "🌌 Fortuna de Galaxias",
    emoji: "🌌",
    mensaje: "Tu destino es tan grande como el universo. Sueña en grande."
  },
  {
    nivel: "🪐 Fortuna de Planetas",
    emoji: "🪐",
    mensaje: "El orden cósmico está a tu favor. Confía en el tiempo."
  },
  {
    nivel: "☄️ Fortuna de Cometas",
    emoji: "☄️",
    mensaje: "Una oportunidad única pasará. Aprovéchala."
  },
  {
    nivel: "🛸 Fortuna de Extraterrestre",
    emoji: "🛸",
    mensaje: "Algo fuera de lo común te sorprenderá. Abre tu mente."
  },
  {
    nivel: "🧙 Fortuna de Magia",
    emoji: "🧙",
    mensaje: "La magia está en el aire. Cree en lo imposible."
  },
  {
    nivel: "🦄 Fortuna de Unicornio",
    emoji: "🦄",
    mensaje: "Un momento mágico te espera. Mantén la fe."
  },
  {
    nivel: "🧚 Fortuna de Hadas",
    emoji: "🧚",
    mensaje: "Las hadas te bendicen con alegría y luz."
  },
  {
    nivel: "🐉 Fortuna de Dragón",
    emoji: "🐉",
    mensaje: "El poder del dragón está contigo. Enfrenta tus miedos."
  },
  {
    nivel: "🦅 Fortuna de Águila",
    emoji: "🦅",
    mensaje: "Vuela alto como el águila. La visión clara te guiará."
  },
  {
    nivel: "🐬 Fortuna de Delfín",
    emoji: "🐬",
    mensaje: "La alegría del delfín te contagiará. Disfruta el momento."
  },
  {
    nivel: "🐱 Fortuna de Gato",
    emoji: "🐱",
    mensaje: "La suerte del gato te acompaña. La curiosidad trae recompensas."
  },
  {
    nivel: "🐶 Fortuna de Perro",
    emoji: "🐶",
    mensaje: "La lealtad y el amor te rodean. Aprecia a los tuyos."
  },
  {
    nivel: "🐦 Fortuna de Pájaro",
    emoji: "🐦",
    mensaje: "Un mensaje importante llegará volando. Atento a las señales."
  },
  {
    nivel: "🐝 Fortuna de Abeja",
    emoji: "🐝",
    mensaje: "Tu trabajo duro dará frutos dulces. La persistencia es clave."
  },
  {
    nivel: "🍄 Fortuna de Setas",
    emoji: "🍄",
    mensaje: "Un hallazgo inesperado te sorprenderá. Mira hacia abajo."
  },
  {
    nivel: "🌻 Fortuna de Girasol",
    emoji: "🌻",
    mensaje: "Sigue la luz como el girasol. El sol te guiará."
  },
  {
    nivel: "🌷 Fortuna de Tulipán",
    emoji: "🌷",
    mensaje: "La belleza de los tulipanes te recordará lo efímero y valioso."
  },
  {
    nivel: "🌲 Fortuna de Bosque",
    emoji: "🌲",
    mensaje: "Encuentra paz en la naturaleza. Un bosque te espera."
  },
  {
    nivel: "🏔️ Fortuna de Montaña",
    emoji: "🏔️",
    mensaje: "Superarás obstáculos como quien escala una montaña. La cima es tuya."
  },
  {
    nivel: "🏝️ Fortuna de Paraíso",
    emoji: "🏝️",
    mensaje: "Tu paraíso personal está más cerca de lo que crees."
  },
  {
    nivel: "🌋 Fortuna de Volcán",
    emoji: "🌋",
    mensaje: "Tu energía interna explotará en creatividad. ¡Escribe, crea, ama!"
  },
  {
    nivel: "🏜️ Fortuna de Desierto",
    emoji: "🏜️",
    mensaje: "La paciencia te dará agua en medio del desierto. No desesperes."
  },
  {
    nivel: "🌊 Fortuna de Mar",
    emoji: "🌊",
    mensaje: "La inmensidad del mar te traerá calma y perspectiva."
  },
  {
    nivel: "🌅 Fortuna de Atardecer",
    emoji: "🌅",
    mensaje: "Un final feliz se acerca. Disfruta el atardecer de hoy."
  },
  {
    nivel: "🌄 Fortuna de Amanecer",
    emoji: "🌄",
    mensaje: "Un nuevo comienzo. El amanecer trae oportunidades."
  },
  {
    nivel: "🌃 Fortuna de Noche Estrellada",
    emoji: "🌃",
    mensaje: "La noche estrellada te inspirará. Mira al cielo."
  },
  {
    nivel: "🎠 Fortuna de Carrusel",
    emoji: "🎠",
    mensaje: "La vida da vueltas, pero siempre hay alegría. Sube al carrusel."
  },
  {
    nivel: "🎪 Fortuna de Circo",
    emoji: "🎪",
    mensaje: "La diversión te espera. Permítete ser niño hoy."
  },
  {
    nivel: "🎭 Fortuna de Teatro",
    emoji: "🎭",
    mensaje: "Una obra de teatro te mostrará una verdad oculta. Atención a los detalles."
  },
  {
    nivel: "🎨 Fortuna de Arte",
    emoji: "🎨",
    mensaje: "Crearás algo hermoso. El arte te espera."
  },
  {
    nivel: "🎼 Fortuna de Partitura",
    emoji: "🎼",
    mensaje: "Tu vida será música. Armonía y ritmo te guiarán."
  },
  {
    nivel: "🎤 Fortuna de Canto",
    emoji: "🎤",
    mensaje: "Canta tu verdad. Tu voz será escuchada."
  },
  {
    nivel: "🎸 Fortuna de Guitarra",
    emoji: "🎸",
    mensaje: "La música de guitarra traerá paz a tu corazón."
  },
  {
    nivel: "🥁 Fortuna de Tambor",
    emoji: "🥁",
    mensaje: "Un ritmo nuevo te marcará el paso. Sigue su compás."
  },
  {
    nivel: "🎺 Fortuna de Trompeta",
    emoji: "🎺",
    mensaje: "Anunciarás algo importante. Prepárate para hablar."
  },
  {
    nivel: "🎷 Fortuna de Saxofón",
    emoji: "🎷",
    mensaje: "La nostalgia te visitará, pero con un tono dulce y melódico."
  },
  {
    nivel: "🎻 Fortuna de Violín",
    emoji: "🎻",
    mensaje: "La elegancia y la pasión se unirán en tu día."
  },
  {
    nivel: "🏅 Fortuna de Medalla",
    emoji: "🏅",
    mensaje: "Serás reconocido por tu esfuerzo. Una medalla te espera."
  },
  {
    nivel: "🎖️ Fortuna de Mérito",
    emoji: "🎖️",
    mensaje: "Tu mérito será recompensado. La justicia llega."
  },
  {
    nivel: "🏆 Fortuna de Campeón",
    emoji: "🏆",
    mensaje: "Eres un campeón, aunque no lo sepas. Siéntelo."
  },
  {
    nivel: "🥇 Fortuna de Oro",
    emoji: "🥇",
    mensaje: "El oro te espera en forma de logros o dinero."
  },
  {
    nivel: "🥈 Fortuna de Plata",
    emoji: "🥈",
    mensaje: "Un segundo lugar te dará una valiosa lección."
  },
  {
    nivel: "🥉 Fortuna de Bronce",
    emoji: "🥉",
    mensaje: "El bronce te enseña humildad y constancia."
  },
  {
    nivel: "🎯 Fortuna de Precisión",
    emoji: "🎯",
    mensaje: "Tus decisiones serán precisas como una flecha."
  },
  {
    nivel: "🏹 Fortuna de Arquero",
    emoji: "🏹",
    mensaje: "Apuntas alto y tu flecha dará en el blanco."
  },
  {
    nivel: "🛡️ Fortuna de Escudo",
    emoji: "🛡️",
    mensaje: "La protección te rodea. No temas al peligro."
  },
  {
    nivel: "⚔️ Fortuna de Espada",
    emoji: "⚔️",
    mensaje: "Corta las ataduras que te limitan. Sé libre."
  },
  {
    nivel: "🛡️ Fortuna de Defensa",
    emoji: "🛡️",
    mensaje: "Defiende tus ideales con firmeza. La verdad te respalda."
  },
  {
    nivel: "🔑 Fortuna de Llave",
    emoji: "🔑",
    mensaje: "Una llave abrirá una puerta importante. No la pierdas."
  },
  {
    nivel: "🚪 Fortuna de Puerta",
    emoji: "🚪",
    mensaje: "Una nueva puerta se abrirá. Cruza sin miedo."
  },
  {
    nivel: "📬 Fortuna de Carta",
    emoji: "📬",
    mensaje: "Recibirás noticias importantes en forma de carta o mensaje."
  },
  {
    nivel: "📦 Fortuna de Paquete",
    emoji: "📦",
    mensaje: "Una sorpresa llegará en un paquete. Espera con ansias."
  },
  {
    nivel: "🎁 Fortuna de Regalo",
    emoji: "🎁",
    mensaje: "Un regalo te hará sonreír. Agradece al universo."
  },
  {
    nivel: "🎈 Fortuna de Globo",
    emoji: "🎈",
    mensaje: "Tus sueños se elevan como globos. Suelta el miedo."
  },
  {
    nivel: "🎂 Fortuna de Cumpleaños",
    emoji: "🎂",
    mensaje: "Celebra cada día como si fuera tu cumpleaños. La vida es un regalo."
  },
  {
    nivel: "🎇 Fortuna de Fuegos",
    emoji: "🎇",
    mensaje: "La emoción brillará en tu vida. Disfruta el espectáculo."
  },
  {
    nivel: "🎆 Fortuna de Festival",
    emoji: "🎆",
    mensaje: "Un festival de alegría te espera. Participa."
  }
];

function obtenerFortuna() {
  return FORTUNAS[Math.floor(Math.random() * FORTUNAS.length)];
}

export default {
  command: ["omikuji", "fortuna", "suerte"],
  category: "Diversión",
  description: "Saca un papel de la suerte al estilo japonés. ¡Descubre tu fortuna del día!",
  run: async (sock, msg, args, context) => {
    const { sender, chatId } = context;
    const numero = sender.split("@")[0];

    const fortuna = obtenerFortuna();
    const fecha = new Date().toLocaleDateString("es-HN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    let texto = `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n`;
    texto += `  🎐 *OMIKUJI DE YUI* 🎐\n`;
    texto += `  _Tu fortuna del día_ 🦋\n`;
    texto += `🌸┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🌸\n\n`;

    texto += `👤 @${numero}\n`;
    texto += `📅 ${fecha}\n\n`;
    texto += `${fortuna.emoji} *${fortuna.nivel}*\n\n`;
    texto += `${fortuna.mensaje}\n\n`;

    texto += `🦋┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈🦋\n`;
    texto += `💕 _Que la suerte te acompañe siempre_ 🌹`;

    await sock.sendMessage(
      chatId,
      {
        text: texto,
        mentions: [sender]
      },
      { quoted: msg }
    );
  }
};