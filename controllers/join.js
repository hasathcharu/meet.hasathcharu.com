const version = require('../utils/version').version;
const ZoomLink = require('../models/zoomLink');
const User = require('../models/user');

exports.getZoomLink = (req, res, next) => {
    const url = req.params.linkUrl;
    if(url){
        const linkData = ZoomLink.findByUrl(url)
                        .then(result=>{
                                return result;
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
                if(req.session.isLoggedIn){
                    User.checkAssigned(req.session.user.user_id,linkData.id)
                    .then(
                        (result)=>{
                            if(result==1){
                                return res.render('front/link', {
                                    pageTitle: linkData.topic,
                                    link: linkData,
                                    isLoggedIn: req.session.isLoggedIn,
                                    user: req.session.user,
                                    assigned: true,
                                    path: '/j',
                                    userPage: false,
                                    version:version,
                                });
                            }
                            return res.render('front/link', {
                                pageTitle: linkData.topic,
                                link: linkData,
                                isLoggedIn: req.session.isLoggedIn,
                                user: req.session.user,
                                assigned: false,
                                path: '/j',
                                userPage: false,
                                version:version,
                            });
                        }
                    )
                }
                else{
                    return res.render('front/link', {
                        pageTitle: linkData.topic,
                        link: linkData,
                        isLoggedIn: req.session.isLoggedIn,
                        user: req.session.user,
                        path: '/j',
                        assigned: false,
                        userPage: false,
                        version:version,
                    });
                }
            }
        });
        
    }
  }


  exports.getZoomEndedLink = (req, res, next) => {
    const url = req.params.linkUrl;
    if(url){
        ZoomLink.findByUrl(url)
        .then(result=>{
            if(result!="Fail" && result!= "No URL"){
                if(result.status){
                    return res.redirect('/j/'+result.url);
                }
                return res.render('front/over', {
                    pageTitle: result.topic+" has ended",
                    link: result,
                    isLoggedIn: req.session.isLoggedIn,
                    user: req.session.user,
                    path: '/o',
                    userPage: false,
                    version:version,
                });
            }
        });

    }
  }
