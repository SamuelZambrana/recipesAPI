const jwt = require("jsonwebtoken");
 
const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Acceso denegado");
    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN);
      console.log(payload)
      req.payload = payload;
      next();
    } catch (error) {
      try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN);
        req.payload = payload;
        next();
      } catch (error) {
        res.status(401).send({ status: "Token expired", error: error.message });
      }
    }
};

const verifyAdmin = (req, res, next) => {
    try{
       const role = req.payload.role;
        // Verificar si el usuario tiene rol de administrador
        if (role === "user") {
            return res.status(200).json({ message: "No eres usuario administrador." });
        }
        // Si no es administrador, continuar con el siguiente middleware
        next();
    } catch (error) {
        res.status(401).send({ status: "No tienes rol de usuario administrador", error: error.message });
    }
};

 
module.exports = {
    verifyToken,
    verifyAdmin
};
   
