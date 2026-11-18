const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const reportesController = require('../controllers/reportesController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

module.exports = function () {

    //Crear reporte de un usuario (sin producto)
    router.post('/reportes',
        verificarToken,
        reportesController.reportarUsuario);

    //Crear reporte de una compra
    router.post('/reportes/compra/:idPedido',
        verificarToken,
        reportesController.reportarCompra);

    //Mostrar reportes
    router.get('/admin/reportes',
        verificarToken, soloAdmin,
        adminController.mostrarReportes);

    //Ver Reporte
    router.get('/admin/reportes/:idReporte',
        verificarToken, soloAdmin,
        adminController.mostrarReporte);

    //Rechazar Reporte
    router.put('/admin/reportes/:idReporte/rechazar',
        verificarToken, soloAdmin,
        adminController.rechazarReporte);

    //Eliminar Reporte
    router.delete('/admin/reportes/:idReporte',
        verificarToken, soloAdmin,
        adminController.eliminarReporte);

    return router;
}
