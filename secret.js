const crypto = require('crypto');
 
const secret = 'Programador FullStack Web';
const secret2 = 'Programador Blockchain web3 TOKEN DE REFRESCO';
 
const hash = crypto.createHmac('sha256',secret).update(secret2).digest("hex");
 
console.log(hash);