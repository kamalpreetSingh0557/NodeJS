const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const {getAllUsers, getUser, createUser, updateUser, deleteUser} = userController;

const router = express.Router(); 

router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updatePassword', authController.protect, authController.updatePassword);

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
