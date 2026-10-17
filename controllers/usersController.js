const Users = require('../models/users');

//agregar un nuvo user

exports.nuevoUser = async (req, res, next) => {

    const users = new Users(req.body);

    try {
        //almacenar el registro
        await users.save();
        res.json({ mensaje: 'se agrego un nuevo user' });
    } catch (error) {
        //si hay un error console.log y next
        console.log(error);
        next();

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

exports.mostrarUser = async (req, res, next) => {

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
}

//actualizar usuario por ID

exports.actualizarUser = async (req, res, next) => {
    try {

        const user = await Users.findOneAndUpdate({ _id: req.params.idUser },
            req.body, {
            new: true
        });

        res.json(user);

    } catch (error) {

        console.log(error);
        next();

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