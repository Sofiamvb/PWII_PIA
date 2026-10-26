
const { json } = require('express');
const Categorias = require('../models/categorias');


class CategoriasMiddleware {

    async encontrarCategoria(nombre_categoria) {
        const categoria_encontrada = await Categorias.findOne({ nombre_categoria: nombre_categoria })
        console.log(categoria_encontrada)
        if (!categoria_encontrada) {
            return null;
        }
        return categoria_encontrada;
    }


}

module.exports = CategoriasMiddleware;
