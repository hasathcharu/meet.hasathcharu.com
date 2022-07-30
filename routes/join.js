const path = require('path');

const express = require('express');

const joinController = require('../controllers/join');

const router = express.Router();

// "/"
router.get('/j/:linkUrl', joinController.getZoomLink);

router.get('/o/:linkUrl', joinController.getZoomEndedLink);


module.exports = router;