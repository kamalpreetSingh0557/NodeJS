const fs = require('fs');
//----------------------------------------------------------
// process.cwd() is similar to "./"
// console.log("tourController");
// console.log("process.cwd(): ", process.cwd());
// console.log("__dirname: ", __dirname);
// console.log(`${__dirname}/../dev-data/data/tours-simple.json`);

// __dirname = E:\NodeJS Workspace\4-natours\routes
// __dirname/.. = E:\NodeJS Workspace\4-natours
//----------------------------------------------------------
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.checkBody = (req, res, next) => {
    console.log('inside bodyChecker');
    console.log(req.body);
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status : "fail",
            message : "Missing name or price"
        })
    }
    // if(req.body.name == '' && req.body.price == null){
    //     return res.status(400).json({
    //         status : "Invalid Details",
    //         message : "Please fill the details"
    //     })
    // }
    next();
}

//custom function bnaya so that jo id hm hr function mein check kr rhre hain wo ek function mein krle 
// So, middleware hr req se pehle id validate kr lega humein hr func mein check krne ki zarurat nhi

//[Removed due to Refactoring MVC]
// exports.checkID = (req, res, next, val) => {
// // converting string into number type [req.params.id * 1] 
//     if( req.params.id * 1 > tours.length){  
//         return res.status(404).json({
//             status : "Fail",
//             message : "Invalid ID"
//         })
//     }
//     next();
// }

exports.getAllTours = (req, res) => {
    //console.log(req.requestTime);
    res.status(200).json({
        status : 'success',
        requestedAt : req.requestTime,
        // results : tours.length,
        // data : {                        //JSend method used
        //     tours
        // }
    })
};

exports.getTour = (req, res) => {
    //[Removed due to Refactoring MVC]
    //console.log(req.params); // { id: '5' } id string type ki hai
    // const id = req.params.id * 1; // converting string into number type

    // const tour = tours.find(el => el.id === id);

    // if(!tour){  // if tour is invalid
    //     return res.status(404).json({
    //         status : "Fail",
    //         message : "Invalid ID"
    //     })
    // }

    res.status(200).json({
        status : "Success",
        data : {
            tour
        }
    });
};

exports.createTour = (req, res) => {
    res.status(201).json({
        status : "success",
        // data : {
        // tour : newTour
        // }
    });
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status : "Success",
        data : {
            tour : "<Tour is updated>"
        }
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({  // 204 => No Data
        status : "Success",
        data : {
            tour : null
        }
    });
};
