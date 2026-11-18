const Reportes = require('../models/reportes');
const Users = require('../models/users');
const Pedidos = require('../models/pedidos');

// Revisa que vengan los campos del formulario (se usa en todos los reportes)
function validarCampos(data) {

    if (!data ||
        !data.usuario_reporte ||
        !data.tipo_de_reporte ||
        !data.motivo ||
        !data.descripcionReporte ||
        data.tipo_de_reporte.trim() === '' ||
        data.motivo.trim() === '' ||
        data.descripcionReporte.trim() === '') {

        const error = new Error("No puedes dejar campos vacios");
        error.status = 400;
        throw error;
    }
}

// Convierte cualquier error en uno con status para el controller
function manejarError(error, mensajeLog) {

    console.log(mensajeLog, error);

    if (error.status) {
        return error;
    }

    if (error.name === 'CastError') {
        const err = new Error("El ID no es valido");
        err.status = 400;
        return err;
    }

    if (error.name === 'ValidationError') {
        const err = new Error("Los datos del reporte no son validos");
        err.status = 400;
        return err;
    }

    const err = new Error("Error interno del servidor");
    err.status = 500;
    return err;
}

class ReportesMiddleware {

    // CREAR REPORTE DE UNA COMPRA
    // Solo el comprador o el vendedor del pedido pueden reportarlo,
    // y se reporta a la otra persona de la compra
    async reportarCompra(idPedido, data) {

        try {

            validarCampos(data);

            const pedido = await Pedidos.findById(idPedido);

            if (!pedido) {

                const error = new Error("La compra no existe");
                error.status = 404;
                throw error;
            }

            const comprador = String(pedido.comprador);
            const vendedor = String(pedido.vendedor);

            // A quién se reporta: si reporta el comprador → al vendedor, y al revés
            let usuarioReportado = null;

            if (data.usuario_reporte === comprador) {
                usuarioReportado = pedido.vendedor;
            }

            if (data.usuario_reporte === vendedor) {
                usuarioReportado = pedido.comprador;
            }

            if (!usuarioReportado) {

                const error = new Error("Solo puedes reportar compras en las que participaste");
                error.status = 403;
                throw error;
            }

            const reporte = new Reportes({

                pedido: idPedido,

                producto: pedido.producto,

                usuario_reporte: data.usuario_reporte,

                usuario_reportado: usuarioReportado,

                tipo_de_reporte: data.tipo_de_reporte,

                motivo: data.motivo,

                descripcionReporte: data.descripcionReporte,

                estadoReporte: 'pendiente'

            });

            await reporte.save();

            return reporte;

        } catch (error) {
            throw manejarError(error, "ERROR AL CREAR REPORTE DE COMPRA:");
        }

    }

    // CREAR REPORTE DE UN USUARIO (sin producto)
    // El usuario reportado se elige con el buscador del frontend
    async reportarUsuario(data) {

        try {

            validarCampos(data);

            if (!data.usuario_reportado) {

                const error = new Error("Selecciona al usuario que quieres reportar");
                error.status = 400;
                throw error;
            }


            // Nadie se puede reportar a sí mismo
            if (data.usuario_reporte === data.usuario_reportado) {

                const error = new Error("No puedes reportarte a ti mismo");
                error.status = 400;
                throw error;
            }


            // El usuario reportado debe existir
            const usuarioReportado = await Users.findById(data.usuario_reportado);

            if (!usuarioReportado) {

                const error = new Error("El usuario que quieres reportar no existe");
                error.status = 404;
                throw error;
            }


            const reporte = new Reportes({

                usuario_reporte: data.usuario_reporte,

                usuario_reportado: data.usuario_reportado,

                tipo_de_reporte: data.tipo_de_reporte,

                motivo: data.motivo,

                descripcionReporte: data.descripcionReporte,

                estadoReporte: 'pendiente'

            });

            await reporte.save();

            return reporte;


        } catch (error) {
            throw manejarError(error, "ERROR AL CREAR REPORTE DE USUARIO:");
        }

    }

}

module.exports = ReportesMiddleware;
