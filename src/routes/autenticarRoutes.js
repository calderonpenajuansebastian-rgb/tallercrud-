const { Router } = require("express");

const enrutador = Router();
const { iniciarSesion, registrarUsuario } = require("../controllers/autenticacioncontrollers");

// Ruta base para probar desde navegador o Postman
enrutador.get("/", (req, res) => {
    res.json({ mensaje: "ruta de autenticacion" });
});

// Login con credenciales de prueba
enrutador.post("/login", iniciarSesion);

// Registro de usuario
enrutador.post("/registro", registrarUsuario);

module.exports = enrutador;