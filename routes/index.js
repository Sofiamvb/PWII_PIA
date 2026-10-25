const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const productosController = require('../controllers/productosController');
const pedidosController = require('../controllers/pedidosController');


module.exports = function () {

    //Agregar nuevos usuarios vía POST
    router.post('/users', userController.nuevoUser);

    // Inicio de sesion
    router.post('/users/login', userController.login);

    //actualizar un usuario por id
    router.put('/users/:idUser', userController.actualizarUser);

    //actualizar un password por id
    router.put('/users/password/:idUser', userController.actualizarPassword);

    //Carga de documentos del usuario por ID
    //router.post('/users/:idUser', userController.verificacion);

    //obtener todos los usuarios
    //router.get('/users', userController.mostrarUsers);

    //muestra un usuario en especifico (ID)
    //router.get('/users/:idUser', userController.mostrarUser);

    //Eliminar un usuario por id
    //router.delete('/users/:idUser', userController.eliminarUser);

    /*PRODUCTOS*/

    //Nuevo producto 
    router.post('/productos', productosController.subirArchivo,
        productosController.nuevoProducto);

    //Mostrar todos los productos
    router.get('/productos', productosController.mostrarProductos);

    //Mostrar productos por ID
    router.get('/productos/:idProducto', productosController.mostrarProducto);

    //Actualizar producto por ID
    router.put('/productos/:idProducto', productosController.subirArchivo,
        productosController.actualizarProducto);

    //Eliminar un producto
    router.delete('/productos/:idProducto', productosController.eliminarProducto);

    /*PEDIDOS*/
    //Agregar nuevos pedidos
    router.post('/pedidos', pedidosController.nuevoPedido);

    //Mostrar todos los pedidos
    router.get('/pedidos', pedidosController.mostrarPedidos);

    //Mostrar pedido por ID
    router.get('/pedidos/:idPedido', pedidosController.mostrarPedido);

    //Actualizar pedidos por ID 
    router.put('/pedidos/:idPedido', pedidosController.actualizarPedido);

    //Eliminar pedidos por ID
    router.delete('/pedidos/:idPedido', pedidosController.eliminarPedido);



    return router;
}