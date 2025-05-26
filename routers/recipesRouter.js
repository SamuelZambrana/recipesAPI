const express = require('express');
const router = express.Router();


const {
    addRecipe,
    getAllRecipe,
    getByIdRecipe,
    getRecentRecipe,
    getPopularRecipe
  

} = require('../controllers/recipesController');
//const { verifyToken }= require('../middlewares/auth');

router.post('/', addRecipe)
router.get('/', getAllRecipe);
router.get('/:idRecipes', getByIdRecipe);
router.get('/searchRecipes/recentRecipes', getRecentRecipe);
router.get('/searchRecipes/popularRecipes', getPopularRecipe);

module.exports = router;