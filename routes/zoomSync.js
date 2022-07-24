const path = require('path');

const express = require('express');

const zoomSyncController = require('../controllers/zoomSync');

const router = express.Router();



router.post('/api',zoomSyncController.postZoomSync);

router.post('/link-data',zoomSyncController.postLinkData);

router.post('/set-url',zoomSyncController.postSetUrl);

router.post('/other-live',zoomSyncController.postAnyOtherMeetingLive);

module.exports = router;