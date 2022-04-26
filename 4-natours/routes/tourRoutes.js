const express = require('express');

const tourController = require('./../controllers/tourController')

console.log("process.cwd(): ", process.cwd());
console.log("__dirname: ", __dirname);

const {getAllTours, getTour, createTour, updateTour, deleteTour } = tourController;

const tourRouter = express.Router(); // it returns a middleware OR it is a middleware function

// tourRouter is the subapplication that we created 
//which in turn hai its own routes
tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = tourRouter;