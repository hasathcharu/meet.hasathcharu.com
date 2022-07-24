const version = require('../utils/version').version;
exports.get404 = (req, res, next) => {
    res.status(404).render('error/error', { 
        pageTitle: 'Page Not Found',
        pageInfo: 'Sorry the link you followed is broken :(',
        path: '/404' ,
        version: version,
        isLoggedIn: true,
        userPage: false,
        version:version,
    });
};