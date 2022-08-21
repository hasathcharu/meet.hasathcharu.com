const {validationResult} = require('express-validator');
const User = require('../models/user');
const ZoomLink = require('../models/zoomLink');
const jwt = require('jsonwebtoken');

exports.checkAuth = async (req,res,next)=>{
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if(!token)
		return res.status(403).json({message: "Missing Token"});
	let decodedToken;
	try{
		decodedToken = jwt.verify(token,process.env.JWT_ACCESS_SECRET,{algorithms:['HS256']});
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
	if(!user.adminConfirmed){
		return res.status(403).json({message: "Not approved"});
	}
    if(!user.firstTime){
        await user.removeFirstTimeFlag();
        return res.status(200).json({message: "Success", firstTime: true});
    }
	req.user = user;
	next();
}

exports.getUser = (req, res, next) => {
    return res.status(200).json({
		message: "Success",
        user: req.user
    });
};


exports.getMeetingStatus = (req, res, next) => {
    const assignedLinks = req.user.getAssignedLinks();
    const anyOther = req.user.getIfAnyOtherLive();
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
        return res.status(200).json({
			message: "Success",
			links: links
		});
    })
};


exports.putEditProfile = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(422).json(errors);
        const fname = req.body.fname;
        const lname = req.body.lname;
        const email = req.body.email; 
        const user = new User(req.user.id);
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
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Fail"});
    }
};


exports.putChangePassword = async (req,res,next) =>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);

    const {password,opassword} = req.body;
	req.user.setPassword(opassword);
	try{
        const auth = await req.user.authenticate();
        if(auth[0]?.length==0){
            return res.status(422).json({message: "Failed Auth"});
        }else{
			const pass = await req.user.changePassword(password);
			if(pass[0]?.affectedRows==1){
				return res.status(201).json({message: "Success"});
			}
			return res.status(400).json({message: "Fail"});
        }
    }
    catch(error){
        console.log(error);
        return res.status(400).json({message: "Fail"});
    }
}

exports.deleteAccount = async(req,res,next) =>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);

    const password = req.body.password;
	req.user.setPassword(password);
	try{
        const auth = await req.user.authenticate();
        if(auth[0]?.length==0){
            return res.status(422).json({message: "Failed Auth"});
        }else{
			const deleted = await req.user.deleteById();
			if(deleted[0]?.affectedRows==1){
				return res.status(201).json({message: "Success"});
			}
			return res.status(400).json({message: "Fail"});
        }
    }
    catch(error){
        console.log(error);
        return res.status(400).json({message: "Fail"});
    }
}
exports.postAssignLink = async (req,res,next)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
	const link = req.body.link_id;
	const assign = await req.user.assignLink(link);
    if(assign!="Fail"){
        return res.status(201).json({message: assign});
    }
    return res.status(409).json({message: "Fail"});
}

exports.deleteUnassignLink = async (req,res,next)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
	const link = req.body.link_id;
	const unassign = req.user.unAssignLink(link);//await not required
    if(unassign){
        return res.status(200).json({message: unassign});
    }
    return res.status(409).json({message: "Fail"});
};
exports.postSignUp = async(req,res,next)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email; 
    const password = req.body.password;
    const user = new User();
	user.setFname(fname);
	user.setLname(lname);
	user.setEmail(email);
    user.setPassword(password);
    const result = await user.save();
    if(result=='Fail' || !result){
        return res.status(422).json({message: "Fail"});
    }
    if(result=="Email Error"){
		return res.status(409).json({message: result});
	}
	return res.status(201).json({message: result});
};

exports.putSetTheme = async (req,res,next)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json(errors);
    const value = req.body.theme;
	let theme = 1;
	if(value == "light") theme = 0;
	req.user.setTheme(theme);
	const result = await req.user.saveTheme();
	res.status(200).json({message: "Success"});
}