//npm i dotenv
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//VVimp Ordering
// We want to run the code that is in the ".env" file.
// And then only after that we want to run the code that is in the "app" file.

const app = require('./app');
//console.log(app.get('env')); //Now this env variable here is actually set by Express,
console.log(process.env); //A bunch of stuff that for some reason node JS internally needs.
//These variables, they come from the process core module
console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port : ${port}...`);
});
