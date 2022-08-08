const {validationResult} = require('express-validator');
const User = require('../models/user');
const ZoomLink = require('../models/zoomLink');
const jwt = require('jsonwebtoken');


exports.checkAuth = async (req,res,next) =>{
  const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if(!token)
		return res.status(403).json({message: "Missing Token"});
	let decodedToken;
	try{
		decodedToken = jwt.verify(token,process.env.JWT_ACCESS_SECRET);
	}
	catch(error){
		console.error(error);
		return res.status(401).json({message: "Token Invalid"});
	}
	if(!decodedToken)
		return res.status(401);
	const user = await User.findById(decodedToken.user_id);
	if(user=="Fail"){
		return res.status(401).json({message: "User not found"});
	}
	if(user.passChangeTime>decodedToken.iat){
		return res.status(401).json({message: "Password changed"});
	}
  if(!user.isAdmin){
    return res.status(403).json({message: "Not an admin"});
  }
	req.user = user;
	next();
}

exports.getSystemSummary = async (req, res, next) => {
    const numOfUnapprovedUsers = await User.getNumOfUnapprovedUsers();
    const numOfApprovedUsers = await User.getNumOfApprovedUsers();
    const numOfLinks = await ZoomLink.getNumOfLinks();
    res.status(200).json({
      message: "Success",
      numOfUnapprovedUsers: numOfUnapprovedUsers,
      numOfApprovedUsers: numOfApprovedUsers,
      numOfLinks: numOfLinks
    });
};

exports.getUnapprovedUsers = async (req, res, next) => {
 const result = await User.getUsers(0);
 return res.status(200).json({
  message: "Success",
  users:result
 });
}

exports.getApprovedUsers = async (req, res, next) => {
  const result = await User.getUsers(1);
  return res.status(200).json({
    message: "Success",
    users:result
  });
}

exports.getZoomLinks = async (req,res,next)=>{
  const result = await ZoomLink.getLinks();
  return res.status(200).json({
  message: "Success",
   links:result
  });
};


exports.getUser = async (req, res, next) => {
  const result = await User.findById(req.params.user_id);
  if(result=="Fail")
    return res.status(400).json({message: "User not found"});
  return res.status(200).json({
    message: "Success",
    user: result
  });
}

exports.putEditUser = async (req,res,next)=>{
  const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);

  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const userId = req.body.user_id;
  const user = new User(userId);
	user.setFname(fname);
	user.setLname(lname);
	user.setEmail(email);
  const result = await user.save(1);
	if(result=="Success"){
		return res.status(201).json({message: result});
	}
	else if(result=="Email Error"){
		return res.status(409).json({message: result});
	}
	return res.status(422).json({message: result});
}


exports.putChangeUserPassword = async (req,res,next) =>{
  const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);

  const password = req.body.password;
  const userId = req.body.user_id;

  const user = new User(userId);
	try{
			const pass = await user.changePassword(password);
			if(pass[0].affectedRows==1){
				return res.status(201).json({message: "Success"});
			}
			return res.status(400).json({message: "User not found"});
    }
    catch(error){
        console.log(error);
        return res.status(400).json({message: "Fail"});
    }
}

exports.deleteUser = async (req,res,next) => {
    try{
        const user = new User(req.body.user_id);
    	const deleted = await user.deleteById();
    	if(deleted[0].affectedRows==1){
    		return res.status(201).json({message: "Success"});
    	}
    	return res.status(400).json({message: "User not found"});
    }
    catch(error){
        console.log(error);
        return res.status(400).json({message: "Fail"});
    }
}


exports.putApproveUser = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
    
    if(parseInt(req.body.approve)){
        const result = await User.approveUser(req.body.user_id);
        if(result[0].affectedRows==1){
            return res.status(201).json({message:"Success"});
        }
        return res.status(400).json({message:"User not found"});
    }
    else{
        const user = new User(req.body.user_id)
        const deleted = await user.deleteById();
        if(deleted[0].affectedRows==1){
    		return res.status(201).json({message: "Success"});
    	}
    	return res.status(400).json({message: "User not found"});
    }
}

exports.getAssignedLinks = async (req,res,next)=>{
    const user = new User(req.params.user_id);
    const links = await user.getAssignedLinks();
    return res.status(200).json({message: "Success",links: links[0]});
};

exports.getUnassignedLinks = async (req,res,next)=>{
    const user = new User(req.params.user_id);
    const links = await user.getUnassignedLinks();
    return res.status(200).json({message: "Success",links: links[0]});
};

exports.postAssignLink = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);

    const user_id = req.body.user_id;
	const link = req.body.link_id;
    const user = new User(user_id);
	const assign = await user.assignLink(link);
    if(assign!="Fail"){
        return res.status(201).json({message: assign});
    }
    return res.status(409).json({message: "Fail"});
};

exports.deleteUnassignLink = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);

    const user_id = req.body.user_id;
	const link = req.body.link_id;
    const user = new User(user_id);
	const unassign = await user.unAssignLink(link);
    if(unassign!="Fail"){
        return res.status(200).json({message: unassign});
    }
    return res.status(409).json({message: "Fail"});
};

exports.putSaveZoomURL = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
    const link = new ZoomLink(req.body.link_id);
    link.setUrl(req.body.url);
    try{
        const result = await link.saveUrl()
        if(result[0].affectedRows == 1){
            return res.status(201).json({message: "Success"});
        }
        return res.status(201).json({message: "Fail"});
    }
    catch{
        res.status(400).json({message: "URL Taken"});
    }
};

exports.getAssignedUsers = async (req,res,next)=>{
    const link = new ZoomLink(req.params.link_id);
    const users = await link.getAssignedUsers();
    return res.status(200).json({message: "Success",users: users[0]});
};

exports.getUnassignedUsers = async (req,res,next)=>{
    const link = new ZoomLink(req.params.link_id);
    const users = await link.getUnassignedUsers();
    return res.status(200).json({message: "Success",users: users[0]});
};

exports.postAssignUser = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
    const user_id = req.body.user_id;
    const link_id = req.body.link_id;
    const link = new ZoomLink(link_id);
    const assign = await link.assignUser(user_id);
    if(assign!="Fail"){
        return res.status(201).json({message: assign});
    }
    return res.status(409).json({message: "Fail"});
};

exports.deleteUnassignUser = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
    const user_id = req.body.user_id;
    const link_id = req.body.link_id;
    const link = new ZoomLink(link_id);
    const assign = await link.unassignUser(user_id);
    if(assign!="Fail"){
        return res.status(200).json({message: assign});
    }
    return res.status(409).json({message: "Fail"});
};
