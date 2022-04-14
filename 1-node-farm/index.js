const fs = require('fs');
const http = require('http');
//////////////////////////////////////////////////////////////////
// FILES
//              Blocking, synchronous way

// const fileIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// // console.log(fileIn);
// const textOut = `This is what we know : ${fileIn}`;
// const fileOut = fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('File written');

//             Non-blocking, asynchronous way

// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1)=>{
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2)=>{
//         console.log(data2);
//         fs.writeFile('./starter/txt/final.txt', `${data2}`, 'utf-8', err => {
//             console.log('File has been written');
//         })
//     })    
// })
// console.log("Will Read File!");

//////////////////////////////////////////////////////////////////
// SERVER
const server = http.createServer((req, res) => {
    res.end(" Hello from server! ");
});

server.listen(8000, "127.0.0.1", (req, res) => {
    console.log("Listening to request on port 8000");
})

