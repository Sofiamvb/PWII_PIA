const ReportesService = require('../services/reportesService');

const reportesService = new ReportesService();


//CREAR REPORTE DE UNA COMPRA
exports.reportarCompra = async (req, res, next) => {

    try {

        const reporte = await reportesService.reportarCompra(
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

        const reporte = await reportesService.reportarUsuario(req.body);

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
