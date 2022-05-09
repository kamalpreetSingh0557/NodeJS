const User = require('./../models/userModel');

exports.signUp = async(req, res, next) => {
    try{
        const newUser = await User.create(req.body);
        res.status(201).json({ // 201 for creation
            status : "success",
            message : "New user created",
            data : {
                newUser
            }
        })
    }
    catch(err){
        res.status(400).json({
            status : 'fail',
            message : err
        });
    }
};