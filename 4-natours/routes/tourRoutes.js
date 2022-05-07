const express = require('express');
const tourController = require('./../controllers/tourController')

const {getAllTours, getTour, createTour, updateTour, deleteTour, aliasTopTours, getTourStats} = tourController;

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

router         // Lec 100 [Aliasing]
  .route('/tour-stats')
  .get(getTourStats);

router         // Lec 100 [Aliasing]
  .route('/top-5-tours')
  .get(aliasTopTours, getAllTours);

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;