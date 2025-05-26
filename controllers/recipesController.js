const recipeModel = require('../models/recipesModel');
const mongoose = require('mongoose');

const addRecipe = async (req, res) => {
    try {
      const newRecipe = req.body;
      await recipeModel.create(newRecipe)
      res.status(200).send("La Receta se ha añadido correctamente");
    } catch (error) {
      res.status(500).send({ status:"Failed", error: error.message })
    }
};


const getAllRecipe = async (req, res) => {
    try {
      const recipes = await recipeModel.find();
      console.log('Recipes fetched:', recipes.length);
      if(!recipes){
        return res.status(200).send("No hay Recetas");
      }
      
      // Asegurar que cada receta tenga la propiedad 'likes' y devolver su longitud correctamente
      const formattedRecipes = recipes.map(recipe => ({
        ...recipe.toObject(), // Convertir a objeto plano para evitar problemas con mongoose
        likes: recipe.likes ? recipe.likes.length : 0
        }));

      res.status(200).send(formattedRecipes)
    } catch (error) {
      res.status(500).send({ status: "Failed", error: error.message });
    }
};

const getByIdRecipe = async (req, res) => {
    try {
      const { idRecipes } = req.params;
      const recipes = await recipeModel.findById(idRecipes);
      console.log('Recipe fetched:', recipes);
      if(!recipes){
        return res.status(200).send("No hay Recetas");
      }
      
      res.status(200).send(recipes)
    } catch (error) {
      res.status(500).send({ status: "Failed", error: error.message });
    }
};

const getRecentRecipe = async (req, res) => {
  try {
    const recentRecipes = await recipeModel.find()
      .sort({ creationDate: -1 }) // Asegurar que creationDate existe
      .limit(5); 

    console.log('Recent Recipes fetched:', recentRecipes.length);

    // Verificar si hay recetas antes de enviarlas
    if (!recentRecipes || recentRecipes.length === 0) {
      return res.status(200).json({ message: "No hay Recetas" });
    }

    res.status(200).json(recentRecipes);
  } catch (error) {
    console.error("Error fetching recent recipes:", error);

    // Agregar más información sobre el error para depuración
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const getPopularRecipe = async (req, res) => {
  try {
    const popularRecipes = await recipeModel.find()
      .sort({ likes: -1 }) // Asegurar que creationDate existe
      .limit(5); 

    console.log('Popular Recipes fetched:', popularRecipes.length);

    // Verificar si hay recetas antes de enviarlas
    if (!popularRecipes || popularRecipes.length === 0) {
      return res.status(200).json({ message: "No hay Recetas" });
    }

    res.status(200).json(popularRecipes);
  } catch (error) {
    console.error("Error fetching popular recipes:", error);

    // Agregar más información sobre el error para depuración
    res.status(500).json({ status: "Failed", error: error.message });
  }
};


module.exports = {
    addRecipe,
    getAllRecipe,
    getByIdRecipe,
    getRecentRecipe,
    getPopularRecipe
    
}