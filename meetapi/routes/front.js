const path = require('path');

const express = require('express');

const frontController = require('../controllers/front');

const router = express.Router();

// "/"
router.get('/', frontController.getLogIn);

router.get('/sign-up', frontController.getSignUp);


module.exports = router;