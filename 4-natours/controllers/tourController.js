const fs = require('fs');
const { findOneAndUpdate } = require('./../models/tourModels');

//console.log('tour controller');
console.log("process.cwd(): ", process.cwd() + '../models/tourModels');
const Tour = require('./../models/tourModels')
//----------------------------------------------------------
// process.cwd() is similar to "./" 
// console.log("tourController");
// console.log("process.cwd(): ", process.cwd());
// console.log("__dirname: ", __dirname);
// console.log(`${__dirname}/../dev-data/data/tours-simple.json`);

// __dirname = E:\NodeJS Workspace\4-natours\routes
// __dirname/.. = E:\NodeJS Workspace\4-natours
//----------------------------------------------------------
//[Removed due to Refactoring MVC]

// exports.checkBody = (req, res, next) => {
//     console.log('inside bodyChecker');
//     console.log(req.body);
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status : "fail",
//             message : "Missing name or price"
//         })
//     }
//     next();
// }

exports.getAllTours = async(req, res) => {
   try{
        const tours = await Tour.find();
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
            message : "Data not found"
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
