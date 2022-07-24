const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/edit',userController.getEditProfile);

router.post('/edit',userController.postEditProfile);


router.get('/profile',userController.getProfile);

router.post('/sign-up',userController.postSignUp);

module.exports = router;