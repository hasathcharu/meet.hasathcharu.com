const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/sign-up',userController.postSignUp);

router.get('*',userController.getCheckAuth);

router.post('*',userController.postCheckAuth);

router.get('/',userController.getUser);

router.get('/edit',userController.getEditProfile);

router.post('/edit',userController.postEditProfile);

router.get('/change-password',userController.getChangePassword);

router.post('/change-password',userController.postChangePassword);

router.get('/delete',userController.getDeleteAccount);

router.post('/delete',userController.postDeleteAccount);

router.get('/profile',userController.getProfile);


module.exports = router;