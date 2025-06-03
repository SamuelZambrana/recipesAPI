const express = require('express');
const router = express.Router();
const {

    login,
    getTokens,
    signup

} = require('../controllers/loginController');
const { verifyToken, verifyAdmin }= require('../middlewares/auth');


router.post('/login', login);
router.get('/refresh_token', verifyToken, getTokens)
router.post('/signup', signup);

module.exports = router;