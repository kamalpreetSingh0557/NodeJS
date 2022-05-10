const User = require('./../models/userModel');

exports.getAllUsers = async(req, res) => {
    try{
        const users = await User.find();
        res.status(200).json({
            status : "success",
            data : {
                users
            }
        });
    }
    catch(err){
        res.status(400).json({
            status : "error",
            message : err
        })
    }
    
};

exports.getUser = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not defined yet"
    })
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not defined yet"
    })
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not defined yet"
    })
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not defined yet"
    })
};
