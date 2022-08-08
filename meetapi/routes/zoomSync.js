const path = require('path');

const express = require('express');

const zoomSyncController = require('../controllers/zoomSync');

const router = express.Router();



router.post('/api',zoomSyncController.postZoomSync);

router.get('/link-data/:url',zoomSyncController.getLinkData);

module.exports = router;