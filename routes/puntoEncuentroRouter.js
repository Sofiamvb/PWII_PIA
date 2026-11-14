const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

module.exports = function () {

    //Mostrar puntos de compra
    router.get('/admin/puntos',
        adminController.mostrarPuntos);

    //Agregar punto de compra
    router.post('/admin/puntos',
        adminController.nuevoPunto);

    //Desactivar punto de compra
    router.put('/admin/puntos/:idPunto/desactivar',
        adminController.desactivarPunto);

    //Activar punto de compra
    router.put('/admin/puntos/:idPunto/activar',
        adminController.activarPunto);

    //Eliminar punto de compra
    router.delete('/admin/puntos/:idPunto',
        adminController.eliminarPunto);

    return router;
}