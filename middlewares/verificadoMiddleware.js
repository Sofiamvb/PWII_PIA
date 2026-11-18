const Users = require('../models/users');
const fs = require('fs');
const path = require('path');

/*
 * Middleware para las rutas que solo pueden usar los estudiantes ya verificados
 * (comprar y publicar). El id del usuario no siempre viene en el mismo lugar:
 * al comprar viaja en la URL y al publicar viene dentro del formulario, por eso
 * se recibe una funcion que dice de donde sacarlo en cada ruta.
 */

// Cuando se rechaza una publicacion, multer ya guardo las imagenes en /uploads.
// Si no se borran se quedan ahi para siempre sin que ningun producto las use.
function borrarArchivosSubidos(req) {

    const archivos = [];

    if (req.file) {
        archivos.push(req.file);
    }

    if (req.files && req.files.length > 0) {
        archivos.push(...req.files);
    }

    archivos.forEach(archivo => {

        const ruta = path.join(__dirname, '../uploads/', archivo.filename);

        fs.unlink(ruta, (error) => {
            if (error) {
                console.log('No se pudo borrar el archivo', archivo.filename, error.message);
            }
        });

    });

}

// El mensaje cambia segun por que no esta verificado, para que el aviso sirva de algo
function mensajePorEstado(estado) {

    if (estado === 'pendiente') {
        return 'Tu verificación sigue en revisión. En cuanto la aprueben vas a poder comprar y publicar.';
    }

    if (estado === 'rechazado') {
        return 'Tu verificación fue rechazada. Vuelve a enviar tu documentación desde tu perfil.';
    }

    return 'Necesitas verificar que eres estudiante antes de comprar o publicar. Puedes hacerlo desde tu perfil.';
}

function soloVerificados(obtenerIdUsuario) {

    return async (req, res, next) => {

        const idUsuario = obtenerIdUsuario(req);

        if (!idUsuario) {
            borrarArchivosSubidos(req);
            return res.status(400).json({
                mensaje: 'No se recibió el usuario de la petición'
            });
        }

        try {

            const usuario = await Users.findById(idUsuario).select('verificacion');

            if (!usuario) {
                borrarArchivosSubidos(req);
                return res.status(404).json({
                    mensaje: 'El usuario no existe'
                });
            }

            const estado = usuario.verificacion
                ? usuario.verificacion.estado
                : 'sin enviar';

            if (estado !== 'aprobado') {
                borrarArchivosSubidos(req);
                return res.status(403).json({
                    mensaje: mensajePorEstado(estado),
                    // El front lo usa para saber si mandarlo a verificarse o solo avisarle
                    verificacion: estado
                });
            }

            next();

        } catch (error) {

            borrarArchivosSubidos(req);

            if (error.name === 'CastError') {
                return res.status(400).json({
                    mensaje: 'El id del usuario no es válido'
                });
            }

            console.log(error);
            return res.status(500).json({
                mensaje: 'Internal server error'
            });
        }

    };

}

module.exports = { soloVerificados };
