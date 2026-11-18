const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

module.exports = function () {

    //Mostrar puntos de compra
    //Los ve todo usuario con sesion, porque al publicar hay que elegir uno
    router.get('/admin/puntos',
        verificarToken,
        adminController.mostrarPuntos);

    //Agregar punto de compra
    router.post('/admin/puntos',
        verificarToken, soloAdmin,
        adminController.nuevoPunto);

    //Desactivar punto de compra
    router.put('/admin/puntos/:idPunto/desactivar',
        verificarToken, soloAdmin,
        adminController.desactivarPunto);

    //Activar punto de compra
    router.put('/admin/puntos/:idPunto/activar',
        verificarToken, soloAdmin,
        adminController.activarPunto);

    //Eliminar punto de compra
    router.delete('/admin/puntos/:idPunto',
        verificarToken, soloAdmin,
        adminController.eliminarPunto);

    return router;
}
