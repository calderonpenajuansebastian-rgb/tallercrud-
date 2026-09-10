const { json } = require("express")

const manejadorErrores = (error, req, res, next)=>{
    const codigoEstado = error.statusCode || 500
    const mensaje = error.menssage || "Error inesperado"
    console.error(`Hubo un error: ${new Date(). toISOString()} ${codigoEstado} - {mensaje}`)

    if(error.stack){
        console.error(error.stack)
    }
    res,json({
        Estado: "ERROR",
        codigoEstado,
        mensaje,
        ...(process.env.NODE_ENV == "development" && {stack: error.stack})
    })
}

module.exports = manejadorErrores