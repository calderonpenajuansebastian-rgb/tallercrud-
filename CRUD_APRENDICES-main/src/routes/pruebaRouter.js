const {Router} = require("express")

const enrutador = Router()


enrutador.get("/" , (req,res)=>{
    res.json({mensaje: "ruta de prueba 34071894"})

})

module.exports = enrutador