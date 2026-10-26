
const { json } = require('express');
const Users = require('../models/users');

class UsersMiddleware {
    validacionGeneral(data, validaciones) {
        const { name, apellidoP, apellidoM, usuario, email, institucion, carrera } = data;


        if (!name) {
            validaciones.push('El nombre es obligatorio');
        }

        if (!apellidoP) {
            validaciones.push('El apellido paterno es obligatorio');
        }

        if (!apellidoM) {
            validaciones.push('El apellido materno es obligatorio');
        }

        if (!usuario) {
            validaciones.push('El nombre de usuario es obligatorio');
        }

        if (!email) {
            validaciones.push('El correo es obligatorio');
        }

        if (!institucion) {
            validaciones.push('El nombre de la institución es obligatorio');
        }

        if (!carrera) {
            validaciones.push('El nombre de la carrera es obligatorio');
        }
        return validaciones;
    }

    validarPassword(data, validaciones) {
        const { password, passwordRepetida } = data;

        if (!password) {
            validaciones.push('La contraseña es obligatoria');
        } else if (password.length < 6) {
            validaciones.push('La contraseña tiene que tener por lo menos 6 caracteres');
        }

        if (password !== passwordRepetida) {
            validaciones.push('Las contraseñas no coinciden');
        }
        return validaciones;

    }

    validarRegistro(data) {
        const validaciones = []

        this.validacionGeneral(data, validaciones);
        this.validarPassword(data, validaciones);

        if (validaciones.length > 0) {
            return validaciones.join(', ');
        }

        return null;
    }

    async nuevoUser(data) {
        const error = this.validarRegistro(data);

        if (error) {
            const err = new Error(error);
            err.status = 400;
            throw err;
        }
        try {
            const users = new Users(data);
            await users.save();

            return users;
        } catch (error) {
            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }

    }


    async loginUser(data) {
        try {
            const { email, password } = data;

            const usuario = await Users.findOne({ email: email, password: password });

            if (!usuario) {
                const error = new Error("Credenciales incorrectas");
                error.status = 401;
                throw error;
            }

            return usuario;

        } catch (error) {
            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }
    }

    async editarUser(data) {
        const validaciones = [];
        this.validacionGeneral(data.body, validaciones);

        if (validaciones.length > 0) {
            const err = new Error(validaciones.join(', '));
            err.status = 400;
            throw err;
        }
        const data_actualizada = {
            "name": data.body.name,
            "apellidoP": data.body.apellidoP,
            "apellidoM": data.body.apellidoM,
            "usuario": data.body.usuario,
            "email": data.body.email,
            "institucion": data.body.institucion,
            "carrera": data.body.carrera

        }
        try {
            const user_actualizado = await Users.findOneAndUpdate({ _id: data.params.idUser },
                data_actualizada, {
                returnDocument: true
            });
            return user_actualizado;

        } catch (error) {

            if (error.status) {
                throw error;
            }
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }
    }

    async editarPassword(data) {
        const validaciones = [];

        this.validarPassword(data.body, validaciones);

        if (validaciones.length > 0) {
            const err = new Error(validaciones.join(', '));
            err.status = 400;
            throw err;
        }

        const data_actualizada = {
            "password": data.body.password
        }

        try {
            const password_actualizada = await Users.findOneAndUpdate({ _id: data.params.idUser },
                data_actualizada, {
                returnDocument: true
            });
            return password_actualizada;

        } catch (error) {

            if (error.status) {
                throw error;
            }
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }
    }

    /*async verificacionUser(data) {

        const multer = require('multer');
        const shortid = require('shortid');

        const configuracionMulter = {
            storage: fileStorage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, __dirname + '../../uploads/');
                },
                filename: (req, file, cb) => {
                    // Genera un nombre único usando shortid y le concatena la extensión original
                    const extension = file.mimetype.split('/')[1];
                    cb(null, `${shortid.generate()}.${extension}`);
                }
            }),
            fileFilter(req, file, cb) {
                if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                    cb(null, true);
                } else {
                    cb(new Error('Formato no valido'));
                }
            },


        }
        //pasar la configuracion y el campo
        const upload = multer(configuracionMulter).single('imagen');
    }*/

}

module.exports = UsersMiddleware;
