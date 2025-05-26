const express = require('express');
const router = express.Router();
const {

    addUser

} = require('../controllers/userController');
//const { verifyToken, verifyAdmin }= require('../middlewares/auth');


router.post('/', addUser)


module.exports = router;