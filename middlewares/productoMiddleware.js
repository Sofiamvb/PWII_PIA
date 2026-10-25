const { json } = require('express');
const productos = require('../models/productos');
const CategoriasMiddleware = require('../middlewares/categoriasMiddleware')

const categoriasMiddleware = new CategoriasMiddleware();


class ProductoMiddleware {



    async traerProductos(data) {
        try {
            const { precio_inicio, precio_final, categoria } = data;

            console.log(precio_inicio, precio_final, categoria)

            const filtro = {
                precio: {
                    // Si el valor de la izquierda no existe, esta como nulo o como undefined tomamos el valor de la derecha como default
                    // Si el valor de la izquierda si existe, se queda como esta.
                    $gte: Number(precio_inicio ?? 0)
                }
            }

            /*
            const precio = {
                $gte: Number(precio_inicio ?? 0)
            }
            */


            if (precio_final != null && precio_final !== '') {
                filtro.precio.$lte = Number(precio_final);
                /*
                const precio = {
                  $gte: Number(precio_inicio ?? 0),
                  $lte = Number(precio_final);
                }
                */
            }

            if (categoria != null && categoria !== '') {
                const categoria_encontrada = await categoriasMiddleware.encontrarCategoria(categoria);
                if (!categoria_encontrada) {
                    return {
                        mensaje: "Categoria no encontrada",
                        data: []
                    }
                }

                filtro.categoria = categoria_encontrada._id
            }


            const producto = await productos.find(filtro);

            return producto;

        } catch (error) {
            console.log(error)
            const err = new Error("Error interno del servidor");
            err.status = 500;
            throw err;
        }
    }

}

module.exports = ProductoMiddleware;

/*
                const nueva_categoria = new categorias({
                    nombre_categoria: "ciencias"
                })
                await nueva_categoria.save()
*/