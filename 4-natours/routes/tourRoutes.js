const express = require('express');
const tourRouter = express.Router(); // it returns a middleware OR it is a middleware function
const fs = require('fs');

// process.cwd() is similar to "./"
console.log("process.cwd(): ", process.cwd());
console.log("__dirname: ", __dirname);
console.log(`${__dirname}/../dev-data/data/tours-simple.json`);

// __dirname = E:\NodeJS Workspace\4-natours\routes
// __dirname/.. = E:\NodeJS Workspace\4-natours
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status : 'success',
        requestedAt : req.requestTime,
        results : tours.length,
        data : {                        //JSend method used
            tours
        }
    })
};

const getTour = (req, res) => {
    //console.log(req.params); // { id: '5' } id string type ki hai
    const id = req.params.id * 1; // converting string into number type

    const tour = tours.find(el => el.id === id);

    if(!tour){  // if tour is invalid
        return res.status(404).json({
            status : "Fail",
            message : "Invalid ID"
        })
    }

    res.status(200).json({
        status : "Success",
        data : {
            tour
        }
    });
};

const createTour = (req, res) => {

    //what we do now is we will persist the new data[created by POST] in simple-json file
        const newId = tours[tours.length-1].id + 1; // new Id na rhe hai naye Tour ki [last TourId + 1]
        const newTour = Object.assign({id : newId}, req.body); // Assign 2 diff objects ko combne krke ek new object bnata hai
    
        tours.push(newTour);
    
        fs.writeFile(
           `${__dirname}/dev-data/data/tours-simple.json`,  // Write File isliye kr rhe hain because 
            JSON.stringify(tours),                          // "GET" request krne pr wo json file se read 
            err => {                                        // krke dega. Hence, use bhi update kro
              // 201 for new File crration
                res.status(201).json({
                    status : "success",
                    data : {
                    tour : newTour
                    }
                });
            }
        )   
    };

const updateTour = (req, res) => {
    
    if( req.params.id * 1 > tours.length){  
        return res.status(404).json({
            status : "Fail",
            message : "Invalid ID"
        })
    }

    res.status(200).json({
        status : "Success",
        data : {
            tour : "<Tour is updated>"
        }
    });
};

const deleteTour = (req, res) => {
    
    if( req.params.id * 1 > tours.length){  
        return res.status(404).json({
            status : "Fail",
            message : "Invalid ID"
        })
    }

    res.status(204).json({  // 204 => No Data
        status : "Success",
        data : {
            tour : null
        }
    });
};

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