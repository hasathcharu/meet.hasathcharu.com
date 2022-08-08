const {body} = require('express-validator');
const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/login',
[
    body('email').trim().isEmail(),
    body('password').trim().notEmpty()
],authController.postLogin);


module.exports = router;