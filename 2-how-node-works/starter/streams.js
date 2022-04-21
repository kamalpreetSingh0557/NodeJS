const fs = require('fs');
const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
//Solution 1
// fs.readFile('test-file.txt', (err, data)=> {
//     if(err) console.log(err);
//     res.end(data);
// })

// //Solution 2
// const readable = fs.createReadStream('test-file.txt');
// readable.on('data', chunk => {
//     res.write(chunk);  // Writes in stream
// });
// readable.on('end', () => {
//     res.end();
// });
// readable.on('error', err => {
//     console.log(err);
//     res.statusCode = 500;
//     res.end("File not Found!");
// });

//Solution 3
const readable = fs.createReadStream('test-file.txt');
// readableSource.pipe(writeableDest) [Format]
readable.pipe(res);
});

server.listen(8000, '127.0.0.1', ()=>{
    console.log('Server is listening');
});