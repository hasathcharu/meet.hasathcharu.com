const path = require('path');

const express = require('express');

const joinController = require('../controllers/join');

const router = express.Router();

// "/"
router.get('/:linkUrl', joinController.getLink);

module.exports = router;