const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

const app = express();
const PORT = process.env.PORT || 3333;
const registroMiddleware = require('./src/middleware/registroMiddleware');
const { validarCampos } = require('./src/utelleria/validar');
const manejadorErrores = require('./src/middleware/manejadorErrores');
const apiRouter = require('./src/routes/indesx');
const prisma = require('./src/config/db');

const directorioImagenes = path.join(__dirname, 'src', 'middleware', 'misImagenes');
const rutaArchivoJson = path.join(__dirname, 'listaDatos.json');

const usuarioValido = {
  usuario: 'dilan',
  clave: '123456'
};

if (!fs.existsSync(directorioImagenes)) {
  fs.mkdirSync(directorioImagenes, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(registroMiddleware);
app.use('/api', apiRouter);

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => cb(null, directorioImagenes),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const cargar = multer({ storage: almacenamiento });

const asegurarRelaciones = async (body) => {
  let programaId = body.programaId ? Number(body.programaId) : null;
  let fichaId = body.fichaId ? Number(body.fichaId) : null;

  if (!programaId) {
    const prog = await prisma.programa.upsert({
      where: { codigo: "DEFAULT" },
      update: {},
      create: { codigo: "DEFAULT", nombre: "Programa general", nivel: "Técnico" },
    });
    programaId = prog.id;
  }
  if (!fichaId) {
    const fich = await prisma.ficha.upsert({
      where: { numero: "0" },
      update: {},
      create: { numero: "0", jornada: "Diurna", modalidad: "Presencial", programaId },
    });
    fichaId = fich.id;
  }
  return { programaId, fichaId };
};

app.get('/', (req, res) => {
  res.send('Servidor inicializado correctamente');
});

app.post('/login', (req, res) => {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    return res.status(400).json({ error: 'Debe enviar usuario y clave.' });
  }

  if (usuario === usuarioValido.usuario && clave === usuarioValido.clave) {
    return res.status(200).json({
      mensaje: 'Inicio de sesión correcto',
      usuario: usuarioValido.usuario
    });
  }

  return res.status(401).json({ error: 'usuario y/o clave incorrectos' });
});

app.post('/rutaprotegida', (req, res) => {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    return res.status(400).json({ error: 'Debe enviar usuario y clave.' });
  }

  if (usuario === usuarioValido.usuario && clave === usuarioValido.clave) {
    return res.status(200).json({
      mensaje: 'Acceso permitido',
      usuario: usuarioValido.usuario
    });
  }

  return res.status(401).json({ error: 'usuario y/o clave incorrectos' });
});

app.get('/aprendices', async (req, res, next) => {
  try {
    const aprendices = await prisma.aprendiz.findMany({
      include: { programa: true, ficha: true, usuario: true },
    });
    return res.json(aprendices);
  } catch (error) {
    return next(error);
  }
});

app.get('/aprendices/:dni', async (req, res, next) => {
  try {
    const aprendiz = await prisma.aprendiz.findUnique({
      where: { documento: String(req.params.dni) },
      include: { programa: true, ficha: true, usuario: true },
    });

    if (!aprendiz) {
      return res.status(404).json({ error: 'Aprendiz no encontrado' });
    }

    return res.json(aprendiz);
  } catch (error) {
    return next(error);
  }
});

app.post('/aprendices', cargar.single('imagen'), validarCampos, async (req, res, next) => {
  try {
    const datos = req.body;
    const { programaId, fichaId } = await asegurarRelaciones(datos);

    const aprendiz = await prisma.aprendiz.create({
      data: {
        documento: String(datos.documento || datos.dni || Date.now()),
        nombre: datos.nombre,
        apellido: datos.apellido || "",
        correo: datos.correo,
        telefono: datos.telefono || null,
        programaId,
        fichaId,
        usuarioId: datos.usuarioId ? Number(datos.usuarioId) : null,
      },
      include: { programa: true, ficha: true },
    });

    return res.status(201).json(aprendiz);
  } catch (error) {
    return next(error);
  }
});

app.put('/aprendices/:dni', async (req, res, next) => {
  try {
    const datos = { ...req.body };
    const data = {};
    if (datos.nombre !== undefined) data.nombre = datos.nombre;
    if (datos.apellido !== undefined) data.apellido = datos.apellido;
    if (datos.correo !== undefined) data.correo = datos.correo;
    if (datos.telefono !== undefined) data.telefono = datos.telefono;
    if (datos.documento !== undefined) data.documento = String(datos.documento);

    const aprendiz = await prisma.aprendiz.update({
      where: { documento: String(req.params.dni) },
      data,
      include: { programa: true, ficha: true },
    });

    return res.json({ mensaje: 'Aprendiz modificado con éxito', aprendiz });
  } catch (error) {
    return next(error);
  }
});

app.delete('/aprendices/:dni', async (req, res, next) => {
  try {
    await prisma.aprendiz.delete({ where: { documento: String(req.params.dni) } });
    return res.json({ mensaje: 'Aprendiz eliminado con éxito' });
  } catch (error) {
    return next(error);
  }
});

app.use(manejadorErrores);

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

module.exports = app;
