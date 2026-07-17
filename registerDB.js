import fs from "fs";
import path from "path";

const DB_PATH = "./database/registro.json";

function asegurarDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}));
}

export function cargarRegistro() {
  asegurarDB();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

export function guardarRegistro(data) {
  asegurarDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function estaRegistrado(numero) {
  const data = cargarRegistro();
  return Boolean(data[numero]);
}

export function obtenerRegistro(numero) {
  const data = cargarRegistro();
  return data[numero] || null;
}

export function registrarUsuario(numero, { nombre, edad }) {
  const data = cargarRegistro();
  data[numero] = {
    nombre,
    edad,
    fechaRegistro: Date.now(),
  };
  guardarRegistro(data);
  return data[numero];
}

export function eliminarRegistro(numero) {
  const data = cargarRegistro();
  if (!data[numero]) return false;
  delete data[numero];
  guardarRegistro(data);
  return true;
}
