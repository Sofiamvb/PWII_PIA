const { json } = require('express');
const productos = require('../models/productos');
const Reportes = require('../models/reportes');
const PuntoEncuentro = require('../models/puntoEncuentro');
const CategoriasMiddleware = require('../middlewares/categoriasMiddleware')

const categoriasMiddleware = new CategoriasMiddleware();


class ProductoMiddleware {



    async traerProductos(data) {
        try {
            const { precio_inicio, precio_final, categoria } = data;

            console.log(precio_inicio, precio_final, categoria)

            const filtro = {
                precio: {
                    // Si el valor de la izquierda no existe, esta como nulo o como undefined tomamos el valor de la derecha como default
                    // Si el valor de la izquierda si existe, se queda como esta.
                    $gte: Number(precio_inicio ?? 0)
                }
            }

            /*
            const precio = {
                $gte: Number(precio_inicio ?? 0)
            }
            */


            if (precio_final != null && precio_final !== '') {
                filtro.precio.$lte = Number(precio_final);
                /*
                const precio = {
                  $gte: Number(precio_inicio ?? 0),
                  $lte = Number(precio_final);
                }
                */
            }

            if (categoria != null && categoria !== '') {
                const categoria_encontrada = await categoriasMiddleware.encontrarCategoria(categoria);
                if (!categoria_encontrada) {
                    return {
                        mensaje: "Categoria no encontrada",
                        data: []
                    }
                }

                filtro.categoria = categoria_encontrada._id
            }


            const producto = await productos.find(filtro);

            return producto;

        } catch (error) {
            console.log(error)
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }
    }

    //MOSTRAR PRODUCTO POR ID
    async mostrarProductoPorId(idProducto) {
        try {
            const producto = await productos
                .findById(idProducto)
                .populate('usuario', 'name apellidoP apellidoM institucion carrera reputacion imagen')
                .populate('categoria', 'nombre_categoria')
                .populate('punto_encuentro', 'lugar zona descripcionZona horario url_ubicacion');

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

            if (error.name === 'CastError') {
                const err = new Error("El ID del producto no es valido");
                err.status = 400;
                throw err;

            }
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }

    }

    //EDITAR PRODUCTO POR ID
    async editarProducto(idProducto, data) {

        try {
            const producto = await productos.findByIdAndUpdate(
                idProducto,
                data,
                {
                    new: true,
                    runValidators: true
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

            if (error.name === 'CastError') {

                const err = new Error("El ID del producto no es valido");
                err.status = 400;
                throw err;

            }

            if (error.name === 'ValidationError') {

                const err = new Error("Los datos del producto no son validos");
                err.status = 400;
                throw err;

            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }
    }
    
    //ELIMINAR PRODUCTO POR ID
    async eliminarProducto(idProducto) {

        try {

            const producto = await productos.findByIdAndDelete(
                idProducto
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

            if (error.name === 'CastError') {
                const err = new Error("El ID del producto no es valido");
                err.status = 400;
                throw err;
            }

            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }

    }


    //PUBLICAR NUEVO PRODUCTO
    async nuevoProducto(data) {

        try {

            if (!data.nombre_produ || data.nombre_produ.trim() === '') {
                const error = new Error("El nombre del producto es obligatorio");
                error.status = 400;
                throw error;
            }


            if (!data.descripcion || data.descripcion.trim() === '') {
                const error = new Error("La descripcion es obligatoria");
                error.status = 400;
                throw error;
            }


            if (!data.precio || Number(data.precio) <= 0) {
                const error = new Error("El precio debe ser mayor a 0");
                error.status = 400;
                throw error;
            }


            if (!data.categoria) {
                const error = new Error("La categoria es obligatoria");
                error.status = 400;
                throw error;
            }


            if (!data.condicion) {
                const error = new Error("La condicion es obligatoria");
                error.status = 400;
                throw error;
            }


            if (!data.punto_encuentro) {
                const error = new Error("El punto de encuentro es obligatorio");
                error.status = 400;
                throw error;
            }


            if (!data.stock || Number(data.stock) <= 0) {
                const error = new Error("El stock debe ser mayor a 0");
                error.status = 400;
                throw error;
            }


            const producto = new productos(data);

            await producto.save();
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

        //MOSTRAR PUBLICACIONES
        async mostrarPublicacionesUsuario(idUsuario, categoria) {

            try {
                let filtro = {
                    usuario: idUsuario
                };

                if (categoria) {
                    filtro.categoria = categoria;
                }

                const publicaciones = await productos.find(filtro)
                    .populate('categoria', 'nombre_categoria')
                    .populate('punto_encuentro', 'lugar zona');

                return publicaciones;

            } catch (error) {

                if (error.name === 'CastError') {
                    const err = new Error("El ID no es valido");
                    err.status = 400;
                    throw err;
                }

                const err = new Error("Error interno del servidor");
                err.status = 500;
                throw err;
            }
        }


        // CREAR REPORTE DE UN PRODUCTO
            async reportarProducto(idProducto, data) {

                try {

                    if (!data.usuario_reporte ||
                        !data.tipo_de_reporte ||
                        !data.motivo ||
                        !data.descripcionReporte) {

                        const error = new Error("No puedes dejar campos vacios");
                        error.status = 400;
                        throw error;
                    }


                    if (data.tipo_de_reporte.trim() === '' ||
                        data.motivo.trim() === '' ||
                        data.descripcionReporte.trim() === '') {

                        const error = new Error("No puedes dejar campos vacios");
                        error.status = 400;
                        throw error;
                    }


                    const producto = await productos.findById(idProducto);

                    if (!producto) {

                        const error = new Error("El producto no existe");
                        error.status = 404;
                        throw error;
                    }


                    const reporte = new Reportes({

                        producto: idProducto,

                        usuario_reporte: data.usuario_reporte,

                        usuario_reportado: producto.usuario,

                        tipo_de_reporte: data.tipo_de_reporte,

                        motivo: data.motivo,

                        descripcionReporte: data.descripcionReporte,

                        estadoReporte: 'pendiente'

                    });


                    await reporte.save();

                    return reporte;


                } catch (error) {

                    console.log("ERROR AL CREAR REPORTE:", error);


                    if (error.status) {
                        throw error;
                    }


                    if (error.name === 'CastError') {

                        const err = new Error("El ID no es valido");
                        err.status = 400;
                        throw err;

                    }


                    if (error.name === 'ValidationError') {

                        const err = new Error("Los datos del reporte no son validos");
                        err.status = 400;
                        throw err;

                    }


                    const err = new Error("Error interno del servidor");
                    err.status = 500;
                    throw err;

                }

            }

            // MOSTRAR REPORTES DEL USUARIO
            async mostrarMisReportes(idUsuario) {

                try {

                    const reportes = await Reportes.find({
                        usuario_reporte: idUsuario
                    })
                    .populate(
                        'producto',
                        'nombre_produ imagenes descripcion precio'
                    )
                    .populate(
                        'usuario_reportado',
                        'name apellidoP usuario'
                    );

                    return reportes;

                } catch (error) {

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
        
        
        //MOSTAR PUNTOS DE ENCUENTRO
        async mostrarPuntosEncuentro() {

            try {

                const puntos = await PuntoEncuentro.find({
                    estado: true
                });
                return puntos;

            } catch (error) {

                const err = new Error("Error interno del servidor");
                err.status = 500;
                throw err;

            }

        }


        //SELECCIONAR PUNTO DE ENCUENTRO
        async elegirPuntoEncuentro(idProducto, idPunto) {

            try {

                const punto = await PuntoEncuentro.findById(idPunto);

                if (!punto) {

                    const error = new Error("El punto de encuentro no existe");
                    error.status = 404;
                    throw error;

                }


                if (punto.estado === false) {

                    const error = new Error("El punto de encuentro no esta disponible");
                    error.status = 400;
                    throw error;

                }


                const producto = await productos.findByIdAndUpdate(
                    idProducto,
                    {
                        punto_encuentro: idPunto
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

                if (error.name === 'CastError') {

                    const err = new Error("El ID no es valido");
                    err.status = 400;
                    throw err;
                }

                const err = new Error("Error interno del servidor");
                err.status = 500;
                throw err;
            }
        }

}

module.exports = ProductoMiddleware;

/*
                const nueva_categoria = new categorias({
                    nombre_categoria: "ciencias"
                })
                await nueva_categoria.save()
*/