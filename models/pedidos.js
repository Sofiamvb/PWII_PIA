const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const snapshotProducto = new Schema({
    nombre_producto: {
        type: String
    },

    descripcion_producto: {
        type: String
    },

    precio_producto: {
        type: Number
    },
    _id: false,
    categoria:{
        type: String
    },
    imagen:{
        type: String
    }
})

const pedidosSchema = new Schema({
    comprador: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    vendedor: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    producto: {
        type: Schema.ObjectId,
        ref: 'productos'
    },
    cantidad: {
        type: Number,
        min: 1,
        
    },
    total_con_comision: {
        type: Number
    },
    comision: {
        type: Number
    },
    total_sin_comision: {
        type: Number
    },
    snapshot: snapshotProducto,

    estado: {
        type: Boolean
    },
    fecha_pedido: {
        type: Date
    },
    estado_pago: {
        enum: ['Pendiente', 'Retenido', 'Liberado', 'Reembolsado']
    },
    fechaPago: {
        type: Date
    },
    timestamps:true

});


module.exports = mongoose.model('Pedidos', pedidosSchema);