const { Router } = require("express");
const prisma = require("../config/db");

// Config por entidad: modelo de Prisma y campos escalares aceptados en body
const ENTIDADES = {
  roles:          { modelo: "rol",          campos: ["nombre"] },
  usuarios:       { modelo: "usuario",      campos: ["usuario", "name", "rolId"] },
  programas:      { modelo: "programa",     campos: ["nombre", "codigo", "nivel"] },
  fichas:         { modelo: "ficha",        campos: ["numero", "jornada", "modalidad", "programaId"] },
  aprendices:     { modelo: "aprendiz",     campos: ["documento", "nombre", "apellido", "correo", "telefono", "programaId", "fichaId", "usuarioId"] },
  instructores:   { modelo: "instructor",   campos: ["documento", "nombre", "apellido", "correo", "especialidad", "usuarioId"] },
  empresas:       { modelo: "empresa",      campos: ["nit", "nombre", "direccion", "telefono", "correo"] },
  practicas:      { modelo: "practica",     campos: ["fechaInicio", "fechaFin", "estado", "cargo", "aprendizId", "empresaId"] },
  asistencias:    { modelo: "asistencia",   campos: ["fecha", "estado", "observacion", "aprendizId"] },
  calificaciones: { modelo: "calificacion", campos: ["nota", "competencia", "periodo", "aprendizId", "instructorId"] },
};

function convertir(campo, valor) {
  if (valor === undefined || valor === null || valor === "") return valor;
  if (campo.endsWith("Id")) return Number(valor);
  if (campo === "nota") return Number(valor);
  if (campo === "fecha" || campo === "fechaInicio" || campo === "fechaFin") return new Date(valor);
  return valor;
}

function filtrar(body, campos) {
  const datos = {};
  for (const c of campos) {
    if (body[c] !== undefined) datos[c] = convertir(c, body[c]);
  }
  return datos;
}

function crearRouterEntidad(modelo, campos) {
  const r = Router();

  r.get("/", async (req, res, next) => {
    try {
      res.json(await prisma[modelo].findMany());
    } catch (e) { next(e); }
  });

  r.get("/:id", async (req, res, next) => {
    try {
      const item = await prisma[modelo].findUnique({ where: { id: Number(req.params.id) } });
      if (!item) return res.status(404).json({ error: "No encontrado" });
      res.json(item);
    } catch (e) { next(e); }
  });

  r.post("/", async (req, res, next) => {
    try {
      const item = await prisma[modelo].create({ data: filtrar(req.body, campos) });
      res.status(201).json(item);
    } catch (e) { next(e); }
  });

  r.put("/:id", async (req, res, next) => {
    try {
      const item = await prisma[modelo].update({
        where: { id: Number(req.params.id) },
        data: filtrar(req.body, campos),
      });
      res.json(item);
    } catch (e) { next(e); }
  });

  r.delete("/:id", async (req, res, next) => {
    try {
      await prisma[modelo].delete({ where: { id: Number(req.params.id) } });
      res.json({ mensaje: "Eliminado con éxito" });
    } catch (e) { next(e); }
  });

  return r;
}

const enrutador = Router();
for (const [ruta, cfg] of Object.entries(ENTIDADES)) {
  enrutador.use(`/${ruta}`, crearRouterEntidad(cfg.modelo, cfg.campos));
}

module.exports = enrutador;
