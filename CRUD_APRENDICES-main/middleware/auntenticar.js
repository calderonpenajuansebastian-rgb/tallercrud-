const jswtoken = require("jsonwebtoken");

const autenticarToken = (req, res, next) => {
    const token = req.body.token || req.query.token;
    if (!token) {
        return res.status(401).json({ error: "Acceso denegado, no provee token" });
    }
    jswtoken.verify(token, process.env.JWT_SECRET, (error, usuario) => {
        if (error) {
            return res.status(403).json({ error: "Token inválido" });
        }
        req.usuario = usuario;
        next();
    });
};

module.exports = autenticarToken;
