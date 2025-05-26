const userModel = require('../models/userModel')
const bcrypt = require('bcrypt');

const addUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const newUser = {
          name,
          email,
          password: await bcrypt.hash(password, 10)
      }
      await userModel.create(newUser);
      console.log('User added:', newUser);
      res.status(200).send("El Usuario se ha añadido correctamente");
    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
}



module.exports = {
  addUser
    
}