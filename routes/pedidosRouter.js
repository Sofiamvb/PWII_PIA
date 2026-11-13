const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

module.exports = function () {

    // Mostrar datos de una compra
    router.get('/pedidos/:idPedido', pedidosController.mostrarPedido);

    // Cancelar compra
    router.put('/pedidos/:idPedido/cancelar', pedidosController.cancelarPedido);

    //mis ventas
    router.get('/pedidos/ventas/:idUsuario', pedidosController.misVentas);

    //mis compras
    router.get('/pedidos/compras/:idUsuario', pedidosController.misCompras);

    //comprar
    router.post('/pedidos/comprar/:idProducto/:idComprador', pedidosController.comprarProducto);


    return router;
}