const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productosSchema = new Schema({
    usuario: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    categoria: {
        type: Schema.ObjectId,
        ref: 'Categorias'
    },
    punto_encuentro: {
        type: Schema.ObjectId,
        ref: 'PuntoEncuentro'
    },
    nombre_produ: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    precio: {
        type: Number,
        min: 0
    },
    imagenes: [
        {
            url: {
                type: String,
                trim: true
            },
            imgPrincipal: {
                type: Boolean,
                default: false
            }
        }
    ],
    status_aprobado: {
        type: Boolean
    },
    disponibilidad:{
        type: Boolean
    },
    condicion: {
        enum: ['Nuevo', 'Usado', 'Semi-Nuevo']
    },
    stock: {
        type: Number,
        min: 0
    }


});

module.exports = mongoose.model('productos', productosSchema);