const jwt = require('jsonwebtoken');

const generarJWT = (idUser, rol) => {

    console.log("idUser...: ", idUser);

     //Crear y firmar el JWT
     const payload = {
        usuario: {
          id: idUser,
          rol:rol
        }
      }; 
  
      //console.log("process: ", process);
      //console.log("process.env: ", process.env);
      console.log("process.env.SECRETA: ", process.env.SECRET_JWT_SEED);
      console.log("payload: ", payload);

      //firmar el JWT
      return new Promise((resolve, reject) => {

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn:3600 //1 hora para que expire el token
          }, (error, token) => {
              if(error) {
                    console.log(error);
                    reject(error);
              } else {
                //data["token"] = token;
                resolve(token);
              }
              
          });

      });
  
      
      


}


module.exports = {
    generarJWT
}