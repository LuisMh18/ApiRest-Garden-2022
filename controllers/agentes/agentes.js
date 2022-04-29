
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

/*
exports.findAll = async (req, res) => {
  let data = {};
  data["error"] = false;

  //extraer datos
  const {clave, categoria} = req.query;
  console.log("clave: ", clave);
  console.log("categoria: ", categoria);

  try {
    const table = "vh_producto_detail";
    let consulta = `SELECT * FROM ${table}`
    let and = "and";
    let cuentaConsulta = 0;

    if(clave !== "" && clave !== undefined){
        consulta = (cuentaConsulta == 0) ? `${consulta} WHERE UPPER(clave) LIKE '%${clave.toUpperCase()}%'` : `${consulta} ${and} UPPER(clave) LIKE '%${clave.toUpperCase()}%'`;  
        cuentaConsulta = 1;
    }

    if(categoria !== "" && categoria !== undefined){
      consulta = (cuentaConsulta == 0) ? `${consulta} WHERE idCategoria=${categoria}` : `${consulta} ${and} idCategoria=${categoria}`;  
      cuentaConsulta = 1;
  }

    const result = await db.sequelize.query(`${consulta};`, { type: db.sequelize.QueryTypes.SELECT});
    const categorias = await db.sequelize.query(`select * from categoria order by categoria asc;;`, { type: db.sequelize.QueryTypes.SELECT});
    data["data"] = result;
    data["categorias"] = categorias;
    res.status(200).json(data);
  } catch(e){
    console.dir(e);
    res.status(500).json(e);
  }

};*/

/*
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
*/




