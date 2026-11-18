const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
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

    //Actualizar foto de perfil (archivo en el campo "imagen")
    router.put('/users/imagen/:idUser', userController.subirImagenPerfil, userController.actualizarImagenPerfil);

    //Carga de documentos del usuario por ID
    router.post('/users/verificacion/:idUser', userController.subirArchivo, userController.verificacion);

    //Buscar usuarios (buscador de reportes): /users/buscar?buscar=texto
    router.get('/users/buscar', userController.buscarUsuarios);

    //Mostrar info de usuario por id en perfil
    router.get('/useresInfo/:idUser', userController.mostrarUser);

    /*ADMIND*/

    // Muestra las verificaciones pendientes 
    router.get('/admin/mostrarVerificaciones', userController.mostrarVerificaciones);

    // Mostrar todas las verificaciones
    router.get('/admin/mostrarTodasVerificaciones', userController.mostrarTodasVerificaciones);

    // Cambia el status de la verificacion
    router.patch('/admin/verificacionEstatus/:idUser', userController.verificacionAdmin);

    //Mostrar usuarios
    router.get('/admin/usuarios',
    adminController.mostrarUsuarios);

    //Supender Usuario
    router.put('/admin/usuarios/:idUsuario/suspender',
    adminController.suspenderUsuario);

    //Mostrar transacciones
    router.get('/admin/transacciones',
    adminController.mostrarTransacciones);

    return router;
}