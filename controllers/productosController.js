const productos = require('../models/productos');
const Pedidos = require('../models/pedidos');
const ProductoMiddleware = require('../middlewares/productoMiddleware');

const productoMiddleware = new ProductoMiddleware();

const multer = require('multer');
const configuracionMulter = require('../utils/configMulter');

//pasar la configuracion y el campo
//const upload = multer(configuracionMulter).single('archivo');
const upload = multer(configuracionMulter).array('imagenes', 5);

//Subir un archivo 
exports.subirArchivo = (req, res, next) => {

    upload(req, res, (error) => {

        if (error) {

            return res.status(400).json({
                mensaje: error.message
            });

            //PONER MENSAJE DE ERROR SI EL ARCHIVO SE PASA DE 5 FOTOS
        }


        console.log(req.files);


        if (!req.files || req.files.length === 0) {

            return res.status(400).json({
                mensaje: 'Debes seleccionar al menos un archivo'
            });

        }


        next();

    });

}
//nuevos productos
// NUEVO PRODUCTO
exports.nuevoProducto = async (req, res, next) => {

    try {

        const datos = req.body;

        if (req.files && req.files.length > 0) {

            datos.imagenes = [];

            req.files.forEach((imagen, index) => {

                datos.imagenes.push({
                    url: imagen.filename,
                    imgPrincipal: index === 0
                });

            });

        }

        datos.status_aprobado = null;
        datos.disponibilidad = true;

        const producto = await productoMiddleware.nuevoProducto(datos);

        return res.json({
            mensaje: 'Se ha agregado un nuevo producto',
            producto: producto
        });

    } catch (error) {
        console.log(error);
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

//Mostrar productos 
exports.mostrarProductos = async (req, res, next) => {
    try {
        console.log(req.query)
        const Productos = await productoMiddleware.traerProductos(req.query);
        console.log(Productos);
        res.json(Productos);

    } catch (error) {
        if (error.status === 500) {
            return res.status(500).json({
                mensaje: error.message
            });
        }

        next(error);
    }
}

//mostrar producto por ID
exports.mostrarProducto = async (req, res, next) => {

    const Producto = await productos.findById(req.params.idProducto);

    if (!Producto) {
        res.json({ mensaje: 'El producto no existe' });
        return next();
    }

    //Mostrar el producto
    res.json(Producto);
}

//Actualizar Producto por ID 
exports.actualizarProducto = async (req, res, next) => {
    try {

        //construir nuevo producto
        let nuevoProducto = req.body;

        //Verificar si hay una imagen nueva
        if (req.file) {
            nuevoProducto.imagen = req.file.filename;
        } else {
            let ProductoAnterior = await productos.findById(req.params.idProducto);
            nuevoProducto.imagen = ProductoAnterior.imagen;
        }

        //Actualizar producto
        let Producto = await productos.findByIdAndUpdate({ _id: req.params.idProducto },
            nuevoProducto, {
            new: true,
        });

        res.json(Producto);

    } catch (error) {
        console.log(error);
        next();
    }
}

//Eliminar un producto por ID
exports.eliminarProducto = async (req, res, next) => {
    try {
        await productos.findByIdAndDelete({ _id: req.params.idProducto });
        res.json({ mensaje: 'Producto Eliminado' });
    } catch (error) {
        console.log(error);
        next();
    }
}

//Eliminar un producto por ID
    exports.eliminarProducto = async (req, res, next) => {
        try {
            await productos.findByIdAndDelete({ _id: req.params.idProducto });
            res.json({ mensaje: 'Producto Eliminado' });
        } catch (error) {
            console.log(error);
            next();
        }
    }

    //MOSTRAR PRODUCTO POR ID
    exports.mostrarProducto = async (req, res, next) => {

        try {

            const producto = await productoMiddleware.mostrarProductoPorId(
                req.params.idProducto
            );
            res.json(producto);

        } catch (error) {

            if (error.status) {
                return res.status(error.status).json({
                    mensaje: error.message
                });
            }
            next(error);
        }
    }

    //EDITAR PRODUCTO POR ID
        exports.actualizarProducto = async (req, res, next) => {

        try {
            const datos = req.body;
            if (req.files && req.files.length > 0) {
                datos.imagenes = [];
                req.files.forEach((imagen, index) => {
                    datos.imagenes.push({
                        url: imagen.filename,
                        imgPrincipal: index === 0
                    });
                });
            }

            const producto = await productoMiddleware.editarProducto(
                req.params.idProducto,
                datos
            );

            res.json({
                mensaje: 'Producto actualizado',
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

    //ELIMINAR EN EDITAR PRODUCTO
    exports.eliminarProducto = async (req, res, next) => {

        try {

            const producto = await productoMiddleware.eliminarProducto(
                req.params.idProducto
            );

            res.json({
                mensaje: 'Producto eliminado',
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

    
    //PUBLICAR PRODUCTO
    exports.nuevoProducto = async (req, res, next) => {
        try {

            const datos = req.body;


            datos.status_aprobado = null;
            datos.disponibilidad = true;


            if (req.files && req.files.length > 0) {
                datos.imagenes = [];

                req.files.forEach((imagen, index) => {

                    datos.imagenes.push({
                        url: imagen.filename,
                        imgPrincipal: index === 0
                    });
                });
            }

            const producto =
                await productoMiddleware.nuevoProducto(datos);
            res.json({
                mensaje: 'Publicacion enviada a revision', producto: producto });

        } catch (error) {

            if (error.status) {
                return res.status(error.status).json({
                    mensaje: error.message
                });
            }
            next(error);
        }
    }

    //MIS PUBLICACIONES
    exports.misPublicaciones = async (req, res, next) => {

        try {

            const publicaciones =
                await productoMiddleware.mostrarPublicacionesUsuario(
                    req.params.idUsuario,
                    req.query.categoria
                );

            res.json({
                mensaje: 'Estas son tus publicaciones',
                publicaciones: publicaciones
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

    //CREAR REPORTES
    exports.nuevoReporte = async (req, res, next) => {

    try {

        await usersMiddleware.reportarProducto(req.body, req.params.idProducto);

        res.json({
            mensaje: 'Se agregó un nuevo reporte'
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
        //CREAR REPORTES
            exports.reportarProducto = async (req, res, next) => {

            try {

                const reporte = await productoMiddleware.reportarProducto(
                    req.params.idProducto,
                    req.body
                );

                res.json({
                    mensaje: 'Reporte enviado correctamente',
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

            //MOSTRAR REPORTES
            exports.misReportes = async (req, res, next) => {

            try {

                const reportes = await productoMiddleware.mostrarMisReportes(
                    req.params.idUsuario
                );

                res.json({
                    mensaje: 'Estos son tus reportes',
                    reportes: reportes
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
    

        //MOSTRAR PUNTOS DE ENCUENTRO
        exports.mostrarPuntosEncuentro = async (req, res, next) => {

            try {

                const puntos =
                    await productoMiddleware.mostrarPuntosEncuentro();

                res.json({
                    mensaje: 'Estos son los puntos de encuentro disponibles',
                    puntos: puntos
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


        //SELECCIONAR PUNTO DE ENCUENTRO
        exports.elegirPuntoEncuentro = async (req, res, next) => {

            try {

                await productoMiddleware.elegirPuntoEncuentro(  
                    req.params.idProducto,
                    req.params.idPunto
                );

                res.json({
                    mensaje: 'Punto de encuentro actualizado correctamente'
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

            //DATOS DE COMPRA
            exports.mostrarPedido = async (req, res, next) => {

            try {

                const pedido = await Pedidos.findById(
                    req.params.idPedido
                )

                .populate({path: 'producto', select: 'nombre_produ precio imagenes condicion punto_encuentro',
                    populate: {path: 'punto_encuentro', select: 'lugar zona horario'
                    }
                })

                .populate('vendedor', 'name apellidoP apellidoM institucion carrera reputacion imagen')
                .populate('comprador', 'name apellidoP apellidoM');

                if (!pedido) {

                    return res.status(404).json({
                        mensaje: 'El pedido no existe'
                    });

                }


                res.json({
                    mensaje: 'Estos son los datos de la compra',
                    pedido: pedido
                });


            } catch (error) {

                if (error.name === 'CastError') {

                    return res.status(400).json({
                        mensaje: 'El ID del pedido no es valido'
                    });

                }

                console.log(error);
                next(error);
            }
        }


        //CANCELAR PEDIDO
        exports.cancelarPedido = async (req, res, next) => {

            try {
                const pedido = await Pedidos.findById(
                    req.params.idPedido
                );

                if (!pedido) {
                    return res.status(404).json({
                        mensaje: 'El pedido no existe'
                    });

                }


                if (pedido.estado_entrega === 'Cancelado') {
                    return res.status(400).json({
                        mensaje: 'La compra ya esta cancelada'
                    });
                }


                if (pedido.estado_entrega === 'Entregado') {
                    return res.status(400).json({
                        mensaje: 'No puedes cancelar una compra ya entregada'
                    });
                }


                pedido.estado_entrega = 'Cancelado';
                pedido.estado = false;
                pedido.estado_pago = 'Reembolsado';

                await pedido.save();

                res.json({
                    mensaje: 'Compra cancelada correctamente'
                });

            } catch (error) {

                if (error.name === 'CastError') {

                    return res.status(400).json({
                        mensaje: 'El ID del pedido no es valido'
                    });

                }

                console.log(error);
                next(error);
            }
        }

        exports.comprarProducto = async (req, res, next) => {

    try {

        const pedido =
            await productoMiddleware.comprarProducto(

                req.params.idProducto,

                req.params.idComprador,

                req.body.cantidad

            );


        return res.json({

            mensaje:
                'Compra realizada correctamente',

            pedido: pedido

        });


    } catch (error) {


        if (error.status) {

            return res.status(error.status).json({

                mensaje: error.message

            });

        }


        return next(error);

    }

}