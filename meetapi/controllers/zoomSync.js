const version = require('../utils/version').version;
const ZoomLink = require('../models/zoomLink');

exports.postZoomSync = (req, res, next) => {
  const crypto = require('crypto');

  const message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(
    req.body
  )}`;
  const hashForVerify = crypto
    .createHmac('sha256', process.env.ZOOM_AUTH)
    .update(message)
    .digest('hex');
  const signature = `v0=${hashForVerify}`;
  if (!req.headers['x-zm-signature'] === signature) {
    return res.sendStatus(401);
  }
  if (req.body.event === 'endpoint.url_validation') {
    const hashForValidate = crypto
      .createHmac('sha256', process.env.ZOOM_AUTH)
      .update(req.body.payload.plainToken)
      .digest('hex');

    res.status(200);
    res.json({
      plainToken: req.body.payload.plainToken,
      encryptedToken: hashForValidate,
    });
  }

  const event = req.body.event;
  const link = new ZoomLink(req.body.payload.object.id);
  link.setTopic(req.body.payload.object.topic);
  switch (event) {
    case 'meeting.created':
      let password = new URL(req.body.payload.object.join_url).searchParams.get(
        'pwd'
      );
      link.setPwd(password);
      link.save();
      break;
    case 'meeting.started':
      link.setStatus(1);
      link.saveStatus();
      break;
    case 'meeting.ended':
      link.setStatus(0);
      link.saveStatus();
      break;
    case 'meeting.deleted':
      link.delete();
      break;
    case 'meeting.updated':
      link.save(1);
      break;
  }
  res.sendStatus(200);
};

exports.getLinkData = async (req, res, next) => {
  const url = req.params.url;
  const linkData = await ZoomLink.findByUrl(url);

  if (linkData == 'Fail') return res.status(500).json({ message: 'Fail' });

  if (linkData == 'No URL') return res.status(404).json({ message: 'No URL' });

  const otherData = await linkData.anyOtherMeetingLive();
  if (otherData == 'Fail') return res.status(500).json({ message: 'Fail' });

  linkData['other'] = otherData;
  res.status(200).json({ message: 'Success', link: linkData });
};
