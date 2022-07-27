const version = require('../utils/version').version;
const User = require('../models/user');
const Validator = require('./form');
const ZoomLink = require('../models/zoomLink');


exports.getCheckAuth = (req,res,next) =>{
  if(req.session.isLoggedIn && req.session.user.isAdmin){
    next();
  }
  else{
    return res.redirect('/');
  }
}
exports.postCheckAuth = (req,res,next) =>{
  if(req.session.isLoggedIn && req.session.user.isAdmin){
    next();
  }
  else{
    return res.send("Failed Auth");
  }
}


exports.getHome = (req, res, next) => {
    const unapprovedUsers = User.getNumOfUnapprovedUsers();
    const approvedUsers = User.getNumOfApprovedUsers();
    const links = ZoomLink.getNumOfLinks();
    Promise.all([unapprovedUsers,approvedUsers,links])
    .then(
      ([unapprovedUsers,approvedUsers,links])=>{
        res.render('admin/home', {
          pageTitle: 'Administration',
          path: '/admin',
          isLoggedIn: req.session.isLoggedIn,
          unapprovedUsers: unapprovedUsers,
          links: links,
          approvedUsers: approvedUsers,
          user: req.session.user,
          userPage: true,
          version:version,
        });
      }
    )
};

exports.getUnapprovedUsers = (req, res, next) => {
  User.getUsers(0)
  .then(result=>{
    res.render('admin/approve', {
      pageTitle: 'Unapproved Users',
      path: '/admin',
      isLoggedIn: req.session.isLoggedIn,
      users: result,
      user: req.session.user,
      approve:1,
      userPage: true,
      version:version,
    });
  })
}

exports.getApprovedUsers = (req, res, next) => {
  User.getUsers(1)
  .then(result=>{
    res.render('admin/approve', {
      pageTitle: 'Users',
      path: '/admin',
      isLoggedIn: req.session.isLoggedIn,
      users: result,
      user: req.session.user,
      approve:0,
      userPage: true,
      version:version,
    });
  })
}

exports.getEditUser = (req, res, next) => {
  if(!req.params.user_id){
    return res.redirect('/admin/users');
  }
  User.findById(req.params.user_id)
  .then(result=>{
    return res.render('admin/signup', {
      pageTitle: 'Edit '+result.fname+"'s Profile",
      path: '/admin/users/edit',
      admin: true,
      isLoggedIn: req.session.isLoggedIn,
      signUp: false,
      user: req.session.user,
      editUser: result,
      userPage: true,
      version:version,
    });
  })
}

exports.postEditUser = (req,res,next)=>{
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const userId = req.body.user_id;
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
    user.setUserId(userId);
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
}

exports.getChangeUserPassword = (req,res,next) =>{

  if(!req.params.user_id){
    return res.redirect('/admin/users');
  }
  User.findById(req.params.user_id)
  .then(result=>{
    return res.render('admin/changepassword', {
      pageTitle: 'Change Password',
      path: '/admin/users/change-password',
      user: req.session.user,
      admin:true,
      editUser: result,
      isLoggedIn: req.session.isLoggedIn,
      userPage: true,
      version:version,
    });
  });
}

exports.postChangeUserPassword = (req,res,next) =>{
  const password = req.body.password;
  const userId = req.body.user_id;
  if(!password){
    return res.send("Fail");
  }
  const checks = [];
  checks.push(Validator.conformsLength(password,{min:8}));
  checks.push(Validator.hasNumbers(password));
  if(Validator.validate(checks)){
    User.changePassword(password,userId)
    .then((result)=>{
      if(result[0].affectedRows == 0){
        throw new Error();
      }
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
 
exports.getDeleteUser = (req,res,next) => {
  if(!req.params.user_id){
    return res.redirect('/admin/users');
  }
  User.findById(req.params.user_id)
  .then(result=>{
    return res.render('admin/delete', {
      pageTitle: 'Delete User',
      path: '/admin/users/delete',
      user: req.session.user,
      admin: true,
      editUser: result,
      isLoggedIn: req.session.isLoggedIn,
      userPage: true,
      version:version,
    });
  });
}

exports.postDeleteUser = (req,res,next) => {
  const userId = req.body.user_id;
  User.deleteById(userId)
  .then((result)=>{
    if(result[0].affectedRows == 0){
      throw new Error();
    }
    return res.send("Success");
  })
  .catch((err)=>{
    if(err.message == "Auth Error"){
      return res.send("Auth Error");
    }
    return res.send("Fail");
  });
}




exports.postApproveUser = (req,res,next)=>{
  if(req.body.user_id){
    if(parseInt(req.body.approve)){
      User.approveUser(req.body.user_id)
      .then(
        (result)=>{
          if(result[0].affectedRows==1){
            return res.send("Success");
          }
        }
      )
    }
    else{
      User.deleteById(req.body.user_id)
      .then((result)=>{
        return res.send("Success");
      })
    }
  }
  else{
    return res.send("Fail");
  }
}