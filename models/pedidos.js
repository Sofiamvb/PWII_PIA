
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Información del producto al momento de realizar el pedido
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
    categoria: {
        type: String
    },
    imagen: {
        type: String
    }
}, {
    _id: false
});

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
        min: 1
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
    snapshot: {
        type: snapshotProducto,
        required: true
    },
    estado: {
        type: Boolean
    },
    fecha_pedido: {
        type: Date,
        default: Date.now
    },
    estado_pago: {
        type: String,
        enum: ['Pendiente', 'Retenido', 'Liberado', 'Reembolsado'],
        default: 'Pendiente'
    },
    fechaPago: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pedidos', pedidosSchema);
