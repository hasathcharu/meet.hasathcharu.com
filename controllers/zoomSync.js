const version = require('../utils/version').version;

exports.postZoomSync = (req, res, next) => {
    if(process.env.ZOOM_AUTH !== req.header('Authorization')){
        res.sendStatus(200);
    }
    const event = req.body.event;
    const topic = req.body.payload.object.topic;
    const id = req.body.payload.object.id;
    switch (event){
        case 'meeting.created':
            const password = new URL(req.body.payload.object.join_url).searchParams.get('pwd');
            console.log(password);
            break;
        case 'meeting.started':
            break;
        case 'meeting.ended':
            break;
        case 'meeting.deleted':
            break;
    }
    console.log(event,topic,id);

    res.sendStatus(200);
};