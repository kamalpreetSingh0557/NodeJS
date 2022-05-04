const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//const Tour = require(`${__dirname}/../../models/tourModel`);
const Tour = require('./../../models/tourModels');

 dotenv.config({ path: `${__dirname}/../../config.env` });
 let DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// console.log(`${__dirname}`);
// console.log(process.cwd());
//console.log(`${fs.readFileSync(__dirname/tours-simple.json)}`);


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

//Read JSON File
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Import data into DB
const importData = async () => {
    try{
        console.log(typeof tours)
        await Tour.create(tours);
        console.log('Data successfully added');
        process.exit();
    }
    catch(err){
        console.log(err);
    }   
};

 // Delete all data from DB
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log('Data successfully deleted');
        process.exit();
    }
    catch(err){
        console.log(err);
    }   
};

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}

//console.log(process.argv);