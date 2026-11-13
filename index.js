require('dotenv').config();
const express = require('express');
const usersRouter = require('./routes/usersRouter');
const productosRouter = require('./routes/productosRouter');
const pedidosRouter = require('./routes/pedidosRouter');
const categoriasRouter = require('./routes/categoriasRouter');
const puntoEncuentroRouter = require('./routes/puntoEncuentroRouter');
const reportesRouter = require('./routes/reportesRouter');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//cors para permitir que el clinte se conecte con el servidor 
const cors = require('cors');

//Conectar mongo
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

//Creando App 
const app = express();

//habilitar body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Habilitar cors
app.use(cors());

//Rutas de la app
app.use('/', usersRouter());
app.use('/', productosRouter());
app.use('/', pedidosRouter());
app.use('/', categoriasRouter());
app.use('/', puntoEncuentroRouter());
app.use('/', reportesRouter());

//Definir puerto y arrancar
const port = 3000;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});

