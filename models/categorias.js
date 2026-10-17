const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
    nombre_categoria:{
        type: String,
        trim: true
    }

});

module.exports = mongoose.model('Categorias', categoriaSchema);