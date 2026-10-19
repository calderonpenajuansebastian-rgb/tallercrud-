const prisma = require("../config/db");

const listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await prisma.usuario.findMany({ include: { rol: true } });
    res.json(usuarios);
  } catch (e) {
    next(e);
  }
};

const obtenerUsuario = async (req, res, next) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.params.id) },
      include: { rol: true },
    });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (e) {
    next(e);
  }
};

module.exports = { listarUsuarios, obtenerUsuario };
