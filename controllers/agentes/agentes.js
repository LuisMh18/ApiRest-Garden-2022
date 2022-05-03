
const db = require('../../config/db.config.js');
const  apiResponser = require('../utilerias/apiResponser');
let _ = require('lodash');

exports.findAll = async (req, res) => {
  console.log(req.usuario);

  let data = {};
  data["error"] = false;
  try {

    /* validación - Si el rol es diferente a 3 (Administrador) se va a mandar un paramtro
    en automatico con el id del agente para que solo se obtengan los pedidos que se le
    asignaron a este agente, en caso de que sea el administrador se mandan todos */
    if(req.usuario.rol !== 3){
      req.query['agente_id'] = req.usuario.id;
    }

    const table = "vh_pedido_cliente";
    const result = await apiResponser.consulta(table, req.query);

    console.log("result");
    console.log(result);

    const totalSumaPedidos = _.sumBy(result.data, 'total');
    //console.log("totalSumaPedidos: ", totalSumaPedidos);
    data["data"] = result;
    data["totalSumaPedidos"] = totalSumaPedidos;
    res.status(200).json(data);
  } catch(e){
    console.dir(e);
    res.status(500).send(e);
  }

};



exports.getDataAll = async (req, res) => {
  console.log(req.usuario);
  console.log("getDataAll");
  const table = "vh_pedido_cliente";

  let data = {};
  data["error"] = false;
  try {
    let consulta = `SELECT * FROM ${table}`;
    if(req.usuario.rol !== 3){
      consulta = `${consulta} where agente_id = ${req.usuario.id}`;
    }
  
    const result = await db.sequelize.query(`${consulta} order by id desc;`, { type: db.sequelize.QueryTypes.SELECT});
    data["data"] = result;
    res.status(200).json(data);
  } catch(e){
    console.dir(e);
    res.status(500).send(e);
  }

};




