
const db = require('../../config/db.config.js');
let _ = require('lodash');
const moment = require('moment');

exports.findAll = async (req, res) => {
  console.log(req.usuario);

  let data = {};
  data["error"] = false;
  try {

    console.log("query params");
    console.log(req.query);

    //extraer datos
    let {fecha, fechaFin, tipo} = req.query;
    let anio = moment(fecha).format("YYYY")
    let mes = moment(fecha).format("MM")
    let dia = moment(fecha).format("DD")
   
    fechaFin = (tipo == "periodo") ? fechaFin = null : fechaFin = `'${fechaFin}'`;

    console.log("anio: ", anio);
    console.log("mes: ", mes);
    console.log("dia: ", dia);

    console.log("fechaFin: ", fechaFin);

    /**Totales de pedidos */
    const result = await db.sequelize.query(`CALL obtenerPedidosporFecha('${anio}', '${mes}', '${dia}', ${fechaFin}, '${tipo}');`, { type: db.sequelize.QueryTypes.SELECT});

    //se manda el total de pedidos para armar una grafica
    const totalPedidos = await db.sequelize.query(`CALL obtenerPedidos();`, { type: db.sequelize.QueryTypes.SELECT});

    //Armar inventario por producto
    const producto = await db.sequelize.query(`SELECT id, clave FROM producto where estatus = 1 order by id desc;`, { type: db.sequelize.QueryTypes.SELECT});

     const productoTotales = [];
     let contador = 0;
     producto.forEach(async (value) =>{
      //console.log("value: ");
      //console.log(value);
      const i_v = await db.sequelize.query(`select sum(cantidad) as cantidadProductoInventario from inventario_detalle where producto_id = ${value.id};`, { type: db.sequelize.QueryTypes.SELECT});
      console.log("i_v");
      console.log(i_v[0].cantidadProductoInventario);
      let totalEnInventario = i_v[0].cantidadProductoInventario;
      productoTotales.push({
        ...value,
        totalEnInventario
      });

      contador++;

      if(contador == producto.length){
        console.log("productoTotales: ", productoTotales);
        await terminar();
      }


    });


    terminar = async () => {
      data["data"] = result[0][0];
      data["total"] = totalPedidos[0][0];  
      data["productoTotales"] =  _.orderBy(productoTotales, ['totalEnInventario', 'clave'], ['desc', 'asc']);
      res.status(200).json(data);
    }
    

    /*console.log("---result----");
    console.log(result);
    console.log("------------------");
    console.log(result[0]);
    console.log("------------------");
    console.log(result[0][0]);*/

    
  } catch(e){
    console.dir(e);
    res.status(500).send(e);
  }

};

/*
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
*/

