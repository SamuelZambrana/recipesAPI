const mongoose = require("mongoose");

// Nos traemos todos los esquemas y lo guardamos en la cosntante
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: [true, "El correo ya existe"],
  },
  password: {
    type: String,
    required: [true, "El password es obligatorio"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  favoritesRecipes: {
    type: [ mongoose.Schema.Types.ObjectId ],
    ref: "Recipes",
  },
   createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" } // Nueva referencia
 
});

userSchema.pre(/^find/, function(next) {
    
    this.select('-password');
    next();
  });
 
const userModel = mongoose.model("User", userSchema, "user");
 
module.exports = userModel;