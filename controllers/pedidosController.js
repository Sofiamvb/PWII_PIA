const Pedidos = require('../models/pedidos');

//Agregar pedidos
exports.nuevoPedido = async (req, res, next) => {

    const pedido = new Pedidos(req.body);

    try {
        await pedido.save();
        res.json({ mensaje: 'Se agrego un nuevo pedido' })
    } catch (error) {
        console.log(error);
        next();
    }


}

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

//Mostrar pedido por ID 
exports.mostrarPedido = async (req, res, next) => {
    try {

        const pedido = await Pedidos.findById(req.params.idPedido).populate('usuario').populate({
            path: 'pedido.producto',
            model: 'productos'
        });
        if (!pedido) {
            res.json({ mensaje: 'El pedido no existe' });
            return next();
        }
        res.json(pedido);

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
            .populate('producto', 'nombre_produ imagenes condicion punto_encuentro')
            .populate('comprador', 'name apellidoP apellidoM')
            .populate('punto_encuentro', 'lugar zona')
            .sort({
                fecha_pedido: -1
            });

            res.json({
            mensaje: 'Estas son tus listas de ventas',
            ventas: ventas});

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    //MOSTRAR LAS COMPRAS DE USURIO
        exports.misCompras = async (req, res, next) => {

        try {

            const compras = await Pedidos.find({
                comprador: req.params.idUsuario,
                estado_entrega: {
                    $ne: 'Cancelado'
                }
            })  
            .populate('producto', 'nombre_produ imagenes condicion')
            .populate('vendedor', 'name apellidoP apellidoM')
            .populate('punto_encuentro', 'lugar zona')
            .sort({
                fecha_pedido: -1
            });

            res.json({
                mensaje: 'Estas son tus listas de compras',
                compras: compras
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    }