const express = require('express');
const router = express.Router();
const {

    login

} = require('../controllers/loginController');
//const { verifyToken, verifyAdmin }= require('../middlewares/auth');


router.post('/login', login);


module.exports = router;