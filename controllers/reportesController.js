const ReportesMiddleware = require('../middlewares/reportesMiddleware');

const reportesMiddleware = new ReportesMiddleware();


//CREAR REPORTE DE UNA COMPRA
exports.reportarCompra = async (req, res, next) => {

    try {

        const reporte = await reportesMiddleware.reportarCompra(
            req.params.idPedido,
            req.body
        );

        res.json({
            mensaje: 'Reporte enviado correctamente',
            reporte: reporte
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


//CREAR REPORTE DE UN USUARIO (sin producto)
exports.reportarUsuario = async (req, res, next) => {

    try {

        const reporte = await reportesMiddleware.reportarUsuario(req.body);

        res.json({
            mensaje: 'Reporte enviado correctamente',
            reporte: reporte
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
