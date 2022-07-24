const version = require('../utils/version').version;
exports.getHome = (req, res, next) => {
  if(req.session.isLoggedIn){
    res.render('admin/home', {
      pageTitle: 'Admininstration',
      path: '/admin',
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
      userPage: true,
      version:version,
    });
  }
  else{
    res.redirect('/');
  }
};