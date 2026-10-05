const jwt = require("jsonwebtoken");

const iniciarSesion = async (req, res) => {
    const { usuario, clave } = req.body;

    const usuarioValido = {
        usuario: "dilan",
        clave: "123456"
    };

    if (!usuario || !clave) {
        return res.status(400).json({ mensaje: "Debe enviar usuario y clave" });
    }

    if (usuario !== usuarioValido.usuario || clave !== usuarioValido.clave) {
        return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
        { usuario },
        process.env.SECRETO || "miSecreto123",
        { expiresIn: "1h" }
    );

    return res.status(200).json({
        mensaje: "Autenticacion exitosa",
        usuario,
        token
    });
};

const registrarUsuario = (req, res) => {
    const { nombre, correo, usuario, clave } = req.body;

    if (!nombre || !correo || !usuario || !clave) {
        return res.status(400).json({ mensaje: "Faltan datos para registrar usuario" });
    }

    return res.status(201).json({
        mensaje: "Registro exitoso",
        usuario,
        correo,
        nombre
    });
};

module.exports = { iniciarSesion, registrarUsuario };