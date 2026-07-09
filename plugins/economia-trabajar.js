import { obtenerUsuario, guardarUsuario, formatearMonto } from "../economyDB.js";

const ENFRIAMIENTO_MS = 60 * 60 * 1000;
const GANANCIA_MIN = 100;
const GANANCIA_MAX = 800;

const TRABAJOS = [
  "atendiste una cafetería", "programaste una app móvil", "diseñaste un sitio web", "cuidaste niños",
  "vendiste ropa vintage", "hiciste un curso de inglés", "reparaste computadoras", "diste clases de matemáticas",
  "cocinaste para un restaurante", "pintaste un cuadro", "escribiste un poema", "editaste un video",
  "tradujiste un documento", "organizaste un evento", "cuidaste un jardín", "paseaste perros",
  "hiciste una limpieza profunda", "armaste un mueble", "diseñaste un logo", "grabaste un podcast",
  "revisaste códigos de otros", "diste asesoría legal", "enseñaste a usar Excel", "administraste redes sociales",
  "creaste contenido para TikTok", "grabaste un tutorial", "reparaste un celular", "instalaste un aire acondicionado",
  "hiciste un mural", "tocaste un instrumento", "bailaste en un show", "cuidaste una tienda",
  "repartiste volantes", "ayudaste en una biblioteca", "clasificaste libros", "organizaste un archivo",
  "hiciste un inventario", "diste soporte técnico", "creaste un chatbot", "analizaste datos",
  "hiciste un videojuego", "modelaste en 3D", "animaste un personaje", "creaste una historieta",
  "escribiste un cuento", "tradujiste al japonés", "enseñaste a bailar", "fuiste guía turístico",
  "vendiste artesanías", "cuidaste un museo", "ayudaste en un refugio", "domaste caballos",
  "entrenaste perros", "cuidaste una granja", "cultivaste vegetales", "vendiste flores",
  "hiciste arreglos florales", "decoraste un salón", "organizaste una fiesta", "fuiste DJ",
  "mezclaste música", "horneaste pan", "preparaste sushi", "hiciste pizza artesanal",
  "elaboraste postres", "diseñaste joyería", "reparaste relojes", "limpiaste alfombras",
  "puliste muebles", "restauraste antigüedades", "cuidaste una piscina", "entrenaste atletas",
  "enseñaste a nadar", "fuiste socorrista", "cuidaste un faro", "pescaste en el mar",
  "navegaste un barco", "reparaste motores", "cuidaste un taller", "pintaste una casa",
  "construiste una pared", "carpintería fina", "electricidad básica", "fontanería",
  "reparaste techos", "pusiste baldosas", "diseñaste interiores", "asesoraste en moda",
  "vendiste cosméticos", "diste masajes", "cuidaste ancianos", "ayudaste en un hospital",
  "preparaste medicinas", "investigaste curas", "enseñaste primeros auxilios", "fuiste voluntario",
  "recolectaste donaciones", "organizaste una campaña", "diseñaste un cartel", "impresiste en 3D",
  "creaste una app de citas", "programaste un juego de mesa", "automatizaste un proceso",
  "diste una charla TED", "escribiste un artículo", "editaste una foto", "creaste un meme",
  "grabaste un corto", "actuaste en teatro", "fuiste extra en una película", "doblaje de voz",
  "locución para radio", "fuiste youtuber", "streamer de videojuegos", "probaste videojuegos",
  "reportaste errores", "mejoraste IA", "creaste un bot", "programaste un asistente",
  "diseñaste bases de datos", "optimizaste un servidor", "seguridad informática", "hackeo ético",
  "auditoría de sistemas", "redacción de contratos", "traducción jurada", "mediación de conflictos",
  "coaching personal", "mente de negocios", "marketing digital", "SEO para páginas",
  "manejo de anuncios", "copywriting", "diseño de folletos", "fotografía de bodas",
  "filmación de eventos", "edición de sonido", "creación de efectos", "maquillaje profesional",
  "estilismo de cabello", "cuidado de la piel", "masajes relajantes", "yoga instructor",
  "pilates", "entrenamiento personal", "nutrición deportiva", "preparación de desayunos",
  "catering", "repostería fina", "barista", "sommelier", "cata de vinos", "elaboración de cerveza",
  "fabricación de velas", "jabones artesanales", "perfumería", "creación de cosméticos",
  "investigación de mercados", "encuestas", "análisis financiero", "contabilidad",
  "gestión de proyectos", "liderazgo de equipos", "entrenamiento corporativo", "dinámicas de grupo",
  "terapia de pareja", "consejería familiar", "orientación vocacional", "pruebas psicológicas",
  "escritura de guiones", "dirección de cine", "producción musical", "arreglos orquestales",
  "taller de cerámica", "escultura en hielo", "origami", "papiroflexia", "caligrafía",
  "lettering", "ilustración digital", "dibujo a lápiz", "acuarela", "óleo sobre lienzo",
  "grabado en madera", "talla de piedra", "joyería de plata", "esmalte de uñas",
  "tatuajes temporales", "piercing", "maquillaje artístico", "disfraces", "cosplay",
  "cuidado de mascotas exóticas", "adiestramiento de loros", "cría de peces", "apicultura",
  "jardinería vertical", "bonsái", "cultivo de orquídeas", "huerta urbana", "compostaje",
  "reciclaje creativo", "upcycling", "costura", "tejido", "bordado", "crochet",
  "patchwork", "alfombrado", "tapicería", "luthería", "reparación de instrumentos",
  "afinación de pianos", "taller de baterías", "reparación de bicicletas", "mecánica de autos",
  "lavado de autos", "detallado de vehículos", "logística de envíos", "almacenamiento",
  "embalaje", "cartonería", "encuadernación", "restauración de libros", "iluminación escénica",
  "sonido en vivo", "escenografía", "utilería", "vestuario", "peluquería canina",
  "spa para perros", "paseos grupales", "guardería de mascotas", "cuidado de reptiles",
  "veterinaria", "auxiliar de clínica", "farmacia", "optometría", "audiología",
  "terapia física", "rehabilitación", "entrenamiento de equilibrio", "natación terapéutica",
  "clases de surf", "esquí acuático", "buceo", "snorkel", "senderismo guiado",
  "campamento", "supervivencia en bosques", "primeros auxilios en montaña", "rescate",
  "bombero voluntario", "protección civil", "vigilancia", "seguridad privada",
  "control de acceso", "conserje", "recepcionista", "telefonista", "secretaría",
  "archivo de documentos", "gestión de agenda", "asistente personal", "organización de viajes",
  "agente de viajes", "guía de museo", "explicador de arte", "historiador", "arqueólogo",
  "antropólogo", "sociólogo", "psicólogo", "investigador", "científico de datos"
];

export default {
  command: ["trabajar", "work"],
  category: "Economia",
  description: "Trabaja para ganar Yui (cada 1 hora).",
  run: async (sock, msg, args, context) => {
    const { sender, chatId } = context;
    const numero = sender.split("@")[0].split(":")[0];

    const usuario = obtenerUsuario(numero);
    const ahora = Date.now();
    const tiempoRestante = usuario.ultimoTrabajo + ENFRIAMIENTO_MS - ahora;

    if (tiempoRestante > 0) {
      const minutos = Math.ceil(tiempoRestante / (60 * 1000));
      return await sock.sendMessage(
        chatId,
        { text: `⏳ Estás cansada/o. Vuelve a trabajar en *${minutos} minuto(s)*.` },
        { quoted: msg }
      );
    }

    const ganancia = Math.floor(Math.random() * (GANANCIA_MAX - GANANCIA_MIN + 1)) + GANANCIA_MIN;
    const trabajo = TRABAJOS[Math.floor(Math.random() * TRABAJOS.length)];

    guardarUsuario(numero, {
      saldo: usuario.saldo + ganancia,
      ultimoTrabajo: ahora,
    });

    await sock.sendMessage(
      chatId,
      {
        text: `💼 Hoy ${trabajo} y ganaste:\n💵 +${formatearMonto(ganancia)}`,
        mentions: [sender],
      },
      { quoted: msg }
    );
  },
};