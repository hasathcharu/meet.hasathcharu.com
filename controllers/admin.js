const version = require('../utils/version').version;
exports.getHome = (req, res, next) => {
    res.render('admin/home', {
      pageTitle: 'Admininstration',
      path: '/admin',
      isLoggedIn: true,
      userPage: true,
      version:version,
      // isAuthenticated: req.session.isLoggedIn,
    });
};