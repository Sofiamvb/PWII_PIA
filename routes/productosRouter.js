const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const adminController = require('../controllers/adminController');

module.exports = function () {

    //ALEX 

    //Mostrar todos los productos Home
    router.get('/productos/home', productosController.mostrarProductos);

    //Mostrar producto por ID
    router.get('/productos/:idProducto', productosController.mostrarProducto);

    //Actualizar producto por ID
    router.put('/productos/:idProducto', productosController.editarArchivo, productosController.actualizarProducto);

    //Eliminar en editar un producto por ID
    router.delete('/productos/:idProducto', productosController.eliminarProducto);

    //publicar nuevo producto
    router.post('/productos', productosController.subirArchivo, productosController.nuevoProducto);

    //Mostrar productos en mis publicaciones
    router.get('/productos/usuario/:idUsuario', productosController.misPublicaciones);

    // Mostrar puntos de encuentro disponibles
    router.get('/productos/puntos/mostrar', productosController.mostrarPuntosEncuentro);

    // Elegir punto de encuentro para un producto
    router.put('/productos/:idProducto/punto/:idPunto', productosController.elegirPuntoEncuentro);

    // Crear reporte de un producto
    router.post('/productos/:idProducto/reportar', productosController.reportarProducto);

    // Mostrar los reportes realizados por un usuario
    router.get('/productos/reportes/usuario/:idUsuario', productosController.misReportes);

    //Mostrar productos
    router.get('/admin/productos',
        adminController.mostrarProductos);

    //Aporbar producto
    router.put('/admin/productos/:idProducto/aprobar',
        adminController.aprobarProducto);

    //Rechazar producto
    router.put('/admin/productos/:idProducto/rechazar',
        adminController.rechazarProducto);

    //Cambiar disponibilidad de producto
    router.put('/admin/productos/:idProducto/disponibilidad',
        adminController.cambiarDisponibilidad);

    return router;
}