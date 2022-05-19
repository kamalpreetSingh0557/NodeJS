const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController')

const {getAllTours, getTour, createTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan} = tourController;

// console.log("tourRoutes");
// console.log("process.cwd(): ", process.cwd());
// console.log("__dirname: ", __dirname);
const router = express.Router(); // it returns a middleware OR it is a middleware function

// v1
// router.param('id', (req, res, next, val) => {
//   console.log(`Tour id is : ${val}`);
//   next(); // agr next() nhi hoga to req aage nhi jayegi aur whi pe stuck ho jayegi
// });       // bs load hoti rhegi

//v2 [Removed due to Refactoring MVC]
//router.param('id', checkID);       

// router is the subapplication that we created 
//which in turn hai its own routes

router         // Lec 102 [Aggregation Pipeline]
  .route('/tour-stats')
  .get(getTourStats);

router         // Lec 103 [Aggregation Pipeline : Real World Problem]
  .route('/monthly-plan/:year')
  .get(getMonthlyPlan);


router         // Lec 100 [Aliasing]
  .route('/top-5-tours')
  .get(aliasTopTours, getAllTours);

router
  .route('/')
  .get(authController.protect, getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(authController.protect, authController.restrictTo('admin') ,deleteTour);

module.exports = router;