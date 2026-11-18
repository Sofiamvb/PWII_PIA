const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

module.exports = function () {

    //Mostrar categorias
    //La ven todos (se usa en el filtro del home y al publicar), pero pide sesion
    router.get('/admin/categorias/mostrar',
        verificarToken,
        adminController.mostrarCategorias);

    //Agregar categoria
    router.post('/admin/categorias',
        verificarToken, soloAdmin,
        adminController.nuevaCategoria);

    //Editar categoria
    router.put('/admin/categorias/:idCategoria',
        verificarToken, soloAdmin,
        adminController.editarCategoria);

    //Eliminar categoria
    router.delete('/admin/categorias/:idCategoria',
        verificarToken, soloAdmin,
        adminController.eliminarCategoria);

    return router;
}
