const jwt = require('jsonwebtoken');

module.exports =  (req, res, next) => {
    let data = {};

    //leer el token del header
    const token = req.header('x-auth-token');
    console.log("token: ", token);
    data["error"] = false;

    //revisar si no hay token
    if(!token){
        data["error"] = true;
        data["msg"] = "No hay Token, permiso no valido";
        return res.status(401).json(data);
    }

    //validar el token 
    try {
        const cifrado = jwt.verify(token, process.env.SECRET_JWT_SEED);
        req.usuario = cifrado.usuario;
        console.log("req.usuario: ", req.usuario);
        next();
    } catch(err){
        data["error"] = true;
        data["msg"] = "Token no valido";
        return res.status(401).json(data);
    }
}