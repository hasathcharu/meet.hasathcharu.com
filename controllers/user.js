const version = require('../utils/version').version;
const Validator = require('./form');
const User = require('../models/user');
const ZoomLink = require('../models/zoomLink');

exports.getCheckAuth = (req,res,next) =>{
  if(req.session.isLoggedIn){
    User.findById(req.session.user.user_id)
    .then((result)=>{
      if(result!="Fail"){
        req.session.user = result;
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
          return res.render('admin/notApproved', {
            pageTitle: 'Not yet approved',
            path: '/user/not-approved',
            isLoggedIn: req.session.isLoggedIn,
            user: req.session.user,
            userPage: false,
            version:version,
          });
            
        }
      }
      else{
        req.session.destroy();
        return res.redirect("/");
      }
    });
  }
  else{
    return res.redirect('/');
  }
}

exports.postCheckAuth = (req,res,next) =>{
  if(req.session.isLoggedIn){
    User.findById(req.session.user.user_id)
    .then((result)=>{
      req.session.user = result;
      if(result!="Fail"){
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
        req.session.destroy();
        res.send("Failed Auth");
      }
    });
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

exports.getProfile = (req, res, next) => {
  const assignedLinks = User.getAssignedLinks(req.session.user.user_id);
  const anyOther = User.getIfAnyOtherLive(req.session.user.user_id);
  Promise.all([assignedLinks,anyOther])
  .then(([assignedLinks,anyOther])=>{
    links = []
    for(link of assignedLinks[0]){
      const zoomLink = new ZoomLink(link.link_id);
      zoomLink.setTopic(link.topic);
      zoomLink.setStatus(link.status);
      zoomLink.setPwd(link.pwd);
      zoomLink.setUrl(link.url);
      zoomLink.setEndElapsed(link.emin);
      zoomLink.setStartElapsed(link.smin);
      zoomLink.setTimeText();
      links.push(zoomLink);
    }
    return res.render('admin/userProfile', {
      pageTitle: 'Your Meetings',
      path: '/user/profile',
      isLoggedIn: req.session.isLoggedIn,
      userPage: true,
      user: req.session.user,
      links: links,
      anyOther: anyOther,
      version:version,
    });
  })
};


exports.postProfile = (req, res, next) => {
  const assignedLinks = User.getAssignedLinks(req.session.user.user_id);
  const anyOther = User.getIfAnyOtherLive(req.session.user.user_id);
  Promise.all([assignedLinks,anyOther])
  .then(([assignedLinks,anyOther])=>{
    links = []
    for(link of assignedLinks[0]){
      const zoomLink = new ZoomLink(link.link_id);
      zoomLink.setTopic(link.topic);
      zoomLink.setStatus(link.status);
      zoomLink.setPwd(link.pwd);
      zoomLink.setUrl(link.url);
      zoomLink.setEndElapsed(link.emin);
      zoomLink.setStartElapsed(link.smin);
      zoomLink.setTimeText();
      if(anyOther>0){
        zoomLink['anyOther'] = 1;
      }
      else{
        zoomLink['anyOther'] = 0;
      }
      links.push(zoomLink);
    }
    return res.send(links);
  })
};


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
            return res.send("Success");
          }else{
            throw new Error (result);
          }
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
exports.postAssignLink = (req,res,next)=>{
  if(req.body.user_id && req.body.link_id){
    User.assignLink(req.body.user_id,req.body.link_id)
    .then(
      (result)=>{
        if(result[0].affectedRows == 1){
          return res.send("Success");
        }
        return res.send("Fail");
      }
    )
  }
}
exports.postUnassignLink = (req,res,next)=>{
  if(req.body.user_id && req.body.link_id){
    const user_id = req.body.user_id;
    const link_id = req.body.link_id;
    User.unAssignLink(user_id,link_id)
    .then((result)=>{
      res.send("Success");
    })
  }
  else{
    res.send("Fail");
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
      })
      .catch(()=>{
        res.send("Fail");
      });
    }else{
      return res.send("Fail");
    };
};

