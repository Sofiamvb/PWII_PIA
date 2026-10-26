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