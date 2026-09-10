const registroMiddleware = (req, res, next) => {
    const fecha = new Date().toISOString();
    const tiempoInicio = Date.now(); // Captura el tiempo justo cuando entra la petición

    console.log(`[Historial de peticiones] ${fecha} , ${req.method}, ${req.url}, ${req.ip}`);

    res.on('finish', () => {
        const duracion = Date.now() - tiempoInicio; 
        console.log(fecha, 'respuesta', res.statusCode, duracion + 'ms');    
    });

    next();
};

module.exports = registroMiddleware;
