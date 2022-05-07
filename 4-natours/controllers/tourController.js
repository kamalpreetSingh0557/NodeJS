const fs = require('fs');

//console.log('tour controller');
//console.log("process.cwd(): ", process.cwd() + '../models/tourModels');

const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apifeatures');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

// class APIFeatures{
//     constructor(query, queryString){
//         this.query = query;
//         this.queryString = queryString
//     }

//     filter() {
//         const queryObj = {...this.queryString};
//         const excludedFields = ['page', 'sort', 'limit', 'fields'];
//         excludedFields.forEach(el => delete queryObj[el]);
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
//         this.query = this.query.find(JSON.parse(queryStr)); 
//         return this;
//     }

//     sorting() {
//         if(this.queryString.sort){
//             const sortBy = this.queryString.sort.split(',').join(' ');
//             this.query = this.query.sort(sortBy);
//         }else{
//             this.query = this.query.sort('_id'); 
//         } 
//         return this;
//     }

//     limitFields(){
//         if(this.queryString.fields){
//             const fields = this.queryString.fields.split(',').join(' ');
//             this.query = this.query.select(fields);
//         }else{
//             this.query = this.query.select('-__v');
//         }

//         return this;
//     }

//     pagination() {
//         const page = this.queryString.page * 1 || 1;
//         const limit = this.queryString.limit * 1 || 100;
//         const skip = (page-1) * limit;
//         this.query = this.query.skip(skip).limit(limit);
    
//         // if(this.queryString.page){ 
//         //     const numTours = await this.query.countDocuments();
//         //     if(skip >= numTours){
//         //         throw new Error("This page does not exist")
//         //     }
//         // }

//         return this;
//     }
// }

exports.getAllTours = async(req, res) => {
   try{ 
// EXECUTING QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sorting()
            .limitFields()
            .pagination();
        //console.log(features);
        const tours = await features.query;

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

exports.getTourStats = async(req, res) => {
    try{
        const stats = await Tour.aggregate([
            { // match = similar to filter
                $match : { ratingsAverage : { $gte : 4.5 }}
            },
//Statistics for all the tours together,     

//             {
//                 $group : { 
//                     _id : null,
// //For each of the document that's gonna go through this pipeline, one will be added to this numTours
//                     numTours : {$sum : 1},
//                     numRatings : {$avg : "$ratingsQuantity"},
//                     avgRating : {$avg : "$ratingsAverage"},
//                     avgPrice : {$avg : "$price"},
//                     minPrice : {$min : "$price"},
//                     minPrice : {$max : "$price"},
//                 }
//             }


//Grouping our results for different fields
            {
                $group : { 
                    _id : { $toUpper : "$difficulty"}, // we can even,do some operations with this one
                    //_id : "$difficulty", 
                    //_id : "$ratingsAverage",
                    numTours : {$sum : 1},
                    numRatings : {$avg : "$ratingsQuantity"},
                    avgRating : {$avg : "$ratingsAverage"},
                    avgPrice : {$avg : "$price"},
                    minPrice : {$min : "$price"},
                    minPrice : {$max : "$price"},
                }
            },
            {
                $sort : { avgPrice : 1 } // 1 for Ascending
            },
            { // we can repeat stages
                $match  : { _id : { $ne : "EASY"}}
            }
        ])

        res.status(200).json({
            status : "Success",
            data : {
               stats 
            }
        });
    }
    catch(err){
        res.status(400).json({
            status : 'fail',
            message : err
        })
    }
}
 /*
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