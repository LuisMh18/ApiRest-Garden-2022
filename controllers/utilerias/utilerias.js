const Sequelize = require('sequelize');
const db = require('../../config/db.config.js');
let moment = require('moment');

const obtenerFechaActual = async () => {
  return new Promise((resolve, reyect) => {
    let d = new Date();
    let fechaHora = moment(d).format("YYYY-MM-DD HH:mm:ss");
    resolve(fechaHora);
  });

};

/*
const validarRol = (rol, res, next) => {
//const validarRol = (rol) => {

console.log("****req****");
console.log(rol);
  /*
   * Roles de usuarios -----------
   * 1 Cliente
   * 2 Agente
   * 3 Administrador
  */
/*
    return new Promise((resolve, reject) => {

      try {
          if(rol === 1 || rol === 2){
              return resolve("No tienes permisos de administrador.");
          } 
        } catch(e){
          console.dir(e);
          reject(error);
        }

    });



}*/


module.exports = {
    obtenerFechaActual,
    //validarRol
}
