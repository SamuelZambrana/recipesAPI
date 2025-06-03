const recipeModel = require('../models/recipesModel');
const userModel = require('../models/userModel')
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

const addRecipes = async (req, res) => {
  try {
    const idUser = req.payload._id;

    // Buscar usuario
    const user = await userModel.findById(idUser);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario es administrador
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado: Solo los administradores pueden agregar recetas" });
    }

    const { title, description, ingredients, category, imageURL } = req.body;

    // Validar que los datos sean correctos
    if (!title || !description || !ingredients || !category || !imageURL) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Crear nueva receta
    const newRecipe = new recipeModel({
      title,
      description,
      ingredients,
      category,
      imageURL,
      createdBy: idUser
    });

    await newRecipe.save();

    res.status(201).json({
      status: "Success",
      message: "Receta creada exitosamente",
      data: newRecipe
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
};

const updateRecipes = async (req, res) => {
  try {
    const idUser = req.payload._id;
    const { idRecipes } = req.params;
    const { title, description, ingredients, category, imageURL } = req.body;

    // Buscar usuario
    const user = await userModel.findById(idUser);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Buscar la receta existente
    const recipe = await recipeModel.findById(idRecipes);
    if (!recipe) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    // Actualizar la receta con los datos proporcionados
    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.category = category || recipe.category;
    recipe.imageURL = imageURL || recipe.imageURL;

    await recipe.save();

    res.status(200).json({
      status: "Success",
      message: "Receta actualizada correctamente",
      data: recipe
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
};

const removeRecipes = async (req, res) => {
  try {
    const idUser = req.payload._id;
    const { idRecipes } = req.params;

    // Buscar usuario
    const user = await userModel.findById(idUser);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Buscar y eliminar la receta
    const recipe = await recipeModel.findByIdAndDelete(idRecipes);
    if (!recipe) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    res.status(200).json({
      status: "Success",
      message: "Receta eliminada correctamente",
      data: recipe
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
};

module.exports = {
    addRecipe,
    getAllRecipe,
    getByIdRecipe,
    getRecentRecipe,
    getPopularRecipe,
    addRecipes,
    updateRecipes,
    removeRecipes
}