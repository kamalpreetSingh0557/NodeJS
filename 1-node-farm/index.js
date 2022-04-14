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
    const pathName = req.url;
    // routing in NodeJS
    if(pathName === '/' || pathName === '/overview'){
        res.end('This is the Overview');
    } else if(pathName === '/product'){
        res.end('This is the Product');
    }else if(pathName === '/api'){
        const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
        res.end(data);
    }else{ // Always "header-content" "res" se pehle likho
        res.writeHead(404, {
            'Content-type' : 'text/html',
            'my-own-header' : 'hello-world'
        });
        res.end("<h1>Page Not Found! </h1>");
    }
});

server.listen(8000, "127.0.0.1", (req, res) => {
    console.log("Listening to request on port 8000");
})

