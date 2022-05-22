const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const crypto = require('crypto'); // Lec 135 ForgotPassword [module to generate random string for Token]

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'A User must have name']
    },
    email : {
        type : String,
        required : [true, 'A User must have email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, 'Please enter valid email']
    },
    photo : String,
    password : {
        type : String,
        required : [true, 'User must enter password'],

        minlength : 8,
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true, 'Please enter confirm Password'],
        validate : {// Custom Validator
            //This only works on CREATE & SAVE
            validator : function(el){
                return el == this.password; //if it returns false then it 
            },                    //throws the error and display below message
            message : 'Passwords are not same!'
        }
    }, 
    passwordChangedAt : Date, // Lec 132
    passwordResetToken : String, // Lec 135
    passwordResetExpires : Date, // Lec 135
    role : {
        type : String,
        //enums are basically used for restricting the values of a particular field in the schema.
        //enum validator in order to only allow certain types of roles here to be specified
        enum : ['user', 'guide', 'lead-guide', 'admin'],
        default : 'user'  
    }
});

// MIDDLEWARES

userSchema.pre('save', async function(next){
// Only run this function if new password[meaning new user] is created
//or Password was actually modified
    if(!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete the passwordConfirm field    
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next){
// So, basically, we want to exit this middleware function right away, 
// if the password has not been modified or if the document is new, 
// and so we can use the isNew property
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now(); // [see why -1000] in Lec 137
    console.log('resetPass');
    console.log(this.passwordChangedAt);
    
    next();
});

//----------------------------------------------------------------------------------------

// INSTANCE METHODS
/*
We're creating an instance method. So an instance method is basically a method
that is gonna be available on all documents of a certain collection
It's defined on a userSchema
*/

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

/*
The this keyword actually points to the current document. But in this case, since we have the password
set to [select : false] and because of that, this.password will not be available.
So ideally we would do it like this, and so this way we would only need to pass in the candidatePassword and not the userPassword.
But again, right now that's not possible because the password is not available in the output.
And so that's why we actually have to pass in userPassword as well.
*/

userSchema.methods.changedPasswordAfter = async function(JWTTimestamp){
    console.log('inside changed password : ' + this.passwordChangedAt);
    if(this.passwordChangedAt){
        console.log('inside if : ' + this.passwordChangedAt);
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000 , 10);
        
        console.log(changedTimestamp, JWTTimestamp);
// If the user had changed their password after the token was issued we don't want to give access to the protected route.        
        return JWTTimestamp < changedTimestamp; // 200 < 300  
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
// random string ka TOKEN bnaya
   const resetToken = crypto.randomBytes(32).toString('hex');
// TOKEN ko encrypt kiya   
// Note : isse humnei DB mein value update kri hai, ye values DB mein save nhi hui
   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

   //console.log(resetToken, this.passwordResetToken); // See difference
   console.log({resetToken}, this.passwordResetToken);

   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

   return resetToken;
}

/*
1) We will return the plain text token because that's we're gonna send through the email.

2) We sent one token via email and then we have the encrypted version in our database.
*/
//----------------------------------------------------------------------------------------
const User = mongoose.model('User', userSchema);

module.exports = User;