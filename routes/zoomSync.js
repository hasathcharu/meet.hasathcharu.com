const path = require('path');

const express = require('express');

const zoomSyncController = require('../controllers/zoomSync');

const router = express.Router();



router.post('/',zoomSyncController.postZoomSync);

module.exports = router;