//npm i mongoose
const mongoose = require('mongoose');
//npm i dotenv
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//VVimp Ordering
// We want to run the code that is in the ".env" file.
// And then only after that we want to run the code that is in the "app" file.

const app = require('./app');

let DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
console.log(DB);
// we pass in an object with some options and these are just some options 
// that we need to specify in order to deal with some deprecation warnings.
mongoose.connect(DB, {   // returns a promise
  useNewUrlParser : true, // gives a connection object
  useCreateIndex : true,
  useFindAndModify : false
})
.then(con => {
  // console.log(con.connections);
  console.log("DB connection successful!");
})
.catch(err => console.log(err));
//console.log(app.get('env')); //Now this env variable here is actually set by Express,
//    console.log(process.env); //A bunch of stuff that for some reason node JS internally needs.
//These variables, they come from the process core module
//    console.log(process.env.NODE_ENV);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port : ${port}...`);
});

