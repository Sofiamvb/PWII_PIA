const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const productosController = require('../controllers/productosController');
const pedidosController = require('../controllers/pedidosController');
const adminController = require('../controllers/adminController');


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
    router.post('/users/verificacion/:idUser', userController.subirArchivo, userController.verificacion);

    //Mostrar info de usuario por id en perfil
    router.get('/useresInfo/:idUser', userController.mostrarUser);

    /*ADMIND*/

    //CAMBIAR ESTADO DE LA VERIFICACION A APROBADO O RECHAZADO
    router.get('/admin/mostrarVerificaciones', userController.mostrarVerificaciones);

    //MOSTRAR USUARIOS CON EL ESTADO PENDIENTE DE DOCUMENTACION ADM
    router.patch('/admin/verificacionEstatus/:idUser', userController.verificacionAdmin);

    //obtener todos los usuarios
    //router.get('/users', userController.mostrarUsers);

    //Eliminar un usuario por id
    //router.delete('/users/:idUser', userController.eliminarUser);

    /*PRODUCTOS*/

    

    //Mostrar todos los productos
    router.get('/productos', productosController.mostrarProductos);

    //Mostrar productos por ID
    router.get('/productos/:idProducto', productosController.mostrarProducto);

    //Actualizar producto por ID
    router.put('/productos/:idProducto', productosController.subirArchivo,
        productosController.actualizarProducto);

    
 //ALEX 
    //Mostrar producto por ID
    router.get('/productos/:idProducto', productosController.mostrarProducto);

    //Actualizar producto por ID
    router.put('/productos/:idProducto',productosController.subirArchivo, productosController.actualizarProducto);

    //Eliminar en editar un producto por ID
    router.delete('/productos/:idProducto', productosController.eliminarProducto);  

    //publicar nuevo producto
    router.post('/productos', productosController.subirArchivo,productosController.nuevoProducto);

    //Mostrar todos los productos
    router.get('/productos/usuario/:idUsuario', productosController.misPublicaciones);


    // Mostrar puntos de encuentro disponibles
    router.get('/productos/puntos/mostrar', productosController.mostrarPuntosEncuentro);


    // Elegir punto de encuentro para un producto
    router.put('/productos/:idProducto/punto/:idPunto', productosController.elegirPuntoEncuentro);


    // Crear reporte de un producto
    router.post('/productos/:idProducto/reportar', productosController.reportarProducto);

    // Mostrar los reportes realizados por un usuario
    router.get('/productos/reportes/usuario/:idUsuario', productosController.misReportes);

    
   
    // Mostrar datos de una compra
    router.get('/pedidos/:idPedido', productosController.mostrarPedido);

    // Cancelar compra
    router.put('/pedidos/:idPedido/cancelar', productosController.cancelarPedido);

    //mis ventas
    router.get('/pedidos/ventas/:idUsuario', pedidosController.misVentas);

    //mis compras
    router.get('/pedidos/compras/:idUsuario', pedidosController.misCompras);

    router.post('/pedidos/comprar/:idProducto/:idComprador',productosController.comprarProducto);






        //-------------------ADMINISTRADOR -------------------
        
        
            //USUARIOS
            
            //Mostrar usuarios
            router.get('/admin/usuarios',
            adminController.mostrarUsuarios);
        
            //Ssupender Usuario
            router.put('/admin/usuarios/:idUsuario/suspender',
            adminController.suspenderUsuario);
        
                //CATEGORIAS
        
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
        
        
            //PRODUCTOS
        
            //Mostrar productos
            router.get('/admin/productos',
            adminController.mostrarProductos);
        
            //Agregar producto
            router.put('/admin/productos/:idProducto/aprobar',
            adminController.aprobarProducto);
        
            //Rechazar producto
            router.put('/admin/productos/:idProducto/rechazar',
            adminController.rechazarProducto);
        
            //Cambiar disponibilidad de producto
            router.put('/admin/productos/:idProducto/disponibilidad',
            adminController.cambiarDisponibilidad);
        
            //PUNTOS DE COMPRA
        
            //Mostrar puntos de compra
            router.get('/admin/puntos',
            adminController.mostrarPuntos);
        
            //Agregar punto de compra
            router.post('/admin/puntos',
            adminController.nuevoPunto);
        
            //Desactivar punto de compra
            router.put('/admin/puntos/:idPunto/desactivar',
            adminController.desactivarPunto);   
        
            //Eliminar punto de compra
            router.delete('/admin/puntos/:idPunto',
            adminController.eliminarPunto);
        
            //TRANSACCIONES
        
            //Mostrar transacciones
            router.get('/admin/transacciones',
            adminController.mostrarTransacciones);
        
            //REPORTES
        
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