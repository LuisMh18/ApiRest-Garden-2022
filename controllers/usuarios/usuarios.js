
const db = require('../../config/db.config.js');
const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const  apiResponser = require('../utilerias/apiResponser');
const utilerias = require('../utilerias/utilerias');

exports.findAll = async (req, res) => {
  let data = {};
  try {
    data["error"] = false;
    const table = "usuario";
    const result = await apiResponser.consulta(table, req.query);
    data["data"] = result;
    res.status(200).json(data);
  } catch(e){
    console.dir(e);
    res.status(500).json(e);
  }

};


exports.findOne = async (req, res) => {
  let data = {};
  try {
    data["error"] = false;
    let usuario = await db.sequelize.query(`SELECT id, rol_id, usuario, email FROM usuario where id = ${req.params.id};`, { type: db.sequelize.QueryTypes.SELECT});
    if(!usuario.length){
      data["error"] = true;
      data["msg"] = `El usuario ${req.params.id} no existe!`;
      return res.status(404).json(data);
    }
    data["object"] = usuario;
    res.json(data);
  } catch(e){
    console.dir(e);
    res.status(500).json(e);
  }

};

exports.create = async (req, res) => {
  let data = {};
  const fechaHora = await utilerias.obtenerFechaActual();
  data["error"] = false;

  //extraer datos ---
  const  {rol_id, usuario, password, password_confirm, email} = req.body;

  try {

    //comprobamos si el usuario ya existe
    let existe_usuario = await db.sequelize.query(`SELECT * FROM usuario where email = "${email}";`, { type: db.sequelize.QueryTypes.SELECT});
    if(existe_usuario.length){
        data["error"] = true;
        data["msg"] = "El usuario ya existe";
        return res.status(400).json(data);
    }

    //validar que las contraseñas sean iguales --
    if(password !== password_confirm){
      data["error"] = true;
      data["msg"] = "Las contraseñas no coinciden";
      return res.status(400).json(data);
  }

    //Hashear el password
    const salt = await bcryptjs.genSalt(10);
    let hash_password = await bcryptjs.hash(password, salt);

    let newUser = await db.sequelize.query(`INSERT INTO usuario (rol_id, usuario, password, email, remember_token, created_at, updated_at) VALUES (${rol_id}, "${usuario}", "${hash_password}", "${email}", "", "${fechaHora}", "${fechaHora}");`, {type: db.sequelize.QueryTypes.INSERT});
    console.log(newUser);
    data["data"] = newUser;
    let idUser = newUser[0];
    console.log("idUser: ", idUser); 
    data["msg"] = "Usuario agregado exitosamente";
    res.status(202).json(data);
    
  } catch(e){
    console.dir(e);
    res.status(400).json(e);
  }


};

exports.update = async (req, res) => {

  let data = {};
  const fechaHora = await utilerias.obtenerFechaActual();

  data["error"] = false;

  const idUser = req.params.id;

  //extraer datos ---
  const  {rol_id, usuario, old_password, new_password, new_password_confirm, email} = req.body;

  try {

     //obtenemos la contraseña actual del usuario para compararla con la ingresada
     let us = await db.sequelize.query(`SELECT * FROM usuario where id = "${idUser}";`, { type: db.sequelize.QueryTypes.SELECT});

     if(!us.length){
      data["error"] = true;
      data["msg"] = `El usuario ${idUser} no existe!`;
      return res.status(404).json(data);
    }

    let passwordUser = us[0].password;
    console.log("passwordUser: ", passwordUser);
 
     //revisar si la contraseña anterior coincide
     const passCorrecto = await bcryptjs.compare(old_password, passwordUser);
 
     if(!passCorrecto){
       data["error"] = true;
       data["msg"] = "La contraseña anterior ingresada no es correcta";
       return res.status(400).json(data);
     }

     //validar que las contraseñas sean iguales --
      if(new_password !== new_password_confirm){
        data["error"] = true;
        data["msg"] = "Las contraseñas no coinciden";
        return res.status(400).json(data);
    }


    //Hashear el password
    const salt = await bcryptjs.genSalt(10);
    let hash_password = await bcryptjs.hash(new_password, salt);

    let upd = await db.sequelize.query(`UPDATE usuario SET rol_id=${rol_id}, usuario="${usuario}", password="${hash_password}", email="${email}",  updated_at="${fechaHora}" WHERE id=${idUser};`, {type: db.sequelize.QueryTypes.UPDATE});
    console.log(upd);
    data["data"] = upd;
    data["msg"] = `Usuario ${idUser} actualizado exitosamente`;
    res.status(202).json(data);
  } catch(e){
    console.dir(e);
    res.status(500).json(e);
  }

};

exports.delete = async (req, res) => {
  let data = {};
  const ID = req.params.id;
  try {
    let us = await db.sequelize.query(`SELECT * FROM usuario where id = "${ID}";`, { type: db.sequelize.QueryTypes.SELECT});
    if(!us.length){
      data["error"] = true;
      data["msg"] = `El usuario ${ID} no existe!`;
      return res.status(404).json(data);
    }
    let deleteUser = await db.sequelize.query(`DELETE FROM usuario where id = ${ID};`, { type: db.sequelize.QueryTypes.DELETE});
    data["data"] = deleteUser;
    data["error"] = false;
    data["msg"] = `Usuario ${ID} eliminado exitosamente`;
    res.send(data);
  } catch(e){
    console.dir(e);
    res.status(500).json(e);
  }

};


exports.getDataAll = async (req, res) => {
  console.log(req.usuario);
  const table = "usuario";
  const result = await db.sequelize.query(`SELECT id, rol_id, usuario, email, created_at FROM ${table} order by id desc;`, { type: db.sequelize.QueryTypes.SELECT});
  let data = {};
  data["error"] = false;
  try {
    data["data"] = result;
    res.status(200).json(data);
  } catch(e){
    console.dir(e);
    res.status(500).send(e);
  }

};
