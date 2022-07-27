const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();


router.get('*',adminController.getCheckAuth);

router.post('*',adminController.postCheckAuth);

router.get('/',adminController.getHome);

router.get('/approve',adminController.getUnapprovedUsers);

router.get('/users',adminController.getApprovedUsers);

router.get('/users/edit/:user_id',adminController.getEditUser);

router.post('/users/edit/:user_id',adminController.postEditUser);

router.get('/users/change-password/:user_id',adminController.getChangeUserPassword);

router.post('/users/change-password/:user_id',adminController.postChangeUserPassword);

router.get('/users/delete/:user_id',adminController.getDeleteUser);

router.post('/users/delete/:user_id',adminController.postDeleteUser);

router.post('/approve-user',adminController.postApproveUser);

module.exports = router;