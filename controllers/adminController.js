const adminMiddleware = require('../middlewares/adminMiddleware');

//USUARIOS

exports.mostrarUsuarios = async (req, res, next) => {

    try {


        const usuarios = await adminMiddleware.mostrarUsuarios();

        res.json(usuarios);

    } catch (error) {

        if (error.status) {

            return res.status(error.status).json({
                mensaje: error.message
            });

        }

        next(error);

    }

}


exports.suspenderUsuario = async (req, res, next) => {

    try {


        const usuario = await adminMiddleware.suspenderUsuario(
            req.params.idUsuario
        );

        res.json({
            mensaje: 'Usuario suspendido',
            usuario: usuario
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


//CATEGORIAS

exports.mostrarCategorias = async (req, res, next) => {

    try {


        const categorias = await adminMiddleware.mostrarCategorias(
            req.query.buscar
        );

        res.json(categorias);

    } catch (error) {

        if (error.status) {

            return res.status(error.status).json({
                mensaje: error.message
            });

        }

        next(error);

    }

}


exports.nuevaCategoria = async (req, res, next) => {

    try {

        const categoria = await adminMiddleware.nuevaCategoria(
            req.body
        );

        res.json({
            mensaje: 'Categoria agregada',
            categoria: categoria
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

exports.editarCategoria = async (req, res, next) => {

    try {


        const categoria = await adminMiddleware.editarCategoria(
            req.params.idCategoria,
            req.body
        );

        res.json({
            mensaje: 'Categoria actualizada',
            categoria: categoria
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


exports.eliminarCategoria = async (req, res, next) => {

    try {


        await adminMiddleware.eliminarCategoria(
            req.params.idCategoria
        );

        res.json({
            mensaje: 'Categoria eliminada'
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

//PRODUCTOS

exports.mostrarProductos = async (req, res, next) => {

    try {


        const productos = await adminMiddleware.mostrarProductos();

        res.json(productos);

    } catch (error) {

        if (error.status) {
            return res.status(error.status).json({
                mensaje: error.message
            });
        }

        next(error);

    }

}


exports.aprobarProducto = async (req, res, next) => {

    try {


        const producto = await adminMiddleware.aprobarProducto(
            req.params.idProducto
        );

        res.json({
            mensaje: 'Producto aprobado',
            producto: producto
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


exports.rechazarProducto = async (req, res, next) => {

    try {


        const producto = await adminMiddleware.rechazarProducto(
            req.params.idProducto
        );

        res.json({
            mensaje: 'Producto rechazado',
            producto: producto
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


exports.cambiarDisponibilidad = async (req, res, next) => {

    try {


        const producto = await adminMiddleware.cambiarDisponibilidad(
            req.params.idProducto,
            req.body.disponibilidad
        );

        res.json({
            mensaje: 'Disponibilidad actualizada',
            producto: producto
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

//PUNTOS DE COMPRA

exports.mostrarPuntos = async (req, res, next) => {

    try {


        const puntos = await adminMiddleware.mostrarPuntos();

        res.json(puntos);

    } catch (error) {

        if (error.status) {
            return res.status(error.status).json({
                mensaje: error.message
            });
        }

        next(error);

    }

}


exports.nuevoPunto = async (req, res, next) => {

    try {


        const punto = await adminMiddleware.nuevoPunto(req.body);

        res.json({
            mensaje: 'Punto creado correctamente',
            punto: punto
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


exports.desactivarPunto = async (req, res, next) => {

    try {


        const punto = await adminMiddleware.desactivarPunto(
            req.params.idPunto
        );

        res.json({
            mensaje: 'Punto desactivado',
            punto: punto
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


exports.eliminarPunto = async (req, res, next) => {

    try {


        await adminMiddleware.eliminarPunto(
            req.params.idPunto
        );

        res.json({
            mensaje: 'Punto eliminado'
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

//TRANSACCIONES

exports.mostrarTransacciones = async (req, res, next) => {

    try {


        const pedidos = await adminMiddleware.mostrarTransacciones();

        res.json(pedidos);

    } catch (error) {

        if (error.status) {
            return res.status(error.status).json({
                mensaje: error.message
            });
        }

        next(error);

    }

}

//REPORTES

exports.mostrarReportes = async (req, res, next) => {

    try {


        const reportes = await adminMiddleware.mostrarReportes();

        res.json(reportes);

    } catch (error) {

        if (error.status) {
            return res.status(error.status).json({
                mensaje: error.message
            });
        }

        next(error);

    }

}


exports.mostrarReporte = async (req, res, next) => {

    try {


        const reporte = await adminMiddleware.mostrarReporte(
            req.params.idReporte
        );

        res.json(reporte);

    } catch (error) {

        if (error.status) {
            return res.status(error.status).json({
                mensaje: error.message
            });
        }

        next(error);

    }

}


exports.rechazarReporte = async (req, res, next) => {

    try {


        const reporte = await adminMiddleware.rechazarReporte(
            req.params.idReporte
        );

        res.json({
            mensaje: 'Reporte rechazado',
            reporte: reporte
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


exports.eliminarReporte = async (req, res, next) => {

    try {


        await adminMiddleware.eliminarReporte(
            req.params.idReporte
        );

        res.json({
            mensaje: 'Reporte eliminado'
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

