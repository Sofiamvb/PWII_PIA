const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const { soloVerificados } = require('../middlewares/verificadoMiddleware');
const { verificarToken } = require('../middlewares/authMiddleware');
const calificacionesController = require('../controllers/calificacionesController');

module.exports = function () {

    // Mostrar datos de una compra
    router.get('/pedidos/:idPedido', verificarToken, pedidosController.mostrarPedido);

    // Cancelar compra
    router.put('/pedidos/:idPedido/cancelar', verificarToken, pedidosController.cancelarPedido);

    //mis ventas
    router.get('/pedidos/ventas/:idUsuario', verificarToken, pedidosController.misVentas);

    //mis compras
    router.get('/pedidos/compras/:idUsuario', verificarToken, pedidosController.misCompras);

    //calificar la compra (el comprador le pone estrellas al producto)
    router.post('/pedidos/:idPedido/calificar',
        verificarToken,
        calificacionesController.calificarCompra);

    //comprar
    router.post('/pedidos/comprar/:idProducto/:idComprador',
        verificarToken,
        soloVerificados(req => req.params.idComprador),
        pedidosController.comprarProducto);


    return router;
}
