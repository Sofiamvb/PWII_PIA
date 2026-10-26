
const { json } = require('express');
const Users = require('../models/users');
const Categorias = require('../models/categorias');
const Productos = require('../models/productos');
const PuntoEncuentro = require('../models/puntoEncuentro');
const Pedidos = require('../models/pedidos');
const Reportes = require('../models/reportes');

class AdminMiddleware {
    
    //USUARIOS

    async mostrarUsuarios() {

          try {

        const usuarios = await Users.find({})
            .select('-password');

        return usuarios;

        } catch (error) {

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }

    async suspenderUsuario(idUsuario) {

    try {

        const usuario = await Users.findById(idUsuario);

        if (!usuario) {

            const error = new Error("El usuario no existe");
            error.status = 404;
            throw error;

        }

        if (usuario.status === 'suspendido') {

            const error = new Error("El usuario ya esta suspendido");
            error.status = 400;
            throw error;

        }

        usuario.status = 'suspendido';

        await usuario.save();

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

        const err = new Error("Error interno del servidor");
        err.status = 500;
        throw err;

    }

}

    //CATEGORIAS

    async mostrarCategorias(buscar) {
         try {

        let filtro = {};

        if (buscar) {

            filtro.nombre_categoria = {
                $regex: buscar,
                $options: 'i'
            };

        }

        const categorias = await Categorias.find(filtro);

        return categorias;

        } catch (error) {

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }

    async nuevaCategoria(data) {

    try {

        if (!data.nombre_categoria || data.nombre_categoria.trim() === '') {

            const error = new Error(
                "El nombre de la categoria es obligatorio"
            );

            error.status = 400;
            throw error;

        }

        const categoria = new Categorias(data);

        await categoria.save();

        return categoria;

        } catch (error) {

            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

}


async editarCategoria(idCategoria, data) {

    try {

        const categoria = await Categorias.findByIdAndUpdate(
            idCategoria,
            data,
            {
                new: true
            }
        );

        if (!categoria) {

            const error = new Error("La categoria no existe");
            error.status = 404;
            throw error;

        }

        return categoria;

    } catch (error) {

        if (error.status) {
            throw error;
        }

        const err = new Error("Error interno del servidor");
        err.status = 500;
        throw err;

    }

}


async eliminarCategoria(idCategoria) {

    try {

        const categoria = await Categorias.findByIdAndDelete(
            idCategoria
        );

        if (!categoria) {

            const error = new Error("La categoria no existe");
            error.status = 404;
            throw error;

        }

        return categoria;

        } catch (error) {

            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }

    //PRODCUTOS

    async mostrarProductos() {
        try {
            const productos = await Productos.find({}).populate('usuario', 'name apellidoP');
            return productos;
        } catch (error) {
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }
    }

     async aprobarProducto(idProducto) {

        try {

            const producto = await Productos.findByIdAndUpdate(
                idProducto,
                {
                    status_aprobado: true
                },
                {
                    new: true
                }
            );

            if (!producto) {

                const error = new Error("El producto no existe");
                error.status = 404;
                throw error;

            }

            return producto;

        } catch (error) {

            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }

    async rechazarProducto(idProducto) {
        try {

        const producto = await Productos.findByIdAndUpdate(
            idProducto,
            {
                status_aprobado: false
            },
            {
                new: true
            }
        );

        if (!producto) {

            const error = new Error("El producto no existe");
            error.status = 404;
            throw error;

        }

        return producto;

        } catch (error) {

            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }
    }

    

     async cambiarDisponibilidad(idProducto, disponibilidad) {

        try {

            const producto = await Productos.findByIdAndUpdate(
                idProducto,
                {
                    disponibilidad: disponibilidad
                },
                {
                    new: true
                }
            );

            if (!producto) {

                const error = new Error("El producto no existe");
                error.status = 404;
                throw error;

            }

            return producto;

        } catch (error) {

            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }

    //PUNTO DE ENCUENTRO

    async nuevoPunto(data) {

        try {

            const punto = new PuntoEncuentro(data);

            punto.estado = true;

            await punto.save();

            return punto;

        } catch (error) {

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }
    
    async mostrarPuntos(){
         try {

            const puntos = await PuntoEncuentro.find({});

            return puntos;

        } catch (error) {

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }
    
      async desactivarPunto(idPunto) {

        try {

            const punto = await PuntoEncuentro.findByIdAndUpdate(
                idPunto,
                {
                    estado: false
                },
                {
                    new: true
                }
            );

            if (!punto) {

                const error = new Error("El punto no existe");
                error.status = 404;
                throw error;

            }

            return punto;

        } catch (error) {

            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }


    async eliminarPunto(idPunto) {

        try {

            const punto = await PuntoEncuentro.findByIdAndDelete(idPunto);

            if (!punto) {

                const error = new Error("El punto no existe");
                error.status = 404;
                throw error;

            }

            return punto;

        } catch (error) {

            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }


    //TRANSACCIONES

    async mostrarTransacciones() { 

         try {

            const pedidos = await Pedidos.find({})
                .populate('comprador', 'name apellidoP')
                .populate('vendedor', 'name apellidoP')
                .populate('producto', 'nombre_produ');

            return pedidos;

        } catch (error) {

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }

    //REPORTES

    async mostrarReportes() {
        try {

            const reportes = await Reportes.find({});

            return reportes;

        } catch (error) {

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }
    }

     async mostrarReporte(idReporte) {

        try {

            const reporte = await Reportes.findById(idReporte);

            if (!reporte) {

                const error = new Error("El reporte no existe");
                error.status = 404;
                throw error;

            }

            return reporte;

        } catch (error) {

            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }


    async rechazarReporte(idReporte) {

        try {

            const reporte = await Reportes.findByIdAndUpdate(
                idReporte,
                {
                    estadoReporte: 'cerrado'
                },
                {
                    new: true
                }
            );

            if (!reporte) {

                const error = new Error("El reporte no existe");
                error.status = 404;
                throw error;

            }

            return reporte;

        } catch (error) {

            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }


    async eliminarReporte(idReporte) {

        try {

            const reporte = await Reportes.findByIdAndDelete(idReporte);

            if (!reporte) {

                const error = new Error("El reporte no existe");
                error.status = 404;
                throw error;

            }

            return reporte;

        } catch (error) {

            if (error.status) {
                throw error;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;

        }

    }
    
}


 
module.exports = new AdminMiddleware();