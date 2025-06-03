const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/auth.token');
const { sendEmail } = require('../service/email.Services');

 
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = {
            name,
            email,
            password: await bcrypt.hash(password, 10)
        }
        await userModel.create(newUser);

        const to = email;
        const subject = 'Bienvenido a nuestra App';
        const html = `<h3>Hola ${name}, gracias por registrarte en nuestra aplicacion</h3>`

        await sendEmail(to, subject, html)
        res.status(200).send({status: "Success", data: newUser});
    } catch (error) {
      res.status(500).send({ status: "Failed", error: error.message });
    }
}

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel
        .findOne({ email: email })
        .select("name email password role");
  
      if (!user) {
        return res.status(404).send("Usuario o contraseña no validos");
      }
   
      const validatePassword = await bcrypt.compare(password, user.password);
      if (!validatePassword) {
        return res.status(404).send("Usuario o contraseña no validos");
      }
  
      const payload = {
        _id: user._id,
        name: user.name,
        role: user.role
      }
   
      const token = generateToken(payload, false);
      const token_refresh = generateToken(payload, true)
   
      res.status(200).send({ status: "Success", data: user, token: token, token_refresh });
    } catch (error) {
      res.status(500).send({ status: "Failed", error: error.message });
    }
  };


  const getTokens = async (req, res) => {
    try {
      const payload = {
        _id: req.payload._id,
        name: req.payload.name,
        role: req.payload.role,
      };
      const token = generateToken(payload, false);
      const token_refresh = generateToken(payload, true);
      res.status(200).send({ status: "Success", token, token_refresh });
    } catch (error) {
      res.status(500).send({ status: "Failed", error: error.message });
    }
  };


  module.exports = {
    login,
    getTokens,
    signup
      
  }