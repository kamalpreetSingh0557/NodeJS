const express = require('express');
const userRouter = express.Router(); 

//2) Route Handlers or Controllers


const getAllUsers = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not defined yet"
    })
};

const getUser = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not defined yet"
    })
};

const createUser = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not defined yet"
    })
};

const updateUser = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not defined yet"
    })
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not defined yet"
    })
};


userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = userRouter;
