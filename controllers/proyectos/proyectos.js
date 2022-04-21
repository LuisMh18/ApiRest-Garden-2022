
const db = require('../../config/db.config.js');
const Sequelize = require('sequelize');
const { validationResult } = require('express-validator');

const utilerias = require('../utilerias/utilerias');

exports.findAll = async (req, res) => {
  let data = {};
  try {
    let proyectos = await db.sequelize.query(`SELECT * FROM proyecto order by id desc;`, { type: db.sequelize.QueryTypes.SELECT});
    data["object"] = proyectos;
    res.json(data);
  } catch(e){
    console.dir(e);
    res.json(e);
  }

};


exports.findOne = async (req, res) => {
  let data = {};
  try {
    let proyecto = await db.sequelize.query(`SELECT * FROM proyecto where id = ${req.params.id};`, { type: db.sequelize.QueryTypes.SELECT});
    data["object"] = proyecto;
    res.json(data);
  } catch(e){
    console.dir(e);
    res.json(e);
  }

};



exports.create = async (req, res) => {
  let data = {};
  data["error"] = false;

  //revisar si hay errores
  const errores = validationResult(req);
  if(!errores.isEmpty()){
      return res.status(400).json({ errores: errores.array() });
  }

  //extraer datos ---
  const {nombre} = req.body;

  //obtener los datos del usuario del JWT - se alamaceno en req.usuario
  console.log("req.usuario");
  console.log(req.usuario);
  const usuario_id = req.usuario.id;
  try {

    let createProyect = await db.sequelize.query(`INSERT INTO proyecto (nombre, usuario_id) VALUES ("${nombre}", ${usuario_id});`, {type: db.sequelize.QueryTypes.INSERT});
    console.log(createProyect);
    data["object"] = createProyect;
    let idProyect = createProyect[0];
    console.log("idProyect: ", idProyect); 
    data["msg"] = "Proyecto agregado exitosamente";

    res.json(data);
    
  } catch(e){
    console.dir(e);
    res.status(500).send(e);
  }


};

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
  let data = {};
  console.log("obtenerProyectos");
  try {
    const usuario_id = req.usuario.id;
    let proyectosUsuario = await db.sequelize.query(`SELECT * FROM proyecto where usuario_id = ${usuario_id};`, { type: db.sequelize.QueryTypes.SELECT});
    data["object"] = proyectosUsuario;
    res.json(data);
  } catch(e){
    console.dir(e);
    res.status(500).send(e);
  }

};


exports.update = async (req, res) => {
  let data = {};
  data["error"] = false;
  let idProyecto = req.params.id;
  const fechaHora = await utilerias.obtenerFechaActual();

  //revisar si hay errores
  const errores = validationResult(req);
  if(!errores.isEmpty()){
      return res.status(400).json({ errores: errores.array() });
  }

  //extraer datos ---
  const {nombre} = req.body;

  //obtener los datos del usuario del JWT - se alamaceno en req.usuario
  console.log("req.usuario");
  console.log(req.usuario);
  const usuario_id = req.usuario.id;
  try {

    //validar si el proyecto existe
    let proyecto = await db.sequelize.query(`SELECT * FROM proyecto where id = ${idProyecto};`, { type: db.sequelize.QueryTypes.SELECT});
    if(!proyecto.length){
        data["error"] = true;
        data["msg"] = "Proyecto no encontrado";
        return res.status(404).json(data);
    }

  //verificar el creador del proyecto 
  if(usuario_id !== proyecto[0].usuario_id){
      data["error"] = true;
      data["msg"] = "No autorizado";
      return res.status(401).json(data);
  }

    let updateProyect = await db.sequelize.query(`UPDATE proyecto set nombre="${nombre}", date_modified="${fechaHora}" where id = ${idProyecto};`, {type: db.sequelize.QueryTypes.UPDATE});
    console.log(updateProyect);
    data["object"] = updateProyect;
    data["msg"] = "Proyecto actualizado exitosamente";

    res.json(data);
    
  } catch(e){
    console.dir(e);
    res.status(500).send(e);
  }


};



exports.delete = async (req, res) => {
  let data = {};
  let idProyecto = req.params.id;

  const usuario_id = req.usuario.id;
  try {

    //validar si el proyecto existe
      let proyecto = await db.sequelize.query(`SELECT * FROM proyecto where id = ${idProyecto};`, { type: db.sequelize.QueryTypes.SELECT});
      if(!proyecto.length){
        data["error"] = true;
        data["msg"] = "Proyecto no encontrado";
        return res.status(404).json(data);
    }

    //verificar el creador del proyecto 
    if(usuario_id !== proyecto[0].usuario_id){
        data["error"] = true;
        data["msg"] = "No autorizado";
        return res.status(401).json(data);
    }
    
    let deleteProyect = await db.sequelize.query(`DELETE FROM proyecto where id = ${idProyecto};`, { type: db.sequelize.QueryTypes.DELETE});
    data["object"] = deleteProyect;
    data["error"] = false;
    data["msg"] = "Proyecto eliminado exitosamente!";
    res.send(data);
  } catch(e){
    console.dir(e);
    res.send(e);
  }


};