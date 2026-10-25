const productos = require('../models/productos');
const ProductoMiddleware = require('../middlewares/productoMiddleware');

const productoMiddleware = new ProductoMiddleware();

const multer = require('multer');
const shortid = require('shortid');

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads/');
        },
        filename: (req, file, cb) => {
            // Genera un nombre único usando shortid y le concatena la extensión original
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato no valido'));
        }
    },


}
//pasar la configuracion y el campo
const upload = multer(configuracionMulter).single('imagen');

//Subir un archivo 
exports.subirArchivo = async (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.json({ mensaje: error })
        }
        return next();
    })
}

//nuevos productos
exports.nuevoProducto = async (req, res, next) => {

    const producto = new productos(req.body);

    try {
        //se asigna
        if (req.file.filename) {
            producto.imagen = req.file.filename
        }
        //se guarda
        await producto.save();
        res.json({ mensaje: 'Se ha agregado un nuevo producto' })
    } catch (error) {
        console.log(error);
        next();
    }

}

//Mostrar productos 
exports.mostrarProductos = async (req, res, next) => {
    try {
        console.log(req.query)
        const Productos = await productoMiddleware.traerProductos(req.query);
        console.log(Productos);
        res.json(Productos);

    } catch (error) {
        if (error.status === 500) {
            return res.status(500).json({
                mensaje: error.message
            });
        }

        next(error);
    }
}

//mostrar producto por ID
exports.mostrarProducto = async (req, res, next) => {

    const Producto = await productos.findById(req.params.idProducto);

    if (!Producto) {
        res.json({ mensaje: 'El producto no existe' });
        return next();
    }

    //Mostrar el producto
    res.json(Producto);
}

//Actualizar Producto por ID 
exports.actualizarProducto = async (req, res, next) => {
    try {

        //construir nuevo producto
        let nuevoProducto = req.body;

        //Verificar si hay una imagen nueva
        if (req.file) {
            nuevoProducto.imagen = req.file.filename;
        } else {
            let ProductoAnterior = await productos.findById(req.params.idProducto);
            nuevoProducto.imagen = ProductoAnterior.imagen;
        }

        //Actualizar producto
        let Producto = await productos.findByIdAndUpdate({ _id: req.params.idProducto },
            nuevoProducto, {
            new: true,
        });

        res.json(Producto);

    } catch (error) {
        console.log(error);
        next();
    }
}

//Eliminar un producto por ID
exports.eliminarProducto = async (req, res, next) => {
    try {
        await productos.findByIdAndDelete({ _id: req.params.idProducto });
        res.json({ mensaje: 'Producto Eliminado' });
    } catch (error) {
        console.log(error);
        next();
    }
}