const { json } = require('express');
const productos = require('../models/productos');
const Pedidos = require('../models/pedidos');
const ProductoMiddleware = require('./productoMiddleware');
const productoMiddleware = new ProductoMiddleware();


class PedidoMiddleware {

async comprarProducto(idProducto, idComprador, cantidad, data) {

            try {

                cantidad = Number(cantidad);

                console.log('Stock:',cantidad)

                // Validar cantidad
                if (!cantidad || cantidad <=  0) {

                    const error = new Error("La cantidad debe ser mayor a 0");
                    error.status = 400;
                    throw error;

                }

                // Buscar producto
                const producto = await productos.findById(idProducto)
                    .populate('categoria', 'nombre_categoria');

                if (!producto) {

                    const error = new Error("El producto no existe");
                    error.status = 404;
                    throw error;

                }

                // Validar que el producto tenga vendedor
                if (!producto.usuario) {

                    const error = new Error("El producto no tiene un vendedor asociado");
                    error.status = 400;
                    throw error;
                }

                // No permitir comprar tu propio producto
                if (producto.usuario.toString() === idComprador) {

                    const error = new Error("No puedes comprar tu propio producto");
                    error.status = 400;
                    throw error;

                }

                // Revisar disponibilidad
                if (producto.disponibilidad === false) {

                    const error = new Error("El producto no esta disponible");
                    error.status = 400;
                    throw error;
                }

                // Revisar stock
                if (cantidad > producto.stock) {

                    const error = new Error("No hay suficiente stock");
                    error.status = 400;
                    throw error;
                }

                // Calcular totales
                const totalSinComision =
                    producto.precio * cantidad;

                const comision =
                    totalSinComision * 0.10;

                const totalConComision =
                    totalSinComision - comision;

                // Obtener imagen
                let imagenProducto = '';

                if (producto.imagenes &&
                    producto.imagenes.length > 0) {

                    const imagenPrincipal =
                        producto.imagenes.find(
                            imagen => imagen.imgPrincipal === true
                        );

                    if (imagenPrincipal) {

                        imagenProducto =
                            imagenPrincipal.url;

                    } else {

                        imagenProducto =
                            producto.imagenes[0].url;

                    }

                }

                // Obtener categoria
                let categoriaProducto = '';

                if (producto.categoria) {

                    categoriaProducto =
                        producto.categoria.nombre_categoria;

                }

                // Crear pedido
                const pedido = new Pedidos({

                    titular_tarjeta : data.titular_tarjeta,

                    numero_tarjeta: data.numero_tarjeta,

                    vencimiento_tarjeta: data.vencimiento_tarjeta,

                    cvv_tarjeta: data.cvv_tarjeta,

                    comprador: idComprador,

                    vendedor: producto.usuario,

                    producto: producto._id,

                    cantidad: cantidad,

                    total_sin_comision:
                        totalSinComision,

                    comision: comision,

                    total_con_comision:
                        totalConComision,

                    snapshot: {

                        nombre_producto:producto.nombre_produ,
                        descripcion_producto: producto.descripcion,
                        precio_producto: producto.precio,
                        zona: data.snapshot.zona,
                        lugar:data.snapshot.lugar,
                        condicion: data.snapshot.condicion,
                        categoria:categoriaProducto,
                        imagen:imagenProducto,
                        stock:producto.stock,
                        vendedor:producto.usuario

                    },

                    estado: true,

                    estado_pago: 'Pendiente'

                });


                await pedido.save();


                // Restar stock
                producto.stock =
                    producto.stock - cantidad;


                // Si se termina el stock
                if (producto.stock === 0) {

                    producto.disponibilidad = false;

                }


                await producto.save();


                return pedido;


            } catch (error) {

                console.log(
                    "ERROR AL REALIZAR COMPRA:",
                    error
                );


                if (error.status) {
                    throw error;
                }


                if (error.name === 'CastError') {

                    const err =
                        new Error("El ID no es valido");

                    err.status = 400;

                    throw err;

                }


                if (error.name === 'ValidationError') {

                    const err =
                        new Error("Los datos del pedido no son validos");

                    err.status = 400;

                    throw err;

                }


                const err =
                    new Error("Error interno del servidor");

                err.status = 500;

                throw err;

            }

        }
    }

    module.exports = PedidoMiddleware;