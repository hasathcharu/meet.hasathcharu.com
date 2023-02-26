const path = require('path');

const { body } = require('express-validator');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post(
  '/sign-up',
  [
    body('fname').trim().isLength({ min: 0, max: 30 }),
    body('lname').trim().isLength({ min: 0, max: 30 }),
    body('password').trim().isStrongPassword({
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    }),
    body('email').trim().isEmail(),
  ],
  userController.postSignUp
);

router.use('*', userController.checkAuth);

router.post('/first-time', userController.postRemoveFirstTime);

router.use('*', userController.checkFirstTime);

router.get('/', userController.getUser);

router.get('/meeting-status', userController.getMeetingStatus);

router.put(
  '/edit',
  [
    body('fname').trim().isLength({ min: 0, max: 30 }),
    body('lname').trim().isLength({ min: 0, max: 30 }),
    body('email').trim().isEmail(),
  ],
  userController.putEditProfile
);

router.put(
  '/change-password',
  [
    body('opassword').trim().notEmpty(),
    body('password').trim().isStrongPassword({
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    }),
  ],
  userController.putChangePassword
);

router.delete(
  '/delete',
  [body('password').trim().notEmpty()],
  userController.deleteAccount
);

router.post(
  '/assign',
  [body('link_id').trim().notEmpty()],
  userController.postAssignLink
);

router.delete(
  '/unassign',
  [body('link_id').trim().notEmpty()],
  userController.deleteUnassignLink
);

router.put(
  '/set-theme',
  [body('theme').trim().notEmpty()],
  userController.putSetTheme
);

module.exports = router;
