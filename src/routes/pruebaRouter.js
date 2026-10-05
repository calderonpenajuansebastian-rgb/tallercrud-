const {Router} = require("express")

const enrutador = Router()


enrutador.get("/" , (req,res)=>{
    res.json({mensaje: "Lista de usuarios"})

})

module.exports = enrutador