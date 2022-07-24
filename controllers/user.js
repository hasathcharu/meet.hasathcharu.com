const version = require('../utils/version').version;
const Validator = require('./form');
const User = require('../models/user');

exports.getEditProfile = (req, res, next) => {
  if(req.session.isLoggedIn){
    res.render('admin/signup', {
      pageTitle: 'Edit profile',
      path: '/user/edit',
      isLoggedIn: true,
      signUp: false,
      user: req.session.user,
      userPage: true,
      version:version,
    });
  }
  else{
    res.redirect('/');
  }
};

exports.postEditProfile = (req, res, next) => {
  if(req.session.isLoggedIn){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    if((!fname) || (!lname) || (!email)){
      return res.send("Fail");
    }
    const checks = [];
    checks.push(Validator.conformsLength(fname,{max:30,min:0}));
    checks.push(Validator.conformsLength(lname,{max:30,min:0}));
    checks.push(Validator.conformsLength(email,{max:320,min:0}));
    checks.push(Validator.validEmail(email));
    if(Validator.validate(checks)){
      const user = new User(fname,lname,email);
      user.setUserId(req.session.user.user_id);
      user.save(1).then((result)=>{
          if(result=="Success"){
            return User.findById(req.session.user.user_id);
          }else{
            throw new Error (result);
          }
      })
      .then((result)=>{
        req.session.user = result;
        res.send("Success");
      })
      .catch(err=>{
        if(err.message=="Email Error"){
          res.send("Email");
        }else{
          res.send("Fail");
        }
      });
    }else{
      return res.send("Fail");
    };
  }
  else{
    res.send("Fail");
  }
};


exports.getProfile = (req, res, next) => {
  if(req.session.isLoggedIn){
      res.render('admin/userProfile', {
        pageTitle: 'Your Meetings',
        path: '/user/edit',
        isLoggedIn: true,
        userPage: true,
        user: req.session.user,
        version:version,
      });
    }
    else{
      res.redirect('/');
    }
  };


exports.postSignUp = (req,res,next)=>{
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email; 
    const password = req.body.password;
    if((!fname) || (!lname) || (!email) || (!password)){
      return res.send("Fail");
    }
    const checks = [];
    checks.push(Validator.conformsLength(fname,{max:30,min:0}));
    checks.push(Validator.conformsLength(lname,{max:30,min:0}));
    checks.push(Validator.conformsLength(email,{max:320,min:0}));
    checks.push(Validator.validEmail(email));
    checks.push(Validator.conformsLength(password,{min:8}));
    checks.push(Validator.hasNumbers(password));
    if(Validator.validate(checks)){
      const user = new User(fname,lname,email);
      user.setPassword(password);
      user.save().then((result)=>{
          res.send(result);
      });
    }else{
      return res.send("Fail");
    };
};