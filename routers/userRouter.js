const express = require('express');
const router = express.Router();
const {

    addUser,
    getFavoritesRecipes,
    addFavouriteRecipes,
    removeFavouriteRecipe,
    addCommentRecipe,
    updateMyProfile

} = require('../controllers/userController');
const { verifyToken, verifyAdmin }= require('../middlewares/auth');


router.post('/', addUser);
router.get('/searchUser/favorites',verifyToken, getFavoritesRecipes);
router.patch('/addFavourites/:idRecipes', verifyToken, addFavouriteRecipes);
router.patch('/removefavourites/:idRecipes', verifyToken, removeFavouriteRecipe);
router.post('/:idRecipes/addComments/:idUser', verifyToken, addCommentRecipe)
router.patch('/myProfile', verifyToken, verifyAdmin, updateMyProfile);



module.exports = router;