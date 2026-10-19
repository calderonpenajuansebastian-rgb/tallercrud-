const { Router } = require("express");

const pruebaRouter = require("./pruebaRouter");
const autenticarRouter = require("./autenticarRoutes");
const entidadesRouter = require("./entidades");
const { listarUsuarios } = require("../controllers/usuarisoscontroller");

const enrutador = Router();

// Rutas que sirven TODA la base de datos (roles, usuarios, aprendices, etc.)
enrutador.use("/", entidadesRouter);

enrutador.use("/rutaprueba", pruebaRouter);
enrutador.use("/autenticar", autenticarRouter);
enrutador.get("/listado", listarUsuarios);

module.exports = enrutador;
