const mongoose = require("mongoose");
// Nos traemos todos los esquemas y lo guardamos en la cosntante
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  comments: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const recipeSchema = new Schema({
  title: {
    type: String,
    required: [true, "El titulo es obligatorio"],
  },
  description: {
    type: String,
    required: [true, "La descripcion es obligatorio"],
  },
  ingredients: {
    type: [String],
    required: [true, "Los ingredientes son obligatorio"],
  },
  category: {
    type: [String],
    required: [true, "La categoría es obligatoria"],
  },
  imageURL: {
    type: String,
    required: [true, "La imagen es obligatorio"],
  },
  likes: {
    type: [ mongoose.Schema.Types.ObjectId ],
    ref: "User",
  },
  creationDate: {
       type: Date,
       default: Date.now,
    },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" } // Nueva referencia
});

 
const recipesModel = mongoose.model("Recipes", recipeSchema, "recipes");
 
module.exports = recipesModel;