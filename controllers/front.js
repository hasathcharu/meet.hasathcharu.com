const version = require('../utils/version').version;
exports.getLogIn = (req, res, next) => {
  if(req.session.isLoggedIn){
    res.redirect('/user/profile');
  }else{
    res.render('admin/login', {
      pageTitle: 'Hasathcharu Meeting Portal',
      path: '/login',
      isLoggedIn: false,
      user: null,
      error: false,
      userPage: false,
      version:version,
    });
  }
};
  
exports.getSignUp = (req, res, next) => {
    res.render('admin/signup', {
      pageTitle: 'Sign Up',
      path: '/sign-up',
      user: null,
      isLoggedIn: false,
      signUp: true,
      userPage: true,
      version:version,
    });
};


