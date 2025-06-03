const userModel = require('../models/userModel');
const recipeModel = require('../models/recipesModel')
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

const getFavoritesRecipes = async (req, res) => {
  try {
    
    const userId = req.payload._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: "Failed", message: "Usuario no encontrado" });
    }

    const favorites = await recipeModel.find({ _id: { $in: user.favoritesRecipes } });
    const favoritesCount = favorites.length;

    res.status(200).json({ status: "Success", count: favoritesCount, data: favorites });
  } catch (error) {
    console.error("Error obteniendo recetas favoritas:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const addFavouriteRecipes = async (req, res) => {
  try {
    const { idRecipes } = req.params;
    const idUser = req.payload._id;

    // Buscar usuario
    const user = await userModel.findById(idUser);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Buscar receta
    const recipe = await recipeModel.findById(idRecipes);
    if (!recipe) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    // Verificar si la receta ya está en favoritos
    if (user.favoritesRecipes.includes(idRecipes)) {
      return res.status(400).json({ message: "La receta ya está en favoritos" });
    }

    // Agregar receta a favoritos y guardar cambios
    user.favoritesRecipes.push(idRecipes);
    await user.save();

    res.status(200).json({ status: "Success", data: user });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

const removeFavouriteRecipe = async (req, res) => {
  try {
    const { idRecipes } = req.params;
    const idUser = req.payload._id;

    // Buscar usuario
    const user = await userModel.findById(idUser);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si la receta está en favoritos
    if (!user.favoritesRecipes.includes(idRecipes)) {
      return res.status(400).json({ message: "La receta no está en favoritos" });
    }

    // Eliminar la receta de favoritos y guardar cambios
    user.favoritesRecipes = user.favoritesRecipes.filter(recipe => recipe !== idRecipes);
    await user.save();

    res.status(200).json({ status: "Success", message: "Receta eliminada de favoritos", data: user });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

const addCommentRecipe = async (req, res) => {
  try {
    const idUser = req.payload._id;
    const { idRecipes } = req.params;
    const { comments } = req.body;

    // Buscar usuario
    const user = await userModel.findById(idUser);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Buscar receta
    const recipe = await recipeModel.findById(idRecipes);
    if (!recipe) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    // Validar que el comentario no esté vacío
    if (!comments || comments.trim() === "") {
      return res.status(400).json({ message: "El comentario no puede estar vacío" });
    }

    // Asegurarse de que la estructura del comentario sea correcta
    const newComment = {
      userId: idUser,
      comments: comments,
      createdAt: new Date()
    };

    recipe.comments.push(newComment);
    await recipe.save();

    res.status(201).json({
      status: "Success",
      message: "Comentario añadido correctamente",
      data: recipe.comments
    });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    // Verificar si el payload existe y tiene un ID válido
    if (!req.payload || !req.payload._id) {
      return res.status(400).json({ status: "Error", message: "ID de usuario no proporcionado" });
    }

    const idUser = req.payload._id;
    const updatedData = req.body;

    // Verificar que se haya enviado información para actualizar
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({ status: "Error", message: "No se enviaron datos para actualizar" });
    }

    // Actualizar el perfil del usuario en la base de datos
    const updatedUser = await userModel.findByIdAndUpdate(idUser, updatedData, { new: true }).populate({ path: "favoritesRecipes", select: "title description" });

    if (!updatedUser) {
      return res.status(404).json({ status: "Error", message: "Usuario no encontrado" });
    }

    res.status(200).json({ status: "Success", data: updatedUser });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};




module.exports = {
  addUser,
  getFavoritesRecipes,
  addFavouriteRecipes,
  removeFavouriteRecipe,
  addCommentRecipe,
  updateMyProfile
    
}