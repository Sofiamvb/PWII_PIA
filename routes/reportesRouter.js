const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const reportesController = require('../controllers/reportesController');

module.exports = function () {

    //Crear reporte de un usuario (sin producto)
    router.post('/reportes',
        reportesController.reportarUsuario);

    //Crear reporte de una compra
    router.post('/reportes/compra/:idPedido',
        reportesController.reportarCompra);

    //Mostrar reportes
    router.get('/admin/reportes',
        adminController.mostrarReportes);

    //Ver Reporte
    router.get('/admin/reportes/:idReporte',
        adminController.mostrarReporte);

    //Rechazar Reporte
    router.put('/admin/reportes/:idReporte/rechazar',
        adminController.rechazarReporte);

    //Eliminar Reporte
    router.delete('/admin/reportes/:idReporte',
        adminController.eliminarReporte);

    return router;
}