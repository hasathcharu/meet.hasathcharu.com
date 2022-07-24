const User = require('../models/user');

const version = require('../utils/version').version;

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.authenticate(email,password)
    .then((result)=>{
        if(result[0].length==0){
            res.render('admin/login', {
                pageTitle: 'Hasathcharu Meeting Portal',
                path: '/login',
                isLoggedIn: false,
                error: true,
                userPage: false,
                version:version,
              });
        }else{
            req.session.isLoggedIn = true;
            req.session.user = result[0][0];
            res.redirect('/');
        }
    });
};
exports.getLogin = (req, res, next) => {
    res.redirect('/');
};

exports.postLogout = (req,res,next) => {
    req.session.destroy((err)=>{
        res.redirect('/');
    });
}
