const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const adminController = require('../controllers/adminController');
const { soloVerificados } = require('../middlewares/verificadoMiddleware');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

module.exports = function () {

    //ALEX

    //Mostrar todos los productos Home
    router.get('/productos/home', verificarToken, productosController.mostrarProductos);

    //Mostrar producto por ID
    router.get('/productos/:idProducto', verificarToken, productosController.mostrarProducto);

    //Actualizar producto por ID
    router.put('/productos/:idProducto', verificarToken, productosController.editarArchivo, productosController.actualizarProducto);

    //Eliminar en editar un producto por ID
    router.delete('/productos/:idProducto', verificarToken, productosController.eliminarProducto);

    //publicar nuevo producto
    //El id del usuario viene dentro del formulario, por eso la validacion va despues de multer
    router.post('/productos',
        verificarToken,
        productosController.subirArchivo,
        soloVerificados(req => req.body.usuario),
        productosController.nuevoProducto);

    //Mostrar productos en mis publicaciones
    router.get('/productos/usuario/:idUsuario', verificarToken, productosController.misPublicaciones);

    // Mostrar puntos de encuentro disponibles
    router.get('/productos/puntos/mostrar', verificarToken, productosController.mostrarPuntosEncuentro);

    // Elegir punto de encuentro para un producto
    router.put('/productos/:idProducto/punto/:idPunto', verificarToken, productosController.elegirPuntoEncuentro);

    // Crear reporte de un producto
    router.post('/productos/:idProducto/reportar', verificarToken, productosController.reportarProducto);

    // Mostrar los reportes realizados por un usuario
    router.get('/productos/reportes/usuario/:idUsuario', verificarToken, productosController.misReportes);

    //Mostrar productos
    router.get('/admin/productos',
        verificarToken, soloAdmin,
        adminController.mostrarProductos);

    //Aporbar producto
    router.put('/admin/productos/:idProducto/aprobar',
        verificarToken, soloAdmin,
        adminController.aprobarProducto);

    //Rechazar producto
    router.put('/admin/productos/:idProducto/rechazar',
        verificarToken, soloAdmin,
        adminController.rechazarProducto);

    //Cambiar disponibilidad de producto
    router.put('/admin/productos/:idProducto/disponibilidad',
        verificarToken, soloAdmin,
        adminController.cambiarDisponibilidad);

    return router;
}
