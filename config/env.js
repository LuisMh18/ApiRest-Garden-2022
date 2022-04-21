

const env = {
    database: 'garden',
    username: 'root',
    password: 'LuisMh181093',
    host: '127.0.0.1',
    dialect: 'mysql',
    pool: {
        //max: 30,
        //min: 0,
        //acquire: 30000,
        //idle: 10000
        max: 500,
        min: 0,
        acquire: 9000000,
        idle: 10000
    }
};

module.exports = env;
