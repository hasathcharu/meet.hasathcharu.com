const version = require('../utils/version').version;
const ZoomLink = require('../models/zoomLink');

exports.getZoomLink = (req, res, next) => {
    const url = req.params.linkUrl;
    if(url){
        const linkData = ZoomLink.findByUrl(url)
                        .then(result=>{
                            if(result=="Fail"){
                            //    return res.sendStatus(404);
                            }
                            else if(result=="No URL"){

                            }
                            else{
                                return result;
                            }
                        });
        const otherData = ZoomLink.anyOtherMeetingLive(url)
                        .then(result=>{
                            return result[0][0].C;
                        }); 
                        
        Promise.all([linkData,otherData])
        .then(([linkData,otherData])=>{
            if(linkData == "Fail"){
                return res.sendStatus(404);
            }
            else if(linkData == "No URL"){
                return res.status(404).render('error/error', { 
                    pageTitle: 'Page Not Found',
                    pageInfo: 'Sorry the link you followed is broken :(',
                    path: '/404' ,
                    version: version,
                    isLoggedIn: req.session.isLoggedIn,
                    user: req.session.user,
                    userPage: false,
                    version:version,
                });
            }else{
                linkData['other'] = otherData;
                return res.render('front/link', {
                    pageTitle: linkData.topic,
                    link: linkData,
                    isLoggedIn: req.session.isLoggedIn,
                    user: req.session.user,
                    path: '/j',
                    userPage: false,
                    version:version,
                });
            }
        });
        
    }
  }


