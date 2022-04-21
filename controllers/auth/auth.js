
const db = require('../../config/db.config.js');
//const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { generarJWT } = require('../utilerias/jwt');


require('dotenv').config({
  path: 'variables.env'
});

exports.autenticarUsuario = async (req, res) => {
  let data = {};

  data["error"] = false;  

  //extraer email y password ---
  const  {email, password} = req.body;
  try {

    //revisar que haya un usuario registrado
    let usuario = await db.sequelize.query(`SELECT * FROM vh_usuario where email = "${email}";`, { type: db.sequelize.QueryTypes.SELECT});
    if(!usuario.length){
        data["error"] = true;
        data["msg"] = "El usuario no existe";
        return res.status(400).json(data);
    }

    //console.log("password: ", usuario[0].password);
    let idUser = usuario[0].id;
    console.log("idUser: ", idUser); 
    let rol = usuario[0].rol_id;
    console.log("idUser: ", idUser); 

    //revisar su password
    const passCorrecto = await bcryptjs.compare(password, usuario[0].password);

    if(!passCorrecto){
        data["error"] = true;
        data["msg"] = "La contraseña es Incorrecta";
        return res.status(400).json(data);
    }

    //si todo es correcto -- 
    data["usuario"] = usuario[0];
 

    //Generar el JWT
    const token = await generarJWT(idUser, rol);

    data["token"] = token;

    res.send(data);

    //res.send(data);
  } catch(e){
    console.dir(e);  
    res.status(400).send(e); 
  }
 

};

//obtener usuario autenticado
exports.usuarioLogueado = async (req, res) => {
  let data = {};
  console.log(req.usuario);
  try {
    let usuario = await db.sequelize.query(`SELECT * FROM vh_usuario where id = ${req.usuario.id};`, { type: db.sequelize.QueryTypes.SELECT});
    data["object"] = usuario;
    res.send(data);
  } catch(e){
    console.dir(e);
    res.send(e);
  }

};


exports.renovarToken = async (req, res) => {
  
  let data = {};

  console.log(req.usuario);

  data["error"] = false;  

  //extraer datos ---
  const  {idUser, rol} = req.usuario;

  //Generar el JWT
  const token = await generarJWT(idUser, rol);

  data["token"] = token;

  try {
    let usuario = await db.sequelize.query(`SELECT id, rol_id, nombreRol, usuario, email FROM vh_usuario where id = ${req.usuario.id};`, { type: db.sequelize.QueryTypes.SELECT});
    data["object"] = usuario;
    res.send(data);
  } catch(e){
    console.dir(e);
    res.send(e);
  }

};



