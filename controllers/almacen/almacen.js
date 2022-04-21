
const db = require('../../config/db.config.js');
const  apiResponser = require('../utilerias/apiResponser');

const utilerias = require('../utilerias/utilerias');


exports.findAll = async (req, res) => {
  console.log(req.usuario);

  const table = "almacen";
  const result = await apiResponser.consulta(table, req.query);

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

exports.getDataAll = async (req, res) => {
  console.log(req.usuario);
  const table = "almacen";
  const result = await db.sequelize.query(`SELECT id, clave, nombre, estatus, created_at FROM ${table} order by id desc;`, { type: db.sequelize.QueryTypes.SELECT});
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


exports.findOne = async (req, res) => {
  let data = {};
  data["error"] = false;
  try {
    let almacen = await db.sequelize.query(`SELECT * FROM almacen where id = ${req.params.id};`, { type: db.sequelize.QueryTypes.SELECT});
    if(!almacen.length){
      data["error"] = true;
      data["msg"] = `El Almacén ${req.params.id} no existe!`;
      return res.status(404).json(data);
    }
    data["data"] = almacen;
    res.json(data);
  } catch(e){
    console.dir(e);
    res.status(500).send(e);
  }

};



exports.create = async (req, res) => {
  let data = {};
  data["error"] = false;

  const fechaHora = await utilerias.obtenerFechaActual();

  //extraer datos ---
  const {clave, nombre, estatus} = req.body;

  try {

    let almacen = await db.sequelize.query(`INSERT INTO almacen (clave, nombre, estatus, created_at, updated_at) VALUES ("${clave}", "${nombre}", ${estatus}, "${fechaHora}", "${fechaHora}");`, {type: db.sequelize.QueryTypes.INSERT});
    console.log(almacen);
    data["object"] = almacen;
    data["msg"] = "Almacén agregado exitosamente";

    res.status(202).json(data);
    
  } catch(e){
    console.dir(e);
    res.status(500).send(e);
  }


};



exports.update = async (req, res) => {
  let data = {};
  data["error"] = false;
  const ID = req.params.id;
  const fechaHora = await utilerias.obtenerFechaActual();

  //extraer datos ---
  const {clave, nombre, estatus} = req.body;

  try {

    //Actualizar Almacén
    let almacen = await db.sequelize.query(`UPDATE almacen set clave="${clave}", nombre="${nombre}", estatus="${estatus}", updated_at="${fechaHora}" where id = ${ID};`, {type: db.sequelize.QueryTypes.UPDATE});
    console.log(almacen);
    data["object"] = almacen;
    data["msg"] = "Almacén actualizado exitosamente";

    res.json(data);
    
  } catch(e){
    console.dir(e);
    res.status(500).json(e);
  }


};



exports.delete = async (req, res) => {
  let data = {};
  const ID = req.params.id;
  data["error"] = false;
  
  try {

    let al = await db.sequelize.query(`SELECT * FROM almacen where id = "${ID}";`, { type: db.sequelize.QueryTypes.SELECT});
    if(!al.length){
      data["error"] = true;
      data["msg"] = `El Almacén ${ID} no existe!`;
      return res.status(404).json(data);
    }
    
    let almacen = await db.sequelize.query(`DELETE FROM almacen where id = ${ID};`, { type: db.sequelize.QueryTypes.DELETE});
    data["data"] = almacen;
    data["msg"] = "Almacén eliminado exitosamente!";
    res.json(data);
  } catch(e){
    console.dir(e);
    res.status(500).json(e);
  }


};