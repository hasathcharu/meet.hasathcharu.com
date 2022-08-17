const {validationResult} = require('express-validator');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

exports.postLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        res.status(422).json({message: "Failed Auth"});
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = new User();
    user.setEmail(email);
    user.setPassword(password);
    try{
        const auth = await user.authenticate()
        if(auth[0].length==0){
            return res.status(422).json({message: "Failed Auth"});
        }else{
            const user = auth[0][0];
            const token = jwt.sign(user,process.env.JWT_ACCESS_SECRET,{expiresIn:'10h',algorithm:'HS256'});
            return res.status(200).json({userId: user.user_id, email: user.email, accessToken: token});
        }
    }
    catch(error){
        console.log(error);
        return res.json({message: "Fail"});
    }
};
