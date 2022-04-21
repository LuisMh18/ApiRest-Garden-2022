
const db = require('../../config/db.config.js');

exports.findAll = async (req, res) => {
  let data = {};
  data["error"] = false;
  try {

    console.log("start menu");
    let m = await db.sequelize.query(`select * from menu order by orden asc;`, { type: db.sequelize.QueryTypes.SELECT});
    console.log(m);
    console.log("end menu");

    console.log("start submenu");
    let submenu = await db.sequelize.query(`select * from submenu order by id asc;`, { type: db.sequelize.QueryTypes.SELECT});
    console.log(submenu);
    console.log("end submenu");

    const arrMneu = [];

    terminar = (menu) => {
      data["data"] = menu;
      res.status(200).json(data);
    }

    let cont1 = 0;
    const menuS = m.map(element => {
      let idMenu = element.id;
      let cont2 = 0;
      let arrSubmenu = [];
      submenu.map(value => {
        if(value.menu_id == idMenu){
          arrSubmenu.push({
            id:value.id,
            nombre:value.nombre,
            ruta:value.ruta,
            icono:value.icono,
          });
        }

        cont2++;
        if(cont2 == submenu.length){
          console.log("son iguales");
          console.log("arrSubmenu: ", arrSubmenu);
          console.log("value: ", value);
          arrMneu.push({
            ...element,
            arrSubmenu
          });
          cont1++;
          if(cont1 == m.length){
            console.log("arrMneu: ", arrMneu);
            terminar(arrMneu);
          }
        }

      });
    });    
    
  } catch(e){
    console.dir(e);
    res.status(500).json(e);
  }

};

