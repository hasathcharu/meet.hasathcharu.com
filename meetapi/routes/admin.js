const express = require('express');

const {body} = require('express-validator');

const adminController = require('../controllers/admin');

const router = express.Router();


router.use('*',adminController.checkAuth);

router.get('/summary',adminController.getSystemSummary);

router.get('/get-unapproved',adminController.getUnapprovedUsers);

router.get('/users',adminController.getApprovedUsers);

router.get('/zoom-links',adminController.getZoomLinks);

router.get('/users/get-user/:user_id',adminController.getUser);

router.put('/users/edit/',[
    body('user_id').trim().notEmpty().isNumeric(),
    body('fname').trim().isLength({min:0,max:30}),
    body('lname').trim().isLength({min:0,max:30}),
    body('email').trim().isEmail()
],adminController.putEditUser);

router.put('/users/change-password/',[
    body('user_id').trim().notEmpty().isNumeric(),
    body('password').trim().isStrongPassword({ minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 1, minSymbols: 0, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }),
],adminController.putChangeUserPassword);

router.delete('/users/delete/',[
    body('user_id').trim().notEmpty().isNumeric(),
],adminController.deleteUser);

router.put('/approve-user',[
    body('user_id').trim().notEmpty().isNumeric(),
    body('approve').trim().notEmpty().isNumeric(),
],adminController.putApproveUser);

router.get('/users/assigned/:user_id',adminController.getAssignedLinks);

router.get('/users/unassigned/:user_id',adminController.getUnassignedLinks);

router.post('/users/assign',[
    body('user_id').trim().notEmpty().isNumeric(),
    body('link_id').trim().notEmpty().isNumeric(),
],adminController.postAssignLink);

router.delete('/users/unassign',[
    body('user_id').trim().notEmpty().isNumeric(),
    body('link_id').trim().notEmpty().isNumeric(),
],adminController.deleteUnassignLink);

router.put('/zoom-links/save-url',[
    body('link_id').trim().notEmpty().isNumeric(),
    body('url').trim().notEmpty(),
],adminController.putSaveZoomURL);

router.get('/zoom-links/unassigned/:link_id',adminController.getUnassignedUsers);

router.get('/zoom-links/assigned/:link_id',adminController.getAssignedUsers);

router.delete('/zoom-links/unassign',[
    body('user_id').trim().notEmpty().isNumeric(),
    body('link_id').trim().notEmpty().isNumeric(),
],adminController.deleteUnassignUser);

router.post('/zoom-links/assign',[
    body('user_id').trim().notEmpty().isNumeric(),
    body('link_id').trim().notEmpty().isNumeric(),
],adminController.postAssignUser);

module.exports = router;