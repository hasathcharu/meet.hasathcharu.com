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

exports.postLinkData = (req, res, next) => {
    const url = req.body.url;
    if(url){
        const linkData = ZoomLink.findByUrl(url);
        const otherData = ZoomLink.anyOtherMeetingLive(url)
                            .then(result=>{
                                return result[0][0].C;
                            });
        Promise.all([linkData,otherData]).then(([linkData,otherData])=>{
            if(linkData == "Fail"){
                return res.send("Fail");
            }
            else if(linkData == "No URL"){
                return res.send("No URL");
            }
            else{
                linkData['other'] = otherData;
                res.send(JSON.stringify(linkData));
            }
        });
    }
}



exports.postSetUrl = (req,res,next)=>{
    const url = req.body.url;
    const id = req.body.link_id;
    const link = new ZoomLink(id);
    link.setUrl(url);
    link.saveUrl()
    .then(result=>{
        if(result[0].affectedRows==0){
            throw new Error();
        }
        res.send("Success");
    }).catch(err=>{res.send("Fail")});
};

exports.postAnyOtherMeetingLive = (req,res,next)=>{
    const url = req.body.url;
    ZoomLink.anyOtherMeetingLive(url)
    .then(result=>{
        res.send(`${result[0][0].C}`);
    });
}