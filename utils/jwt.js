const jwt = require('jsonwebtoken');

/*
 * Aqui se firma y se lee el token de sesion. Es el unico archivo que conoce
 * el secreto, asi no anda repartido por el proyecto.
 */

// Se lee cada vez (y no al cargar el archivo) para que el error salga claro
// si alguien clona el proyecto y se le olvida crear el .env
function obtenerSecreto() {

    const secreto = process.env.JWT_SECRET;

    if (!secreto) {
        throw new Error('Falta JWT_SECRET en el archivo .env');
    }

    return secreto;
}

// El token solo guarda el id y el rol. El estado de la verificacion NO se guarda
// aqui a proposito: cambia cuando el admin aprueba y el token quedaria desactualizado,
// por eso ese dato siempre se vuelve a leer de la base.
function firmarToken(usuario) {

    return jwt.sign(
        {
            id: usuario._id,
            rol: usuario.rol
        },
        obtenerSecreto(),
        {
            expiresIn: process.env.JWT_EXPIRACION || '8h'
        }
    );
}

// Lanza error si el token esta vencido o viene alterado
function leerToken(token) {
    return jwt.verify(token, obtenerSecreto());
}

module.exports = { firmarToken, leerToken };
