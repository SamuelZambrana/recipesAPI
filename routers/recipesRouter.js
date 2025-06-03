const express = require('express');
const router = express.Router();


const {
    addRecipe,
    getAllRecipe,
    getByIdRecipe,
    getRecentRecipe,
    getPopularRecipe,
    addRecipes,
    updateRecipes,
    removeRecipes
  

} = require('../controllers/recipesController');
const { verifyToken, verifyAdmin }= require('../middlewares/auth');

router.post('/', addRecipe)
router.get('/', getAllRecipe);
router.get('/:idRecipes', getByIdRecipe);
router.get('/searchRecipes/recentRecipes', getRecentRecipe);
router.get('/searchRecipes/popularRecipes', getPopularRecipe);
router.post('/addRecipes/recipe',verifyToken, verifyAdmin, addRecipes);
router.patch('/updateRecipes/:idRecipes',verifyToken, verifyAdmin, updateRecipes);
router.delete('/removeRecipes/:idRecipes',verifyToken, verifyAdmin, removeRecipes);


module.exports = router;