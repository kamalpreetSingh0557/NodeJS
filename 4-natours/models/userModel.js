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
        minlength : 8
    },
    passwordConfirm : {
        type : String,
        required : [true, 'Please confirm your password'],
        validate : {// Custom Validator
            //This only works on CREATE & SAVE
            validator : function(el){
                return el == this.password; //if it returns false then it 
            },                    //throws the error and display below message
            message : 'Passwords are not same!'
        }
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
})

const User = mongoose.model('User', userSchema);

module.exports = User;