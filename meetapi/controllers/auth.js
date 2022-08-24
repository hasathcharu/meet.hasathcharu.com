const {validationResult} = require('express-validator');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

exports.postLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({message: "Failed Auth"});
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = new User();
    user.setEmail(email);
    user.setPassword(password);
    const authenticatedUser = await user.authenticate()
    if(authenticatedUser=="Failed Auth")
        return res.status(422).json({message: "Failed Auth"});
    if(authenticatedUser=="Fail")
        return res.status(500).json({message: "Fail"});
    const token = jwt.sign(authenticatedUser,process.env.JWT_ACCESS_SECRET,{expiresIn:'10h',algorithm:'HS256'});
    return res.status(200).json({userId: authenticatedUser.user_id, email: authenticatedUser.email, accessToken: token});
};
