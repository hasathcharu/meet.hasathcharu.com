const User = require('../models/user');

const version = require('../utils/version').version;

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.authenticate(email,password)
    .then((result)=>{
        if(result[0].length==0){
            req.session.authError = true;
            res.redirect('/');
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
