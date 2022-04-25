const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); 

app.use((req, res, next) => {
    console.log("Hello form Middleware");
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status : 'success',
        requestedAt : req.requestTime,
        results : tours.length,
        data : {                        //JSend method used
            tours
        }
    })
});

//This middleware doesn't runs because the above "req" ends the req-res cycles
// Hence ordering of middleware matters.
// app.use((req, res, next) => {
//     console.log("Hello form Middleware");
//     next();
// }); 


app.get('/api/v1/tours/:id', (req, res) => {
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
    });                

app.post('/api/v1/tours', (req, res) => {

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
});

app.patch('/api/v1/tours/:id', (req, res) => {
    
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
});   

app.delete('/api/v1/tours/:id', (req, res) => {
    
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
});

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port : ${port}...`);
})    