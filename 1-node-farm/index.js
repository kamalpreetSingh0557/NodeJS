const { Console } = require('console'); // Core Modules
const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');  // 3rd Party Modules

const replaceTemplate = require('./modules/replaceTemplate') // Apni Modules
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
const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // Ye object mein convert kr deta hai

//console.log(slugify('Fresh Avocado', {lower : true}));
const slugs = dataObj.map(el => slugify(el.productName, {lower : true}));
console.log(slugs);

const server = http.createServer((req, res) => {
    //const pathName = req.url;
    // console.log(req.url);
    // console.log(url.parse(req.url, true));
    const {query, pathname} = url.parse(req.url, true);
    // routing in NodeJS
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type' : 'text/html'})
        // map => objects pe lgta hai is liye dataObj not data.map()
        //placeholders ko [in template-product] data [in data.json] se replace kr dia hai
        //and usko [HTML format] se [ek string] mein convert kr dia hai using [join(' ')]
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        //console.log(output);
        res.end(output);
    }else if(pathname === '/product'){
        res.writeHead(200, {'Content-type' : 'text/html'});
        //console.log(req.url);
        //console.log(url.parse(req.url, true)); [query, pathname]
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }else if(pathname === '/api'){
        res.writeHead(200, {'Content-type' : 'application/json'});
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

