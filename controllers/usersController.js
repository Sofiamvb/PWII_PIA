const Users = require('../models/users');

const { firmarToken } = require('../utils/jwt.js');

const UsersService = require('../services/usersService.js');

const usersService = new UsersService();

const configuracionMulter = require('../utils/configMulter.js');

const multer = require('multer');


//pasar la configuracion y el campo
const upload = multer(configuracionMulter).single('archivo');

//Subir un archivo 
exports.subirArchivo = (req, res, next) => {
    upload(req, res, (error) => {
        if (error) {
            console.log(error)
            return res.status(400).json({
                mensaje: error.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                mensaje: 'Debes seleccionar un archivo'
            });
        }

        next();
    });
}

//Subir la foto de perfil (campo "imagen", solo imágenes)
const uploadImagenPerfil = multer(configuracionMulter).single('imagen');

exports.subirImagenPerfil = (req, res, next) => {
    uploadImagenPerfil(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                mensaje: 'Debes seleccionar una imagen'
            });
        }

        // configMulter también acepta PDF; para la foto de perfil solo imágenes
        if (!req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({
                mensaje: 'La foto de perfil debe ser una imagen'
            });
        }

        next();
    });
}

//Actualizar la foto de perfil del usuario
exports.actualizarImagenPerfil = async (req, res, next) => {
    try {

        const usuario = await usersService.actualizarImagenUser(
            req.params.idUser,
            req.file.filename
        );

        res.json({
            mensaje: 'Foto de perfil actualizada',
            imagen: usuario.imagen
        });

    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                mensaje: error.message
            });
        }

        next(error);
    }
}

//agregar un nuvo user

exports.nuevoUser = async (req, res, next) => {

    try {

        const usuarioCreado = await usersService.nuevoUser(req.body);

        res.json({
            // Al registrarse ya queda con sesion: la pantalla de verificacion que
            // sigue sube un archivo y esa ruta pide token
            token: firmarToken(usuarioCreado),
            id: usuarioCreado._id,
            rol: usuarioCreado.rol,
            mensaje: 'Se agregó un nuevo usuario'
        });

    } catch (error) {
        if (error.status === 400) {
            return res.status(400).json({
                mensaje: error.message
            });
        }
        if (error.status === 500) {
            console.log(error)
            return res.status(500).json({
                mensaje: "Internal server error"
            });
        }

        next(error);
    }
}

// Login 

exports.login = async (req, res, next) => {

    try {
        console.log(req.body)
        const respuestaUsuario = await usersService.loginUser(req.body);
        console.log(respuestaUsuario);

        res.json({
            token: firmarToken(respuestaUsuario),
            id: respuestaUsuario._id,
            nombre: respuestaUsuario.name,
            rol: respuestaUsuario.rol,
            // El front necesita el estado para saber si le ofrece verificarse
            verificacion: respuestaUsuario.verificacion
                ? respuestaUsuario.verificacion.estado
                : 'sin enviar',
            mensaje: 'Login exitoso'
        });

    } catch (error) {
        if (error.status === 401) {
            return res.status(401).json({
                mensaje: error.message
            });
        }
        if (error.status === 500) {
            return res.status(500).json({
                mensaje: "Internal server error"
            });
        }

        next(error);
    }

}


//muestra todos los users

/*exports.mostrarUsers = async (req, res, next) => {

    try {

        const users = await Users.find({});
        res.json(users);

    } catch (error) {
        console.log(error);
        next();
    }
}*/

//mostrar user por ID

//Buscar usuarios por texto: /users/buscar?buscar=texto
exports.buscarUsuarios = async (req, res, next) => {

    try {

        const usuarios = await usersService.buscarUsuarios(req.query.buscar);
        res.json(usuarios);

    } catch (error) {
        if (error.status === 500) {
            return res.status(500).json({
                mensaje: "Internal server error"
            });
        }

        next(error);
    }
}

exports.mostrarUser = async (req, res, next) => {

    try {

        const infoUser = await usersService.mostrarInfoUser(req);
        console.log(infoUser);
        res.json(infoUser);

    } catch (error) {
        if (error.status === 400) {
            return res.status(400).json({
                mensaje: error.message
            });
        }
        if (error.status === 500) {
            console.log(error)
            return res.status(500).json({
                mensaje: "Internal server error"
            });
        }

        next(error);
    }
}

//actualizar usuario por ID

exports.actualizarUser = async (req, res, next) => {
    try {
        console.log(req)
        await usersService.editarUser(req);
       

        res.json({
            mensaje: 'Se actualizo la información'
        });

    } catch (error) {

        console.log(error)
        if (error.status === 400) {
            return res.status(400).json({
                mensaje: error.message
            });
        }
        if (error.status === 500) {
            console.log(error)
            return res.status(500).json({
                mensaje: "Internal server error"
            });
        }

        next(error);
    }
}
//actualizar contraseña por ID

exports.actualizarPassword = async (req, res, next) => {
    try {

        await usersService.editarPassword(req);

        res.json({
            mensaje: 'Se actualizo la información'
        });

    } catch (error) {

        if (error.status === 400) {
            return res.status(400).json({
                mensaje: error.message
            });
        }
        if (error.status === 500) {
            console.log(error)
            return res.status(500).json({
                mensaje: "Internal server error"
            });
        }

        next(error);
    }
}

exports.verificacion = async (req, res, next) => {
    try {

        await usersService.verificacionUser(req);

        res.json({
            mensaje: 'Se ha enviado la información'
        });

    } catch (error) {

        if (error.status === 400) {
            return res.status(400).json({
                mensaje: error.message
            });
        }
        if (error.status === 500) {
            console.log(error)
            return res.status(500).json({
                mensaje: "Internal server error"
            });
        }

        next(error);
    }
}

//SE MUESTRAN LOS USUARIOS CON SU VERIFICACION EN PENDIENTE AL ADM
exports.mostrarVerificaciones = async (req, res, next) => {
    try {

        const usersPendientes = await usersService.mostrarVerificacionesPendientes();
        console.log(usersPendientes);
        res.json(usersPendientes);

    } catch (error) {
        if (error.status === 500) {
            return res.status(500).json({
                mensaje: error.message
            });
        }

        next(error);
    }
}

exports.mostrarTodasVerificaciones = async (req, res, next) => {
    try {

        const usersVerificaciones = await usersService.mostrarVerificaciones();
        console.log(usersVerificaciones);
        res.json(usersVerificaciones);

    } catch (error) {
        if (error.status === 500) {
            return res.status(500).json({
                mensaje: error.message
            });
        }

        next(error);
    }
}


exports.verificacionAdmin = async (req, res, next) => {
    try {

        await usersService.actualizarVerificacionUser(req);

        res.json({
            mensaje: 'Se actualizo la información'
        });

    } catch (error) {

        if (error.status === 400) {
            return res.status(400).json({
                mensaje: error.message
            });
        }
        if (error.status === 500) {
            console.log(error)
            return res.status(500).json({
                mensaje: "Internal server error"
            });
        }

        next(error);
    }
}

//Eliminar un usuario por id 
exports.eliminarUser = async (req, res, next) => {

    try {

        await Users.findOneAndDelete({ _id: req.params.idUser });
        res.json({ mensaje: 'usuario eliminado' });

    } catch (error) {
        console.log(error);
        next();
    }
}