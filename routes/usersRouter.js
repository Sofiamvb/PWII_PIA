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