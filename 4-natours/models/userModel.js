const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    role : {
        type : String,
        //enums are basically used for restricting the values of a particular field in the schema.
        //enum validator in order to only allow certain types of roles here to be specified
        enum : ['user', 'guide', 'lead-guide', 'admin'],
        default : 'user'  
    }
});

userSchema.pre('save', async function(next){
// Only run this function if password[new User] is created
//or Password was actually modified
    if(!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete the passwordConfirm field    
    this.passwordConfirm = undefined;
    next();
});

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
        return JWTTimestamp < changedTimestamp; // 300 < 200  
    }
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;