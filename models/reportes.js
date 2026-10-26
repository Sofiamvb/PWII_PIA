const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportesSchema = new Schema({
    producto: {
        type: Schema.ObjectId,
        ref: 'productos'
    },
    pedido: {
        type: Schema.ObjectId,
        ref: 'Pedidos'
    },
    usuario_reporte: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    usuario_reportado: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    tipo_de_reporte:{
        type: String,
        enum:['producto sospechoso', 'información incorrecta', 'publicación inapropiada', 'usuario, fraude', 'problema en transacción']
    },
    motivo: {
        type: String,
        trim: true
    },
    descripcionReporte: {
        type: String,
        trim: true
    },
    estadoReporte: {
        type: String,
        enum:['pendiente', 'revision', 'resuelto', 'cerrado'],
        default: 'pendiente'
    },
    


});

module.exports = mongoose.model('Reportes', reportesSchema);