const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
 * Una calificacion por compra: el comprador le pone estrellas al VENDEDOR
 * con el que trato. Se guarda el pedido para poder revisar que solo califique
 * quien compro, y nada mas una vez. El producto no se guarda porque el
 * pedido ya lo tiene.
 */
const calificacionesSchema = new Schema({
    pedido: {
        type: Schema.ObjectId,
        ref: 'Pedidos'
    },
    // A quien se califica
    vendedor: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    // Quien califica (el comprador)
    usuario: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    puntuacion: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Calificaciones', calificacionesSchema);
