const version = require('../utils/version').version;

exports.getLink = (req, res, next) => {
    const linkUrl = req.params.linkUrl;
    if(linkUrl == 'general_hangouts'){
        res.render('front/link', {
            pageTitle: 'General Hangouts',
            status : 1,
            started: '5 mins ago',
            isLoggedIn: req.session.isLoggedIn,
            user: req.session.user,
            path: '/j',
            userPage: false,
            version:version,
          });
    }
    else{
        next();
    }
  };