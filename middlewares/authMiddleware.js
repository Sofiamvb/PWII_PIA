const { leerToken } = require('../utils/jwt');

/*
 * Middlewares de sesion:
 *   verificarToken -> revisa que venga un JWT valido y deja los datos en req.usuario
 *   soloAdmin      -> ademas exige que el rol sea admin (va DESPUES de verificarToken)
 */

function verificarToken(req, res, next) {

    const cabecera = req.headers.authorization;

    // Se espera "Authorization: Bearer <token>"
    if (!cabecera || !cabecera.startsWith('Bearer ')) {
        return res.status(401).json({
            mensaje: 'No se envió el token de sesión'
        });
    }

    const token = cabecera.slice(7).trim();

    if (!token) {
        return res.status(401).json({
            mensaje: 'No se envió el token de sesión'
        });
    }

    try {

        const datos = leerToken(token);

        // De aqui en adelante los controladores saben quien hizo la peticion
        req.usuario = {
            id: datos.id,
            rol: datos.rol
        };

        next();

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                mensaje: 'Tu sesión expiró, vuelve a iniciar sesión',
                expirado: true
            });
        }

        return res.status(401).json({
            mensaje: 'El token de sesión no es válido'
        });
    }

}

function soloAdmin(req, res, next) {

    if (!req.usuario || req.usuario.rol !== 'admin') {
        return res.status(403).json({
            mensaje: 'Solo un administrador puede hacer esto'
        });
    }

    next();
}

module.exports = { verificarToken, soloAdmin };
