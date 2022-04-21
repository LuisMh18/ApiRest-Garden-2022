
const db = require('../../config/db.config.js');
const  apiResponser = require('../utilerias/apiResponser');


exports.findAll = async (req, res) => {

  let data = {};
  data["error"] = false;
  try {
    const table = "vh_inventario";
    const result = await apiResponser.consulta(table, req.query);
    data["data"] = result;
    res.status(200).json(data);
  } catch(e){
    console.dir(e);
    res.status(500).json(e);
  }

};


exports.getDataAll = async (req, res) => {
  console.log(req.usuario);
  console.log("getDataAll");
  const table = "vh_inventario";
  const result = await db.sequelize.query(`SELECT id, clave, nombre, cantidad, num_pedimento, created_at FROM ${table} order by id desc;`, { type: db.sequelize.QueryTypes.SELECT});
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





