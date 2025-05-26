const jwt = require('jsonwebtoken');

const generateToken = (payload, isRefreshToken) => {
  if (isRefreshToken) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: "60min",
    });
  }
 
  return jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: "15min",
  });
};
 
module.exports = generateToken;