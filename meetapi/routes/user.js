const path = require('path');

const {body} = require('express-validator');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/sign-up',
[
    body('fname').trim().isLength({min:0,max:30}),
    body('lname').trim().isLength({min:0,max:30}),
    body('password').trim().isStrongPassword({ minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 1, minSymbols: 0, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }),
    body('email').trim().isEmail()
],userController.postSignUp);//tested

router.use('*',userController.checkAuth);//tested

router.get('/',userController.getUser);//tested

router.get('/meeting-status',userController.getMeetingStatus);//tested

router.put('/edit',[
    body('fname').trim().isLength({min:0,max:30}),
    body('lname').trim().isLength({min:0,max:30}),
    body('email').trim().isEmail()
],userController.putEditProfile);//tested


router.put('/change-password',[
    body('opassword').trim().notEmpty(),
    body('password').trim().isStrongPassword({ minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 1, minSymbols: 0, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }),
],userController.putChangePassword);//tested

router.delete('/delete',[
    body('password').trim().notEmpty(),
],userController.deleteAccount);//tested

router.post('/assign',[
    body('link_id').trim().notEmpty(),
],userController.postAssignLink);//tested

router.delete('/unassign',[
    body('link_id').trim().notEmpty(),
],userController.deleteUnassignLink);//tested

router.put('/set-theme',[
    body('theme').trim().notEmpty(),
],userController.putSetTheme);//testing


module.exports = router;