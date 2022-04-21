const express = require('express');
const cors = require('cors');
const path = require('path');

const usuarios = require('./routes/usuarios/usuarios');//indica en dónde esta nuestro archivo
const auth = require('./routes/auth/auth');
const proyectos = require('./routes/proyectos/proyectos');
const almacen = require('./routes/almacen/almacen');
const menu = require('./routes/menu/menu');
const inventario = require('./routes/inventario/inventario');
//crear el servidor 
const app = express();

//puerto de la app
const PORT = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/usuarios', usuarios); //indica que lo vamos a usar
app.use('/api/auth', auth); 
app.use('/api/proyectos', proyectos); 
app.use('/api/almacen', almacen); 
app.use('/api/menu', menu); 
app.use('/api/inventario', inventario); 

//arrancar la app
app.listen(PORT,  () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});