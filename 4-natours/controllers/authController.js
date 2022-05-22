const {promisify} = require('util'); 
//[Lec 132] for converting this {jwt.verify(token, process.env.JWT_SECRET);} [from returning "callback"] to retur "promises"
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../utils/email');
const crypto = require('crypto'); // Lec 137 for resetPassword

const signToken = id => {
    console.log(process.env.JWT_EXPIRES_IN);
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    });
}

exports.signUp = async(req, res, next) => {
    try{
        const newUser = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            passwordConfirm : req.body.passwordConfirm,
            passwordChangedAt : req.body.passwordChangedAt,
            role : req.body.role  
        });

        console.log(newUser);

        const token = signToken(newUser._id);

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
    try{    
        const {email, password} = req.body;
        // 1) Check if user entered email and password
        if(!email || !password){
            return res.status(400).json({
                status : 'fail',
                message : 'Please enter email or password'
            });
        }
    
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

            const user = await User.findOne({email}).select('+password');
            const correct = await user.correctPassword(password, user.password);
            if(!user || !correct){
                return res.status(400).json({
                    status : 'fail',
                    message : 'email or password is incorrect'
                });
            }
    If the user doesn't exist here, then this next line of code cannot really run   
    Because for example, user.password is not gonna be available.      
    And so we actually need to move only this code, we're gonna move it here into the if else statement.
    And so in this way, if the user does not exist, so if this is true,well then it will not even run this code here,
    and then there's not gonna be any problem. But if the user exists, then it will also run this code        
    */
        if(!user || !(await user.correctPassword(password, user.password))){
            return res.status(401).json({
                status : 'fail',
                message : 'email or password is incorrect'
            });
        }

        // 3) If everything is ok, send token to client
        const token = signToken(user._id);
        res.status(200).json({
            status : "success",
            message : "User loggedIn",
            token
        })
    }catch(err){
        console.log(err);
        return res.status(400).json({
            status : 'fail',
            message : err
        });
    }
};

exports.protect = async(req, res, next) => {
    try{
        // 1) Getting token and check if it's there
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        //console.log(token);

        if(!token){
            return res.status(401).json({
                status : 'fail',
                message : 'Please login to get access to the tours'
            })
        }

        // 2) Verification token [1. Check if payload (_id) has not been altered by 3rd Party Apps, 2. Token Expire to nhi hua[JWT_EXPIRES_IN = 5] ] 
        
        //This verification process is in charge of verification if no one altered the ID that's in the payload of this token.
        /*This function accepts callback [function] as a third argument. So this callback is then gonna run as soon as the verification has been completed. This verifies here that it is actually an asynchronous function. So it will verify a token, and then after that when it's done it will then call the callback function that we can specify. Now, we've been working with promises all the time, and I don't really want to break that pattern here. And so, we are actually going to promisifying this function. So basically, to make it return a promise.*/
        //---------------------------------------------------------------------------------------------------------------------------------------- 
        // jwt.verify(token, process.env.JWT_SECRET, callback); callback
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // promise
        //console.log(decoded);

        // 3) Check if user still exists
    
        //Let's pretend someone created a user then logged in, and let's say then, after some time the user was deleted.
        //But in the meantime, someone could've gotten access to that JWT, and could now try to log in as that user that was, in fact, already deleted.

        const currentUser = await User.findById(decoded.id);
        //console.log(currentUser.passwordChangedAt);
        
        if(!currentUser){                
            return res.status(401).json({
                status : 'fail',
                message : 'The User belonging to this token no longer exists..'
            });
        }

//-----------------------------------------------------------------------------------------------------------------------------------------
        // 4) Check if user changed password after the token was issued
       
                                    // NOT WORKS PROPERLY, hence COMMENTED OUT

        // console.log(currentUser.changedPasswordAfter(decoded.iat));
        // if(!(currentUser.changedPasswordAfter(decoded.iat))){
        //     console.log('inside if of changed password in authController');
        //     return res.status(401).json({
        //         status : 'fail',
        //         message : 'User has changed password. Please login again..'
        //     });
        // }

        /*
        Check if user has recently changed their password. So basically, after the token was issued and to implement this test, we will actually create another instance method.
        So basically, a method that is going to be available on all the documents. So documents are instances of a model.
        And we do this because it's quite a lot of code that we need for this verification.
        And so, actually, this code belongs to the User model and not really to the controller.
        */        
//---------------------------------------------------------------------------------------------------------------------------------------- 

        //GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    }
    catch(err){
        console.log('catch : ' + err);
        return res.status(401).json({
            status : 'fail',
            message : err
        });
    }
};

exports.restrictTo = (...roles) => { // returning Middleware
    // roles ['admin', 'lead-guide']
    return (req, res, next) => {
        if(!(roles.includes(req.user.role))){ // req.user coming from "protect" {req.user = currentUser}
            return res.status(403).json({
                status : 'fail',
                message : 'You do not have permission to perform this action'
            });
        }
        next();
    }

};

exports.forgotPassword = async(req, res, next) => {
    try{
        // 1) Get user based on POSTed email
        const user = await User.findOne({email : req.body.email});

        if(!user){
            return res.status(404).json({
                status : 'fail',
                message : 'No User found with this eMail'
            });
        }
        // 2) Generate the random reset token

        const resetToken = user.createPasswordResetToken();
    // Note : isse humnei DB mein value update kri hai, ye values DB mein save nhi hui
    // to save updated Values in DB
        
        // await user.save();
        await user.save({validateBeforeSave : false});

        // 3) Send it to User's email

        try{      // created in Lec 136
            //email mein link ayega usko click krne pe reset kro password
            const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
            const message = `Forgot your password? Submit a PATCH request with your new 
            password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your 
            password, please ignore this email!`;

            await sendEmail({
                email : req.body.email, // user.email
                subject : 'Your password reset token is (valid for 10 min)',
                message
            });

            res.status(200).json({
                status : "success",
                message : "Token sent to email !..",
            })
        }catch(err){
            user.passwordResetToken = undefined ; // Lec 136
            user.passwordResetExpires = undefined ; // Lec 136

            await user.save({validateBeforeSave : false});
            console.log(err);

            res.status(500).json({
                status : "fail",
                message : `There was error in sending email. Try again later !.. : ${err}`,
            })
        }        
    }
    //--------------------------------------- forgotPassword CATCH
        catch(err){
            return res.status(400).json({
                status : 'fail',
                message : err
            });
        }
};

exports.resetPassword = async(req, res, next) => {
    try{
    // 1) Get user based on token
    // Here hum plain token ko "hash" krke usko encrypted/hashed token in DB se compare krenge
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            passwordResetToken : hashedToken,
            passwordResetExpires : { $gt : Date.now() }
        })

    // 2) If token has not expired, and there is user, set the new password
    // Since findOne mein agr user mila to mtlb token expire nhi hua hoga tbhi user mila hai na
        if(!user){
            return res.status(400).json({
                status : 'fail',
                message : 'Token is invalid or has expired'
            
            })
        }

        user.password = req.body.password ;
        user.passwordConfirm = req.body.passwordConfirm ;
        // password modify kiya hai abhi DB mein save nhi hua
        // to ab hum passwordResetToken and passwordResetExpires ko delete ke rhe hain
        user.passwordResetToken = undefined ;
        user.passwordResetExpires = undefined ;
    // We not used findOneAndUpdate, because for everything related to passwords and to the user,
    // we always use save, because we always want to run all the validators, and the save middleware functions.
        await user.save();

    // 3) resetToken check kro ki expire to nhi hua 
        // handled by middleware in userModel

    // 4) Log the user in, send JWT
        const token =  signToken(user._id);

        res.status(200).json({
            status : "success",
            token
        });
    }
    catch(err){
        return res.status(400).json({
            status : 'fail',
            message : err
        })
    }
}