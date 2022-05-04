//npm i mongoose
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name : {
      type : String,
      required : [true, 'A tour must have name'],
      unique : true
    },
    duration : {
      type : Number,
      required : [true, 'A tour must have duration']
    },
    maxGroupSize : {
      type : Number
    },
    difficulty : {
      type : String
    },
    ratingsAverage : {
      type : Number,
      default : 4.5
    },
    ratingsQuantity : {
      type : Number,
      default : 0
    },
    price : {
      type : Number,
      required : [true, 'A tour must have price']
    },
    priceDiscount : Number,
    summary : {
      type :String,
      trim : true, 
      required : [true, 'A tour must have summary']
    },
    description : {
      type : String,
      trim : true
    },
    imageCover : {
      type : String,
      required : [true, 'A tour must have cver image']
    },
    images : [String],
    createdAt : {
      type : Date,
      default : Date.now()
    },
    startDates : [Date],
});
  
  const Tour = mongoose.model("Tour", tourSchema);
  
// Method 1  
//   const testTour = new Tour({
//     name : "The Streets Camper",
//     price : 470
//   });
  
//   testTour
//     .save()
//     .then(doc => console.log(doc))
//     .catch(err => console.log(`Error is ${err}`));

  module.exports = Tour;  