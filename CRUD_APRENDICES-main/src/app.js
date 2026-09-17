require("dotenv").config();
const express = require("express");
const enrutador = require("./routes/indesx");

const app = express();

// middleware para formatear datos del body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ruta por defecto para la app
app.use("/api", enrutador);

app.get("/", (req, res) => {
  res.send("Api rest");
});

module.exports = app;