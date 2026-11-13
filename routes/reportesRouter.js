const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

module.exports = function () {

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