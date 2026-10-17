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