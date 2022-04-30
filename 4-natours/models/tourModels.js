//npm i mongoose
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name : {
      type : String,
      required : [true, 'A tour must have name'],
      unique : true
    },
    ratings : {
      type : Number,
      default : 4.5
    },
    price : {
      type : Number,
      required : [true, 'A tour must have price']
    }
  });
  
  const Tour = mongoose.model("Tour", tourSchema);
  
  const testTour = new Tour({
    name : "The Streets Camper",
    price : 470
  });
  
  testTour
    .save()
    .then(doc => console.log(doc))
    .catch(err => console.log(`Error is ${err}`));