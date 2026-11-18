const Calificaciones = require('../models/calificaciones');
const Pedidos = require('../models/pedidos');
const Users = require('../models/users');

class CalificacionService {

    // Saca el promedio de todas las calificaciones que le han puesto a un vendedor.
    // Se suman aqui con un forEach para que se entienda de un vistazo.
    async promedioVendedor(idVendedor) {

        const calificaciones = await Calificaciones.find({ vendedor: idVendedor });

        if (calificaciones.length === 0) {
            return {
                promedio: 0,
                totalValoraciones: 0
            };
        }

        let suma = 0;

        calificaciones.forEach(unaCalificacion => {
            suma = suma + unaCalificacion.puntuacion;
        });

        const promedio = suma / calificaciones.length;

        return {
            // Se deja con un decimal: 4.3 en lugar de 4.333333
            promedio: Math.round(promedio * 10) / 10,
            totalValoraciones: calificaciones.length
        };
    }

    // Vuelve a calcular la reputacion del vendedor y la guarda en su usuario.
    // Se recalcula desde cero (en vez de ir sumando) para que el campo nunca
    // se despegue de las calificaciones que hay realmente.
    async recalcularReputacion(idVendedor) {

        const reputacion = await this.promedioVendedor(idVendedor);

        await Users.findByIdAndUpdate(idVendedor, {
            $set: { reputacion: reputacion }
        });

        return reputacion;
    }

    // La calificacion que ya se le puso a una compra (null si todavia no tiene)
    async calificacionDePedido(idPedido) {

        try {
            return await Calificaciones.findOne({ pedido: idPedido });
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async nuevaCalificacion(idPedido, idUsuario, data) {

        const puntuacion = Number(data.puntuacion);

        if (!Number.isInteger(puntuacion) || puntuacion < 1 || puntuacion > 5) {
            const error = new Error('La calificación debe ser un número del 1 al 5');
            error.status = 400;
            throw error;
        }

        let pedido;

        try {
            pedido = await Pedidos.findById(idPedido);
        } catch (error) {
            if (error.name === 'CastError') {
                const err = new Error('El ID del pedido no es válido');
                err.status = 400;
                throw err;
            }
            throw error;
        }

        if (!pedido) {
            const error = new Error('El pedido no existe');
            error.status = 404;
            throw error;
        }

        // Solo quien compro puede calificar, y se revisa contra el token,
        // no contra un id que mande el cliente
        if (pedido.comprador.toString() !== idUsuario.toString()) {
            const error = new Error('Solo quien hizo esta compra puede calificarla');
            error.status = 403;
            throw error;
        }

        const yaCalificada = await Calificaciones.findOne({ pedido: idPedido });

        if (yaCalificada) {
            const error = new Error('Esta compra ya fue calificada');
            error.status = 400;
            throw error;
        }

        try {

            const calificacion = new Calificaciones({
                pedido: pedido._id,
                vendedor: pedido.vendedor,
                usuario: idUsuario,
                puntuacion: puntuacion
            });

            await calificacion.save();

            // La reputacion del vendedor se actualiza en cuanto recibe una nueva
            await this.recalcularReputacion(pedido.vendedor);

            return calificacion;

        } catch (error) {
            console.log(error);
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }
    }

}

module.exports = CalificacionService;
