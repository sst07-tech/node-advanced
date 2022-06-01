// In this code you would notice almost all the requests here are taking the same amount
// of time. But since we know the libuv default thread pool is 4 so how requests more than 4 are also taking the same amount of
// time. In this scenario the libuv delegates the request to the underlying operating system. So, it's our OS that does the real http request.
// Libuv used to issue the request and then it just waits on the OS to emit a signal that some response has come back to the request. So because
// operating system is making the request, there is no blocking of the JS code inside of our event loopor anything else inside of our application.
// Everything or all the work is being done by OS itself and we are not touching the thread pool in this.


const https = require('https');

const start = Date.now();

function doRequest() {
    https.request('https://www.google.com', res => {
        res.on('data', () => { });
        res.on('end', () => {
            console.log(Date.now() - start);
        });
    }).end();
}

doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();