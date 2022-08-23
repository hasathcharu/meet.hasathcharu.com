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
		decodedToken = jwt.verify(token,process.env.JWT_ACCESS_SECRET,{algorithms:['HS256']});
	}
	catch(error){
		return res.status(401).json({message: "Token Invalid"});
	}
	if(!decodedToken)
		return res.status(401);
	const user = await User.findById(decodedToken.user_id);
	if(user=="Fail"){
		return res.status(401).json({message: "User not found"});
	}
	if(user? user.passChangeTime>decodedToken.iat : true){
		return res.status(401).json({message: "Password changed"});
	}
    if(user? !user.isAdmin : true){
        return res.status(403).json({message: "Not an admin"});
    }
	req.user = user;
	next();
}

exports.getSystemSummary = async (req, res, next) => {
    try{
        const numOfUnapprovedUsers = await User.getNumOfUnapprovedUsers();
        const numOfApprovedUsers = await User.getNumOfApprovedUsers();
        const numOfLinks = await ZoomLink.getNumOfLinks();
        return res.status(200).json({
          message: "Success",
          numOfUnapprovedUsers: numOfUnapprovedUsers,
          numOfApprovedUsers: numOfApprovedUsers,
          numOfLinks: numOfLinks
        });
    }
    catch{
        return res.status(500).json({message: "Fail"});
    }

};

exports.getUnapprovedUsers = async (req, res, next) => {
    try{
        const result = await User.getUsers(0);
        return res.status(200).json({
            message: "Success",
            users:result
        });
    }
    catch{
        return res.status(500).json({message: "Fail"});
    }
}

exports.getApprovedUsers = async (req, res, next) => {
    try{
        const result = await User.getUsers(1);
        return res.status(200).json({
            message: "Success",
            users:result
        });
    }
    catch{
        return res.status(500).json({message: "Fail"});
    }
}

exports.getZoomLinks = async (req,res,next)=>{
    try{
        const result = await ZoomLink.getLinks();
        return res.status(200).json({
            message: "Success",
            links:result
        });
    }
    catch{
        return res.status(500).json({message: "Fail"});
    }

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

    const {fname,lname,email,user_id} = req.body;

    const user = new User(user_id);
	user.setFname(fname);
	user.setLname(lname);
	user.setEmail(email);
    try{
        const result = await user.save(1);

        if(result=='Fail' || !result){
            return res.status(422).json({message: "Fail"});
        }
        if(result=="Email Error"){
            return res.status(409).json({message: result});
        }
        return res.status(201).json({message: result});
    }
    catch{
        res.status(500).send({message:'Fail'});
    }

}


exports.putChangeUserPassword = async (req,res,next) =>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);

    const {password,user_id} = req.body;

    const user = new User(user_id);
	try{
		const pass = await user.changePassword(password);
		if(pass[0]?.affectedRows==1)
			return res.status(201).json({message: "Success"});
		return res.status(400).json({message: "User not found"});
    }
    catch(error){
        return res.status(400).json({message: "Fail"});
    }
}

exports.deleteUser = async (req,res,next) => {
    try{
        const user = new User(req.body.user_id);
    	const deleted = await user.deleteById();
    	if(deleted[0]?.affectedRows==1)
    		return res.status(201).json({message: "Success"});
    	return res.status(400).json({message: "User not found"});
    }
    catch(error){
        return res.status(400).json({message: "Fail"});
    }
}


exports.putApproveUser = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
    
    if(parseInt(req.body.approve)){
        try{
            const result = await User.approveUser(req.body.user_id);
            if(result[0]?.affectedRows==1)
                return res.status(201).json({message:"Success"});
            return res.status(400).json({message:"User not found"});
        }
        catch{
            return res.status(500).json({message: "Fail"});
        }
    }
    else{
        try{
            const user = new User(req.body.user_id)
            const deleted = await user.deleteById();
            if(deleted[0]?.affectedRows==1)
                return res.status(201).json({message: "Success"});
            return res.status(400).json({message: "User not found"});
        }
        catch{
            return res.status(500).json({message: "Fail"});
        }
    }
}

exports.getAssignedLinks = async (req,res,next)=>{
    const user = new User(req.params.user_id);
    try{
        const links = await user.getAssignedLinks();
        return res.status(200).json({message: "Success",links: links[0]});
    }
    catch{
        return res.status(404).json({message: "Fail"});
    }
};

exports.getUnassignedLinks = async (req,res,next)=>{
    const user = new User(req.params.user_id);
    try{
        const links = await user.getUnassignedLinks();
        return res.status(200).json({message: "Success",links: links[0]});
    }
    catch{
        return res.status(404).json({message: "Fail"});
    }
};

exports.postAssignLink = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);

    const user_id = req.body.user_id;
	const link = req.body.link_id;
    const user = new User(user_id);
    try{
        const assign = await user.assignLink(link);
        if(assign!="Fail"){
            return res.status(201).json({message: assign});
        }
        return res.status(409).json({message: "Fail"});
    }
    catch{
        return res.status(500).json({message: "Fail"});
    }

};

exports.deleteUnassignLink = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
    try{
        const user_id = req.body.user_id;
        const link = req.body.link_id;
        const user = new User(user_id);
        const unassign = await user.unAssignLink(link);
        if(unassign!="Fail"){
            return res.status(200).json({message: unassign});
        }
        return res.status(409).json({message: "Fail"});
    }
    catch{
        return res.status(500).json({message: "Fail"});
    }
};

exports.putSaveZoomURL = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
    const link = new ZoomLink(req.body.link_id);
    link.setUrl(req.body.url);
    try{
        const result = await link.saveUrl()
        if(result[0]?.affectedRows == 1){
            return res.status(201).json({message: "Success"});
        }
        return res.status(400).json({message: "Fail"});
    }
    catch{
        res.status(409).json({message: "URL Taken"});
    }
};

exports.getAssignedUsers = async (req,res,next)=>{
    const link = new ZoomLink(req.params.user_id);
    try{
        const users = await link.getAssignedUsers();
        return res.status(200).json({message: "Success",links: users[0]});
    }
    catch{
        return res.status(404).json({message: "Fail"});
    }
};

exports.getUnassignedUsers = async (req,res,next)=>{
    const link = new ZoomLink(req.params.user_id);
    try{
        const users = await link.getUnassignedUsers();
        return res.status(200).json({message: "Success",links: users[0]});
    }
    catch{
        return res.status(404).json({message: "Fail"});
    }
};

exports.postAssignUser = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
    const user_id = req.body.user_id;
    const link_id = req.body.link_id;
    const link = new ZoomLink(link_id);
    try{
        const assign = await link.assignUser(user_id);
        if(assign!="Fail"){
            return res.status(201).json({message: assign});
        }
        return res.status(409).json({message: "Fail"});
    }
    catch{
        return res.status(500).json({message: "Fail"});
    }
};

exports.deleteUnassignUser = async (req,res,next)=>{
    const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
    const user_id = req.body.user_id;
    const link_id = req.body.link_id;
    const link = new ZoomLink(link_id);
    try{
        const assign = await link.unassignUser(user_id);
        if(assign!="Fail"){
            return res.status(200).json({message: assign});
        }
        return res.status(409).json({message: "Fail"});
    }
    catch{
        return res.status(500).json({message: "Fail"});
    }

};
