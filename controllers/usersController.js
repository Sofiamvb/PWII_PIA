const Users = require('../models/users');

const UsersMiddleware = require('../middlewares/userMiddleware');

const usersMiddleware = new UsersMiddleware();

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

exports.mostrarUsers = async (req, res, next) => {

    try {

        const users = await Users.find({});
        res.json(users);

    } catch (error) {
        console.log(error);
        next();
    }
}

//mostrar user por ID

/*exports.mostrarUser = async (req, res, next) => {

    try {

        const user = await Users.findById(req.params.idUser);

        if (!user) {

            res.json({ mensaje: 'El usuario que busca no existe' });
            next();
        }

        //mostrar cliente
        res.json(user);

    } catch (error) {
        console.log(error);
        next();
    }
}*/

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