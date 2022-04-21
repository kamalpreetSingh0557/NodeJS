//const EventEmitter = require('events');
const http = require('http');
//------------------------------------------
// Best practice to create multiple listeners for single EventEmitter
// class Sales extends EventEmitter{
//     constructor(){
//     super();
//     }
// }

// const myEmitter = new Sales();
// //------------------------------------------
// // const myEmitter = new EventEmitter();
// myEmitter.on('newSale', ()=> {
//     console.log('There is a new sale');
// });

// myEmitter.on('newSale', (stock)=> {
//     console.log(`Item purchased : ${stock-1} items left`);
// });

// myEmitter.emit('newSale', 9);

//  Server
const server = http.createServer();

server.on('request', (req, res)=>{
    console.log(req.url);
    console.log("request 1 received");
    res.end('Request is received');
});

server.on('request', (req, res)=>{
    console.log(req.url);
    console.log('Another Request is received');
// We can only send one response[for single EventEmitter with multiple listeners] 
    //res.end('Another Request is received'); 
});

server.on('close', ()=>{
    console.log('server is closed');
});

server.listen(8000, '127.0.0.1', ()=> {
    console.log("Server is listening for requests");
});
