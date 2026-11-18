const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const adminController = require('../controllers/adminController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');


module.exports = function () {

    /* PUBLICAS: son las unicas dos rutas que no piden token,
       porque son justamente las que lo entregan */

    //Agregar nuevos usuarios vía POST
    router.post('/users', userController.nuevoUser);

    // Inicio de sesion
    router.post('/users/login', userController.login);

    /* DE AQUI EN ADELANTE TODO PIDE TOKEN */

    //actualizar un usuario por id
    router.put('/users/:idUser', verificarToken, userController.actualizarUser);

    //actualizar un password por id
    router.put('/users/password/:idUser', verificarToken, userController.actualizarPassword);

    //Actualizar foto de perfil (archivo en el campo "imagen")
    router.put('/users/imagen/:idUser', verificarToken, userController.subirImagenPerfil, userController.actualizarImagenPerfil);

    //Carga de documentos del usuario por ID
    router.post('/users/verificacion/:idUser', verificarToken, userController.subirArchivo, userController.verificacion);

    //Buscar usuarios (buscador de reportes): /users/buscar?buscar=texto
    router.get('/users/buscar', verificarToken, userController.buscarUsuarios);

    //Mostrar info de usuario por id en perfil
    router.get('/useresInfo/:idUser', verificarToken, userController.mostrarUser);

    /*ADMIND*/

    // Muestra las verificaciones pendientes
    router.get('/admin/mostrarVerificaciones', verificarToken, soloAdmin, userController.mostrarVerificaciones);

    // Mostrar todas las verificaciones
    router.get('/admin/mostrarTodasVerificaciones', verificarToken, soloAdmin, userController.mostrarTodasVerificaciones);

    // Cambia el status de la verificacion
    router.patch('/admin/verificacionEstatus/:idUser', verificarToken, soloAdmin, userController.verificacionAdmin);

    //Mostrar usuarios
    router.get('/admin/usuarios',
    verificarToken, soloAdmin,
    adminController.mostrarUsuarios);

    //Supender Usuario
    router.put('/admin/usuarios/:idUsuario/suspender',
    verificarToken, soloAdmin,
    adminController.suspenderUsuario);

    //Mostrar transacciones
    router.get('/admin/transacciones',
    verificarToken, soloAdmin,
    adminController.mostrarTransacciones);

    return router;
}
