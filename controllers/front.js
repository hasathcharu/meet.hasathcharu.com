const version = require('../utils/version').version;
exports.getLogIn = (req, res, next) => {
  if(req.session.isLoggedIn){
    res.redirect('/user/profile');
  }else{
    const authError = req.session.authError;
    req.session.authError = false;
    res.render('admin/login', {
      pageTitle: 'Hasathcharu Meeting Portal',
      path: '/login',
      isLoggedIn: false,
      user: null,
      error: authError,
      userPage: false,
      version:version,
      theme:req.session.user.theme,
    });
  }
};
  
exports.getSignUp = (req, res, next) => {
    res.render('admin/signup', {
      pageTitle: 'Sign Up',
      path: '/sign-up',
      user: null,
      isLoggedIn: false,
      editUser: null,
      admin: false,
      signUp: true,
      userPage: true,
      version:version,
      theme:0,
    });
};


