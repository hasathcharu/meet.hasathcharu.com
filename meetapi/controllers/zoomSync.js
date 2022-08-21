const version = require('../utils/version').version;
const ZoomLink = require('../models/zoomLink');

exports.postZoomSync = (req, res, next) => {
    if(process.env.ZOOM_AUTH !== req.header('Authorization')){
        return res.sendStatus(401);
    }
    const event = req.body.event;
    const link = new ZoomLink(req.body.payload.object.id);            
    link.setTopic(req.body.payload.object.topic);
    switch (event){
        case 'meeting.created':
            let password = new URL(req.body.payload.object.join_url).searchParams.get('pwd');
            link.setPwd(password);
            link.save();
            //assign all links to admin user
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
    if(linkData=="Fail")
        return res.status(400).json({message: "Fail"});
    else if(linkData == "No URL")
        return res.status(400).json({message: "No URL"});
    const otherData = await linkData.anyOtherMeetingLive()
                        .then(result=>{
                            return result[0][0].C;
                        });
    linkData['other'] = otherData;
    res.status(200).json({message: "Success", link: linkData});
}

exports.getAnyOtherMeetingLive = (req,res,next)=>{
    const url = req.body.url;
    ZoomLink.anyOtherMeetingLive(url)
    .then(result=>{
        res.send(`${result[0][0].C}`);
    });
}