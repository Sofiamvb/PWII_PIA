
const { json } = require('express');
const Users = require('../models/users');
const fs = require('fs');
const path = require('path');

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
            console.log(error)
            if (error.status) {
                throw error;
            }
            console.log(error)

            const err = new Error(error);
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

        try {

            const usuarioPassword = await Users.findOne({
                _id: data.params.idUser,
                password: data.body.passwordActual
            });

            if (!usuarioPassword) {
                const error = new Error("Credenciales incorrectas");
                error.status = 401;
                throw error;
            }

        } catch (error) {
            console.log(error)
            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }

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

    async verificacionUser(data) {

        const { documento } = data.body;
        console.log(documento)
        if (!documento) {
            const err = new Error('Seleccione un tipo de documento');
            err.status = 400;
            throw err;
        }

        console.log(data.file.filename)

        const data_actualizada = {
            "verificacion": {
                estado: 'pendiente',
                tipoDocumento: documento.trim().toLowerCase(),
                documentoUrl: data.file.filename,
                fechaEnvio: new Date()
            }

        }

        try {
            if (documento.trim().toLowerCase() === "credencial" ||
                documento.trim().toLowerCase() === "constancia" ||
                documento.trim().toLowerCase() === "otro") {

                console.log('Entró al if de tipos de documento');

                const verificacion_actualizada = await Users.findOneAndUpdate({ _id: data.params.idUser },
                    data_actualizada, {
                    returnDocument: 'after'
                });

                console.log(verificacion_actualizada)


                if (!verificacion_actualizada) {
                    console.log(verificacion_actualizada)
                    const err = new Error('No se encontró el usuario o no se pudo actualizar');
                    err.status = 404;
                    throw err;
                }
                return verificacion_actualizada;

            }

        } catch (error) {
            if (error.status) {
                throw error;
            }
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }


    }

    //FUNCION DE MIDDLEWARE DE ADMIN PARA MOSTRAR USUARIOS CON EL ESTADO DE LA DOCUMENTACION PENDIENTE
    async mostrarVerificacionesPendientes() {

        try {

            const users_encontrados = await Users.find({ "verificacion.estado": "pendiente" })
            console.log(users_encontrados)
            if (!users_encontrados) {
                return null;
            }
            return users_encontrados;



        } catch (error) {
            console.log(error);
            next();
        }

    }

    //Mostrar todas las verificaciones
    async mostrarVerificaciones() {

        try {

            const usersVerificados = await Users.find()
            console.log(usersVerificados)
            if (!usersVerificados) {
                return null;
            }
            return usersVerificados;



        } catch (error) {
            console.log(error);
            next();
        }

    }

    //FUNCION PARA ACTUUALIZAR EL ESTADO DE LA VERIFICACION DE DOCUMENTACION, DE PENDIENTE A APROBADO O RECHAZADO
    async actualizarVerificacionUser(data) {

        const { estado } = data.body;


        try {

            const user = await Users.findById(data.params.idUser);

            if (!user) {

                const err = new Error('El usuario que busca no existe');
                err.status = 400;
                throw err;
            }

            if (user.verificacion.estado === 'sin enviar' || user.verificacion.estado === 'rechazado') {

                const err = new Error('Se debe completar la verificacion');
                err.status = 400;
                throw err;

            }

        } catch (error) {
            if (error.status) {
                throw error;
            }
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }

        console.log('Antes de actualizar')


        try {
            const verificacion_actualizada = await Users.findOneAndUpdate({ _id: data.params.idUser },
                {
                    $set: {
                        'verificacion.estado': estado
                    }
                }, {
                returnDocument: true
            });
            return verificacion_actualizada;

        } catch (error) {

            if (error.status) {
                throw error;
            }
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }


    }

    //Mostrar info de los usuarios por id
    async mostrarInfoUser(data) {

        try {
            const user = await Users.findById(data.params.idUser);

            if (!user) {
                const err = new Error('El usuario que busca no existe');
                err.status = 400;
                throw err;
            }

            return user;
        } catch (error) {
            if (error.status) {
                throw error;
            }
            console.log(error)
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }

    }

    //Actualizar la foto de perfil (guarda el nombre del archivo nuevo y borra el anterior)
    async actualizarImagenUser(idUser, nombreArchivo) {

        try {

            const usuario = await Users.findById(idUser);

            if (!usuario) {
                const err = new Error('El usuario no existe');
                err.status = 404;
                throw err;
            }

            const imagenAnterior = usuario.imagen;

            usuario.imagen = nombreArchivo;
            await usuario.save();

            // Borrar del disco la foto anterior para que no se acumulen archivos
            if (imagenAnterior) {
                const rutaAnterior = path.join(__dirname, '../uploads/', imagenAnterior);

                fs.unlink(rutaAnterior, (error) => {
                    if (error) {
                        console.log('No se pudo borrar la imagen anterior:', error.message);
                    }
                });
            }

            return usuario;

        } catch (error) {

            if (error.status) {
                throw error;
            }

            if (error.name === 'CastError') {
                const err = new Error("El ID del usuario no es valido");
                err.status = 400;
                throw err;
            }

            console.log(error);
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }

    }

    //Buscar usuarios por usuario, nombre o apellido (para el buscador de reportes)
    async buscarUsuarios(buscar) {

        // Si no escribieron nada, no regresamos a nadie
        if (!buscar || buscar.trim() === '') {
            return [];
        }

        // Escapar caracteres especiales para que un "(" o "*" no rompa el regex
        const texto = buscar.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        try {

            const usuarios = await Users.find({
                $or: [
                    { usuario: { $regex: texto, $options: 'i' } },
                    { name: { $regex: texto, $options: 'i' } },
                    { apellidoP: { $regex: texto, $options: 'i' } }
                ]
            })
                .select('_id name apellidoP usuario')   // solo datos públicos
                .limit(10);

            return usuarios;

        } catch (error) {
            console.log(error)
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }

    }


}

module.exports = UsersMiddleware;
