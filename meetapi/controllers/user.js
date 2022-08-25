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
		return res.status(401).json({message: "Token Invalid"});
	}
	if(!decodedToken)
		return res.status(401).json({message: "Token Invalid"});
    
	const user =  await User.findById(decodedToken.user_id);
	if(user=="Fail")
		return res.status(404).json({message: "User not found"});

	if(user? user.passChangeTime>decodedToken.iat : true)
		return res.status(401).json({message: "Password changed"});

	if(user? !user.adminConfirmed : true)
		return res.status(403).json({message: "Not approved"});
	
    if(user? user.firstTime : true){
        await user.removeFirstTimeFlag();//remove when doing UI
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


exports.getMeetingStatus = async (req, res, next) => {
    const assignedLinks = await req.user.getAssignedLinks();
    const anyOther = await req.user.getIfAnyOtherLive();
    links = []
    if(assignedLinks=='Fail' || anyOther=='Fail')
        return res.status(500).json({message: 'Fail'});

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
};


exports.putEditProfile = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(422).json({message: "Vaildate Error"});

    const {fname,lname,email} = req.body;
    const user = new User(req.user.id);
    user.setFname(fname);
    user.setLname(lname);
    user.setEmail(email);
    const result = await user.save(1);

    if(result=='Fail')
        return res.status(500).json({message: "Fail"});

    if(result=='Email Error')
        return res.status(409).json({message: result});
    
    return res.status(201).json({message: result});

};


exports.putChangePassword = async (req,res,next) =>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json({message: "Vaildate Error"});

    const {password,opassword} = req.body;

	req.user.setPassword(opassword);

    const auth = await req.user.authenticate();

    if(auth=='Fail')
        return res.status(500).json({message: "Fail"});

    if(auth=='Failed Auth' || auth.user_id!=req.user.id)
        return res.status(401).json({message: "Failed Auth"});

	const pass = await req.user.changePassword(password);
    
	if(pass=='Fail')
        return res.status(400).json({message: "Fail"});
		
    return res.status(201).json({message: "Success"});
        
}

exports.deleteAccount = async(req,res,next) =>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json({message: "Vaildate Error"});

    const password = req.body.password;
	req.user.setPassword(password);
    const auth = await req.user.authenticate();

    if(auth=="Fail")
        return res.status(500).json({message: "Fail"});

    if(auth=="Failed Auth")
        return res.status(401).json({message: "Failed Auth"})
	
    const deleted = await req.user.deleteById();

	if(deleted=="Fail")
        return res.status(500).json({message: "Fail"});
	
	return res.status(201).json({message: "Success"});
}
exports.postAssignLink = async (req,res,next)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json({message: "Vaildate Error"});

	const link = req.body.link_id;

    const assign = await req.user.assignLink(link);

    if(assign=="Fail")
        return res.status(500).json({message: "Fail"});
    if(assign=="Not Found")
        return res.status(404).json({message: "Link not Found"});
    
    return res.status(201).json({message: assign});
    
    
}

exports.deleteUnassignLink = async (req,res,next)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json({message: "Vaildate Error"});

    const link = req.body.link_id;
    const unassign = await req.user.unAssignLink(link);

    if(unassign=="Fail")
        return res.status(500).json({message: "Fail"});

    return res.status(200).json({message: unassign});
};
exports.postSignUp = async(req,res,next)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json({message: "Vaildate Error"});
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
    if(result=='Fail'){
        return res.status(422).json({message: 'Fail'});
    }
    if(result=='Email Error'){
		return res.status(409).json({message: 'Email Error'});
	}
	return res.status(201).json({message: result});
};

exports.putSetTheme = async (req,res,next)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty())
		return res.status(422).json({message: "Vaildate Error"});
    
    const value = req.body.theme;
	let theme = 1;
	if(value == "light") theme = 0;
	req.user.setTheme(theme);
	const result = await req.user.saveTheme();
	res.status(200).json({message: "Success"});
}