const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();


router.get('*',adminController.getCheckAuth);

router.post('*',adminController.postCheckAuth);

router.get('/',adminController.getHome);

router.get('/approve',adminController.getUnapprovedUsers);

router.get('/users',adminController.getApprovedUsers);

router.get('/zoom-links',adminController.getZoomLinks);

router.get('/users/edit/:user_id',adminController.getEditUser);

router.post('/users/edit/:user_id',adminController.postEditUser);

router.get('/users/change-password/:user_id',adminController.getChangeUserPassword);

router.post('/users/change-password/:user_id',adminController.postChangeUserPassword);

router.get('/users/delete/:user_id',adminController.getDeleteUser);

router.post('/users/delete/:user_id',adminController.postDeleteUser);

router.post('/approve-user',adminController.postApproveUser);

router.post('/users/assigned',adminController.postAssignedLinks);

router.post('/users/unassign',adminController.postUnassignLink);

router.post('/users/assign',adminController.postAssignLink);

router.post('/users/unassigned',adminController.postUnassignedLinks);

router.post('/zoom-links/save-url',adminController.postSaveZoomURL);

router.post('/zoom-links/unassigned',adminController.postUnassignedUsers);

router.post('/zoom-links/unassign',adminController.postUnassignUser);

router.post('/zoom-links/assigned',adminController.postAssignedUsers);

router.post('/zoom-links/assign',adminController.postAssignUser);

module.exports = router;