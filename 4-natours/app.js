const express = require('express');

const morgan = require('morgan'); //logging middleware

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// process.cwd() is similar to "./"
// console.log("process.cwd(): ", process.cwd());
// console.log("__dirname: ", __dirname);

// 1) MIDDLEWARE
app.use(morgan("dev")); //it returns a middleware function just like 
// How to see documentation
// see from morgan on github[index.js] module.exports wala function dekho [source code]
// we {http method, url, status code, res time, size of res in bytes}

app.use(express.json()); 

app.use((req, res, next) => {
    console.log("Hello form Middleware");
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// 3) ROUTES
// Mounting the new router on a route
// We cannot use routers before we actually declare them
// If now there is a request for '/api/v1/tours/:id'
// The req will enter the middleware stack an when it hits below mentioned 
// middleware it will run tourRouter because this route here is matched 
// and then it enters userRouter  
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);  

// 4) Start Server
module.exports = app; 