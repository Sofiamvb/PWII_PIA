const Users = require('../models/users');

const UsersMiddleware = require('../middlewares/userMiddleware');

const usersMiddleware = new UsersMiddleware();

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

//agregar un nuvo user

exports.nuevoUser = async (req, res, next) => {

    try {

        await usersMiddleware.nuevoUser(req.body);

        res.json({
            mensaje: 'Se agregó un nuevo user'
        });

    } catch (error) {
        if (error.status === 400) {
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

// Login 

exports.login = async (req, res, next) => {

    try {
        console.log(req.body)
        await usersMiddleware.loginUser(req.body);

        res.json({
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

exports.mostrarUser = async (req, res, next) => {

    try {

        const infoUser = await usersMiddleware.mostrarInfoUser(req);
        console.log(infoUser);
        res.json(infoUser);

    } catch (error) {
        if (error.status === 400) {
            return res.status(400).json({
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

//actualizar usuario por ID

exports.actualizarUser = async (req, res, next) => {
    try {

        await usersMiddleware.editarUser(req);

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
//actualizar contraseña por ID

exports.actualizarPassword = async (req, res, next) => {
    try {

        await usersMiddleware.editarPassword(req);

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

        await usersMiddleware.verificacionUser(req);

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

        const usersPendientes = await usersMiddleware.mostrarVerificacionesPendientes();
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

exports.verificacionAdmin = async (req, res, next) => {
    try {

        await usersMiddleware.actualizarVerificacionUser(req);

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