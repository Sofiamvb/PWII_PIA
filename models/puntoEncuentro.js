const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const puntoEncuentroSchema = new Schema({

    lugar: {
        type: String,
        trim: true
    },
    zona: {
        type: String,
        trim: true
    },
    descripcionZona: {
        type: String,
        trim: true
    },
    horario: {
        type: String
    },
    url_ubicacion: {
        type: String,
        trim: true
    },
    estado:{
        type: Boolean
    }


});

module.exports = mongoose.model('PuntoEncuentro', puntoEncuentroSchema);