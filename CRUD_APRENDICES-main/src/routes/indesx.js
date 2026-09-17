//
const {Router} = require("express")
//imporatae enrutador de la entidad
const pruebaRouter = require("./pruebaRouter")
//
const autenticarRouter = require("./AutenticarRoutes")

const enrutador = Router()


//usar enrutador
enrutador.use("/rutaprueba" , pruebaRouter)
enrutador.use("/autenticar" , autenticarRouter)

module.exports= enrutador