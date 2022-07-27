const version = require('../utils/version').version;
const Validator = require('./form');
const User = require('../models/user');

exports.getCheckAuth = (req,res,next) =>{
  if(req.session.isLoggedIn){
    if(req.session.user.adminConfirmed){
      if(!req.session.user.firstTime){
        next();
      }
      else{
        return res.render('admin/firstTime', {
          pageTitle: 'Welcome!',
          path: '/user/welcome',
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
          userPage: false,
          version:version,
        });
      }
    }
    else{
      console.log(req.session.user);
      User.findById(req.session.user.user_id)
      .then(result=>{
        if(result!= "Fail"){
          req.session.user = result;
          if(!req.session.user.adminConfirmed){
            return res.render('admin/notApproved', {
              pageTitle: 'Not yet approved',
              path: '/user/not-approved',
              isLoggedIn: req.session.isLoggedIn,
              user: req.session.user,
              userPage: false,
              version:version,
            });
          }
          return res.redirect("/user/profile");
        }
        throw new Error("Fail");
      })
      .catch (err=> {console.log(err.message)});
    }
  }
  else{
    return res.redirect('/');
  }
}

exports.postCheckAuth = (req,res,next) =>{
  if(req.session.isLoggedIn){
    if(req.session.user.adminConfirmed){
      if(!req.session.user.firstTime){
        next();
      }
      else{
        return res.send("Get Started");
      }
    }
    else{
      return res.send('Not yet approved');
    }
  }
  else{
    return res.send("Failed Auth");
  }
}

exports.getGetStarted = (req,res,next)=>{
  if(req.session.isLoggedIn){
    if(req.session.user.adminConfirmed){
      if(req.session.user.firstTime){
        const user = new User (req.session.user.fname,req.session.user.lname,req.session.user.email);
        user.removeFirstTimeFlag()
        .then((result)=>{
            return User.findById(req.session.user.user_id);
        })
        .then((result)=>{
            if(result!="Fail"){
              req.session.user = result;
              return res.redirect('/');
            }
        });
      }
    }
  }
  else{
    return res.redirect('/');
  }
}

exports.getUser = (req,res,next) =>{
  res.redirect('/user/profile');
}

exports.getEditProfile = (req, res, next) => {
    res.render('admin/signup', {
      pageTitle: 'Edit Profile',
      path: '/user/edit',
      admin: false,
      isLoggedIn: req.session.isLoggedIn,
      signUp: false,
      user: req.session.user,
      editUser: req.session.user,
      userPage: true,
      version:version,
    });
};

exports.postEditProfile = (req, res, next) => {
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
        if(result!= "Fail"){
          req.session.user = result;
          return res.send("Success");
        }
        throw new Error();
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
};


exports.getProfile = (req, res, next) => {
      res.render('admin/userProfile', {
        pageTitle: 'Your Meetings',
        path: '/user/edit',
        isLoggedIn: req.session.isLoggedIn,
        userPage: true,
        user: req.session.user,
        version:version,
      });
};

exports.getChangePassword = (req,res,next) =>{
    res.render('admin/changepassword', {
      pageTitle: 'Change Password',
      path: '/user/change-password',
      user: req.session.user,
      admin: false,
      editUser: req.session.user,
      isLoggedIn: req.session.isLoggedIn,
      userPage: true,
      version:version,
    });
}

exports.postChangePassword = (req,res,next) =>{
    const password = req.body.password;
    const opassword = req.body.opassword;
    if((!password) || (!opassword)){
      return res.send("Fail");
    }
    const checks = [];
    checks.push(Validator.conformsLength(password,{min:8}));
    checks.push(Validator.hasNumbers(password));
    if(Validator.validate(checks)){
      User.authenticate(req.session.user.email,opassword)
      .then((result)=>{
        if(result[0].length==0){
          throw new Error("Auth Error");
        }else{
            return User.changePassword(password,req.session.user.user_id);
        }
      })
      .then((result)=>{
        if(result[0].affectedRows ==0){
          throw new Error();
        }
        req.session.destroy();
        return res.send("Success");
      })
      .catch((err)=>{
        if(err.message == "Auth Error"){
          return res.send("Auth Error");
        }
        return res.send("Fail");
      });
    }else{
      return res.send("Fail");
    };
}

exports.getDeleteAccount = (req,res,next) =>{
    res.render('admin/delete', {
      pageTitle: 'Delete Account',
      path: '/user/delete',
      user: req.session.user,
      admin: false,
      editUser: req.session.user,
      isLoggedIn: req.session.isLoggedIn,
      userPage: true,
      version:version,
    });
}
exports.postDeleteAccount = (req,res,next) =>{
  const password = req.body.password;
  if(!password){
    return res.send("Fail");
  }
  const checks = [];
  checks.push(Validator.conformsLength(password,{min:8}));
  if(Validator.validate(checks)){
    User.authenticate(req.session.user.email,password)
    .then((result)=>{
      if(result[0].length==0){
        throw new Error("Auth Error");
      }else{
          return User.deleteById(req.session.user.user_id);
      }
    })
    .then((result)=>{
      req.session.destroy();
      return res.send("Success");
    })
    .catch((err)=>{
      if(err.message == "Auth Error"){
        return res.send("Auth Error");
      }
      return res.send("Fail");
    });
  }else{
    return res.send("Fail");
  };
}

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
      })
      .catch(()=>{
        res.send("Fail");
      });
    }else{
      return res.send("Fail");
    };
};

