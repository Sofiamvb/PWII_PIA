const Pedidos = require('../models/pedidos');
const PedidoService = require('../services/pedidoService');
const CalificacionService = require('../services/calificacionService');

const pedidoService = new PedidoService();
const calificacionService = new CalificacionService();


//Mostrar todos los pedidos
exports.mostrarPedidos = async (req, res, next) => {

    try {

        const pedidos = await Pedidos.find({}).populate('usuario').populate({
            path: 'pedido.producto',
            model: 'productos'
        });
        res.json(pedidos);

    } catch (error) {
        console.log(error);
        next();
    }

}

//Actualizar pedido por ID 
exports.actualizarPedido = async (req, res, next) => {

    try {
        let nuevoPedido = await Pedidos.findOneAndUpdate({ _id: req.params.idPedido }, req.body, {
            new: true
        })
            .populate('usuario')
            .populate({
                path: 'pedido.producto',
                model: 'productos'
            });

        res.json(nuevoPedido);

    } catch (error) {
        console.log(error);
        next();
    }
}

//Eliminar pedido por ID 
exports.eliminarPedido = async (req, res, next) => {


    try {
        await Pedidos.findOneAndDelete({ _id: req.params.idPedido });

        res.json({ mensaje: 'El pedido ha sido elimnado' })
    } catch (error) {
        console.log(error);
        next();
    }
}

//MOSTRAR LAS VENTAS DE USURIO
exports.misVentas = async (req, res, next) => {

    try {

        const ventas = await Pedidos.find({
            vendedor: req.params.idUsuario,
            estado_entrega: {
                $ne: 'Cancelado'
            }
        })

            .populate({
                path: 'producto',
                select: 'nombre_produ imagenes condicion precio punto_encuentro',

                populate: {
                    path: 'punto_encuentro',
                    select: 'lugar zona descripcionZona horario url_ubicacion'
                }
            })

            .populate(
                'comprador',
                'name apellidoP apellidoM'
            )

            .sort({
                fecha_pedido: -1
            });


        return res.json({
            mensaje: 'Estas son tus listas de ventas',
            ventas: ventas
        });


    } catch (error) {

        console.log(error);

        return next(error);
    }
}

//MOSTRAR LAS COMPRAS DE USURIO
exports.misCompras = async (req, res, next) => {

    try {

        const compras = await Pedidos.find({
            comprador: req.params.idUsuario
        })

            .populate({
                path: 'producto',
                select: 'nombre_produ imagenes condicion precio punto_encuentro',

                populate: {
                    path: 'punto_encuentro',
                    select: 'lugar zona descripcionZona horario url_ubicacion'
                }
            })

            .populate(
                'vendedor',
                'name apellidoP apellidoM'
            )

            .sort({
                fecha_pedido: -1
            });


        return res.json({
            mensaje: 'Estas son tus listas de compras',
            compras: compras
        });


    } catch (error) {

        console.log(error);

        return next(error);
    }

}

//DATOS DE COMPRA
exports.mostrarPedido = async (req, res, next) => {

    try {

        const pedido = await Pedidos.findById(
            req.params.idPedido
        )

            .populate({
                path: 'producto', select: 'nombre_produ precio imagenes condicion punto_encuentro',
                populate: {
                    path: 'punto_encuentro', select: 'lugar zona horario'
                }
            })

            .populate('vendedor', 'name apellidoP apellidoM institucion carrera reputacion imagen')
            .populate('comprador', 'name apellidoP apellidoM');

        if (!pedido) {

            return res.status(404).json({
                mensaje: 'El pedido no existe'
            });

        }


        // Si ya la calificaron, la pantalla muestra las estrellas que se pusieron;
        // si no, muestra el formulario para calificar
        const calificacion = await calificacionService.calificacionDePedido(pedido._id);

        res.json({
            mensaje: 'Estos son los datos de la compra',
            pedido: pedido,
            calificacion: calificacion
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


        // El modelo no tiene 'estado_entrega' (Mongoose lo descartaba al guardar),
        // asi que estas revisiones nunca se cumplian. Se usa estado_pago, que si existe:
        // Reembolsado = ya se cancelo, Liberado = el pago ya se le dio al vendedor (entregado)
        if (pedido.estado_pago === 'Reembolsado') {
            return res.status(400).json({
                mensaje: 'La compra ya esta cancelada'
            });
        }


        if (pedido.estado_pago === 'Liberado') {
            return res.status(400).json({
                mensaje: 'No puedes cancelar una compra ya entregada'
            });
        }


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
            await pedidoService.comprarProducto(

                req.params.idProducto,
                req.params.idComprador,
                req.body.cantidad,
                req.body

            );


        return res.json({

            mensaje:
                'Compra realizada correctamente',

            pedido: pedido

        });


    } catch (error) {
        console.log(error)

        if (error.status) {

            return res.status(error.status).json({

                mensaje: error.message

            });

        }


        return next(error);

    }

}