const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

module.exports = function () {

    //Mostrar categorias
    router.get('/admin/categorias/mostrar',
        adminController.mostrarCategorias);

    //Agregar categoria
    router.post('/admin/categorias',
        adminController.nuevaCategoria);

    //Editar categoria
    router.put('/admin/categorias/:idCategoria',
        adminController.editarCategoria);

    //Eliminar categoria
    router.delete('/admin/categorias/:idCategoria',
        adminController.eliminarCategoria);

    return router;
}