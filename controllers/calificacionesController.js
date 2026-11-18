const CalificacionService = require('../services/calificacionService');

const calificacionService = new CalificacionService();

//CALIFICAR UNA COMPRA
exports.calificarCompra = async (req, res, next) => {

    try {

        // El usuario sale del token, no del body: asi nadie califica a nombre de otro
        const calificacion = await calificacionService.nuevaCalificacion(
            req.params.idPedido,
            req.usuario.id,
            req.body
        );

        res.json({
            mensaje: 'Gracias por calificar tu compra',
            calificacion: calificacion
        });

    } catch (error) {

        if (error.status) {
            return res.status(error.status).json({
                mensaje: error.message
            });
        }

        next(error);
    }
}
