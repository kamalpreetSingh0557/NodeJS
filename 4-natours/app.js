const express = require('express');
const fs = require('fs');

const app = express();

// app.get('/', (req, res) => {
//     res
//       .status(200)
//       .json({
//             message : 'Hello from server !..',
//             app : 'Natours'
//         })
//     });

// app.post('/', (req, res) => {
//     res.send("Post you details");
//     });

// app.use(MIDDLEWARE) 
// app.use => Middleware ko use krne ke liye use kiya jata hai
app.use(express.json()); 

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status : 'success',
        results : tours.length,
        data : {                        //JSend method used
            tours
        }
    })
});

app.post('/api/v1/tours', (req, res) => {
    //express.json() MIDDLEWARE used to acces the "req.body" data.
    
    //console.log(req.body);
    //res.send(`Data sent to server`);

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

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port : ${port}...`);
})    