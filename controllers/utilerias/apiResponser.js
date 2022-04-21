const db = require('../../config/db.config.js');

let moment = require('moment');

const paginate = async (consulta, current_page, page_limit, sort_by, order/*, total_registros*/) => {
    try {

        return new Promise(async (resolve) => {

            var inicio  = 0;
            var cantidad_registros = page_limit;
            var currentPage = parseInt(current_page);

            if(current_page == 0){
                var currentPage = parseInt(current_page) + parseInt(1);
            }

            if(current_page > 1){
                inicio = (cantidad_registros * (current_page - 1));
                //inicio = (cantidad_registros * current_page) - page_limit;
                //cantidad_registros = cantidad_registros * current_page;
            }

            const pageLimit = parseInt(page_limit);

            const consultaFinal = await db.sequelize.query(`${consulta} order by ${sort_by} ${order} limit ${inicio}, ${page_limit};`, { type: db.sequelize.QueryTypes.SELECT});
            const count = await db.sequelize.query(`${consulta};`, { type: db.sequelize.QueryTypes.SELECT});
            const total_registros_busqueda = parseInt(count.length);
            const Arrdata = {
                previousPage: getPreviousPage(currentPage),
                currentPage: currentPage,
                nextPage: getNextPage(currentPage, pageLimit, total_registros_busqueda),
                total: total_registros_busqueda,
                limit: page_limit,
                data: consultaFinal
            }

            resolve(Arrdata);
        });

        
    } catch (error) {
        console.log(error);
    }
}

const getNextPage = (page, limit, total) => {
    if ((total/limit) > page) {
        return page + 1;
    }

    return null;
}

const getPreviousPage = (page) => {
    if (page <= 1) {
        return null
    }
    return page - 1;
}

const armarConsulta = async(table, array) => {
    return new Promise((resolve) =>{
    //armar consulta 
    //var consulta = `SELECT * FROM ${vhProductsToAssigns} WHERE analysis_cat_status_id=${estatus}`;
    let consulta = `SELECT * FROM ${table} WHERE`;
    let consultaTodo = `SELECT * FROM ${table}`;
    
    let and = "and";
    let cuentaConsulta = 0;
    if(array.length){
        array.map(value => {
             const {campo, valor} = value;
             const campoBusqueda = campo.toLowerCase();
             const valorBusuqeda = valor.toLowerCase();
             /*consulta = (cuentaConsulta == 0) ? `${consulta} ${campoBusqueda} = like lcase("%${valorBusuqeda}%")` : `${consulta} ${and} ${campoBusqueda}=like lcase("%${valorBusuqeda}%")`;  
             if(campo == "estatus"){
                consulta = (cuentaConsulta == 0) ? `${consulta} ${campo}="${valor}"` : `${consulta} ${and} ${campo}="${valor}"`; 
             }*/

             switch (campoBusqueda) {
                case 'estatus':
                    consulta = (cuentaConsulta == 0) ? `${consulta} ${campo}=${valor}` : `${consulta} ${and} ${campo}=${valor}`; 
                  break;
                case 'fecha_inicio':
                    const fecha_inicio = moment(valor).format("YYYY-MM-DD");
                   consulta = (cuentaConsulta == 0) ? `${consulta} DATE(created_at) BETWEEN '${fecha_inicio} 00:00:00'` : `${consulta} ${and} DATE(created_at) BETWEEN '${fecha_inicio} 00:00:00'`; 
                break;
                case 'fecha_fin':
                    const fecha_fin = moment(valor).format("YYYY-MM-DD");
                    consulta = `${consulta} AND '${fecha_fin} 23:59:59'`; 
                break;
                default:
                    consulta = (cuentaConsulta == 0) ? `${consulta} ${campoBusqueda} like lcase("%${valorBusuqeda}%")` : `${consulta} ${and} ${campoBusqueda} like lcase("%${valorBusuqeda}%")`; 
                
              }

             cuentaConsulta++;

             
        });

        resolve(consulta);
    } else {
        resolve(consultaTodo);
    }
    
    

    });
}


const validarCamposTabla = async(table, array) => {

    return new Promise((resolve) => {
        console.log("***array***");
        console.log(array);
        const newArray = [];
        let contador = 0;
        if(array.length){
            array.map(async value => {
                console.log("***value****");
                console.log(value);
                let existeCampo = await db.sequelize.query(`SELECT *
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE COLUMN_NAME = '${value.campo}' AND TABLE_NAME = '${table}';`, { type: db.sequelize.QueryTypes.SELECT});
                
                if(existeCampo){
                    newArray.push(value);
                }
                contador++;
                if(contador == array.length){
                    console.log("***newArray*****");
                    console.log(newArray);
                    //return newArray;
                    resolve(newArray);
                }
            });
        } else {
            resolve([]);
        }
        
    
    });


}


const validarFiltros = async(query) => {

    return new Promise((resolve) => {
        console.log("filtros-------------");

        console.log("query");
        console.log(query);
    
        //convertimos el objeto json a un array para poder acceder más facil a sus datos
        const array = []
        for (const [key, value] of Object.entries(query)) {
            array.push([`${key}`, `${value}`]);
        }
        //console.log("array");
        //console.log(array);
        
        //aramamos un nuevo array para poder acceder más facil a sus atributos
        const a2 = [];
        array.map( async value => {
            console.log("value");
            console.log(value[0]+" "+value[1]);
            a2.push({
                "campo":value[0],
                "valor":value[1]
            });
        });
    
        /**
         * Eliminamos del array los campos que no sean de busqueda
        */

        const a3 = a2.filter(v => v.campo !== "sort_by" && v.campo !== 'current_page' && v.campo !== 'page_limit' && v.campo !== 'order');
    
        console.log("a3....");
        console.log(a3);
        resolve(a3);
    });


}


const consulta = async (table, query = {}) => {
    try {

        //var sort_by = request.header('sort_by');
        //var search = request.header('search');
        let sort_by = (query.sort_by == "" || query.sort_by == undefined) ? "id" : query.sort_by;
        console.log("sort_by: ", sort_by);

        let current_page = (query.current_page == "" || query.current_page == undefined) ? 0 : query.current_page; //página actual
        console.log("current_page: ", current_page); 

        let page_limit = (query.page_limit == "" || query.page_limit == undefined) ? 10 : query.page_limit;  //pagina limite
        console.log("page_limit: ", page_limit);

        let order = (query.order == "" || query.order == undefined) ? "DESC" : query.order;  //pagina limite
        console.log("order: ", order);

        query.sort_by = sort_by;
        query.current_page = current_page;
        query.page_limit = page_limit;
        query.order = order;

        //Validar filtros de consulta a la tabla
        const getDataFilter = await validarFiltros(query); 
        console.log("getDataFilter");
        console.log(getDataFilter);
        console.log("end getDataFilter");

        //validar que los campos existan en la tabla
        const validarCamposConsulta = await validarCamposTabla(table, getDataFilter);
        console.log("validarCampos: ", validarCamposConsulta); 

        //armar consulta 
        console.log("***armar consulta ****");
        let crearConsulta = await armarConsulta(table, validarCamposConsulta);
        console.log(crearConsulta);
        console.log("***end armar consulta ****"); 

        /*const totalRegistros = await db.sequelize.query(`select count(*) as total from ${table};`, { type: db.sequelize.QueryTypes.SELECT});
        console.log(totalRegistros[0].total);*/

        //armar paginación ----
        const paginacion = await paginate(crearConsulta, current_page, page_limit, sort_by, order/*, totalRegistros[0].total*/);
        //console.log("***paginacion****");
        //console.log(paginacion); 
        //data["data"] = paginacion;

        return paginacion;

    } catch (error) {
        console.log(error);
    }
}




module.exports = {
    paginate,
    consulta
}
