const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

process.env.UV_THREADPOOL_SIZE = 10;


/**
 * Why is the https request always executed last in the below example?
 * 
 * The reason for this is that node places DNS lookup on the threadpool, but not the actual https requests themselves.
 * So the request needs to wait for the threadpool top become available. A simple way to test this is to use IP address instead of DNS.
 * 
 * nslookup google.com gives "https://172.217.14.228"
 * e.g.
 * 
 * const googleURL = "https://172.217.14.228";
function doRequest() {
    https.request(googleURL, { servername: "www.google.com" }, res => {
        res.on('data', () => { });
        res.on('end', () => {
            console.log('Request: ', Date.now() - start);
        });
    }).end();
}
}
 * 
 */

function doRequest() {
    https.request('https://www.google.com', res => {
        res.on('data', () => { });
        res.on('end', () => {
            console.log('Request: ',Date.now() - start);
        });
    }).end();
}


// const googleURL2 = "https://172.217.14.228";
// function doRequest() {
//     https.request(googleURL2, { servername: "www.google.com" }, res => {
//         res.on('data', () => { });
//         res.on('end', () => {
//             console.log('Request: ', Date.now() - start);
//         });
//     }).end();
// }

function doHash(){
    crypto.pbkdf2('a','b',100000,512,'sha512',() => {
        console.log('Hash:', Date.now() - start);
    });
}

doRequest();

fs.readFile('multitask.js', 'utf-8', () => {
    console.log('FS:', Date.now() - start);
})

doHash();
doHash();
doHash();
doHash();