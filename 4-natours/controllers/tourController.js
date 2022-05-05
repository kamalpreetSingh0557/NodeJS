const fs = require('fs');

//console.log('tour controller');
//console.log("process.cwd(): ", process.cwd() + '../models/tourModels');

const Tour = require('./../models/tourModels')

exports.getAllTours = async(req, res) => {
   try{
    // 1A) Filtering
    console.log(req.query);
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advance Filtering [less than, leass than equals to, greter than, greater than equals to]
    
/* 
    Querying inside URL :- 
    127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy&page=2&limit=10
    
    duration[gte]=5  :- Key[Operator] = Value
---------------------------------------------------------------------------------------------
    Manually writing "Filter" object for Querying in MongoDB
  (i)  {difficulty : 'easy', duration : {$gte : 5}}  When we want to use an operator, we need to start another object.
    
    // queryObject [console.log(req.query)] when using standard way of filtering [Querying inside URL]
  (ii)  { difficulty: 'easy', duration: { gte: '5' }}

  Comparing (i) & (ii) we see that 
    queryObj does not have MongoDB operator "$" in front of operator name "gte"
*/

    let queryStr = JSON.stringify(queryObj);
    //console.log(queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const query = Tour.find(JSON.parse(queryStr)); 
    const tours = await query;

        res.status(200).json({
            status : 'success',
            // requestedAt : req.requestTime,
            results : tours.length,
            data : {                        //JSend method used
                tours
            }
        })
   }
   catch(err){
        res.status(400).json({
            status : "fail",
            message : err
        });
   }
};

exports.getTour = async(req, res) => {
    try{
        const tour = await Tour.findById(req.params.id);
        // Behind the Scenes
        // Tour.findOne({ _id : req.params.id });
        res.status(200).json({
            status : "Success",
            data : {
                tour
            }
        }); 
    }
    catch(err){
        res.status(400).json({
            status : "fail",
            message : "Tour not found"
        });
    }
    
};

exports.createTour = async(req, res) => {
    // const newTour = new Tour();
    // newTour.save()
    const newTour = await Tour.create(req.body);
    try{
        res.status(201).json({
            status : 'success',
            data : {
                newTour
            }
        });
    }
    catch(err){
        res.status(400).json({
            status : 'fail',
            message : err,
        });
    }
};

exports.updateTour = async(req, res) => {
    try{
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            setValidator : true
        })
        res.status(200).json({
            status : "Success",
            data : {
                updatedTour 
            }
        });
    }
    catch(err){
        res.status(400).json({
            status : 'fail',
            message : err
        })
    }
};

exports.deleteTour = async(req, res) => {
    try{
        const deletedTour = await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status : "Success",
            data : {
                deletedTour 
            }
        });
    }
    catch(err){
        res.status(400).json({
            status : 'fail',
            message : err
        })
    }
};
 /*
        console.log(req.query);
        // 1st method
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Conceptual Thing refer notes in lecture 95
        const query = Tour.find(queryObj);   //Tour.find(queryObj) returns "QUERY"

        // const query = Tour.find({  // filter object
        //     duration : 5,            
        //     difficulty : 'easy'
        // });

        const tours = await query;

        // 2nd Method [CHAINING using Special Mongoose Methods]
        //const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
 */