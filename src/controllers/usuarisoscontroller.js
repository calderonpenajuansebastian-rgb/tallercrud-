const ingresar =require("../controllers/usuarioController")
const listarUsuarios = async (req,res)=>{
    res.json({mensaje: "Lista de usuarios"})
}

module.exports = {listarUsuarios}  