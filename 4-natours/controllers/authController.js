const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

exports.signUp = async(req, res, next) => {
    try{
        const newUser = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            passwordConfirm : req.body.passwordConfirm
        });

        const token = jwt.sign({id : newUser._id}, process.env.JWT_SECRET, {
            expiresIn : process.env.JWT_EXPIRES_IN
        });

        res.status(201).json({ // 201 for creation
            status : "success",
            message : "New user created",
            token,
            data : {
                newUser
            }
        });
    }
    catch(err){
        res.status(400).json({
            status : 'fail',
            message : err
        });
    }
};

exports.login = async(req, res, next) => {
    const {email, password} = req.body;
    // 1) Check if user entered email and password
    if(!email || !password){
        return res.status(400).json({
            status : 'fail',
            message : 'Please enter email or password'
        });
    }
    try{
    // 2) Check is user exist and password is correct
// Explicitly selecting password [even when "select:false" in schema]
// so that pass is not visible in get request for users    
        const user = await User.findOne({email}).select('+password'); 
/* 
How do i match my encrypted Pass in DB to the one which user entered while loggingIn
"abcxyz1234" === "12$lDGOdlzLuQ8W8.udyoF5Sq/KS.Bn9dx9gs.Em6ZIQHZ"
So the only way of doing it is to actually encrypt this password["abcxyz1234"]
as well, and then compare it with the encrypted one
                 Checking  DONE IN USER MODEL
*/

        const correct = user.correctPassword(password, user.password);
    // 3) If everything is ok, send token to client
        const token = " ";
        res.status(200).json({
            status : "success",
                message : "User loggedIn",
                token
        })
    }catch(err){
        return res.status(400).json({
            status : 'fail',
            message : err
        });
    }
}
