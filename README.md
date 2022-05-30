# node-advanced

Node.js Threads -

https://medium.com/@joydipand/how-does-thread-pool-work-in-node-js-c48f3b3662a9#:~:text=In%20Node%2C%20there%20are%20two,that%20are%20used%20by%20node.

In Node, there are two types of threads: one Event Loop (aka the main loop, the main thread, event thread, etc.), and a pool of k Workers in a Worker Pool (aka the thread pool). The libuv library maintains a pool of threads that are used by node.js to perform long-running operations in the background, without blocking its main thread.

Node uses the Worker Pool to handle “expensive” tasks. This includes I/O for which an operating system does not provide a non-blocking version, as well as particularly CPU-intensive tasks.

In general, before submitting the work request you’d convert V8 engine’s JavaScript objects (such as Numbers, Strings) that you received in the function call from JavaScript code to their C/C++ representations and pack them into a struct(v8 is not thread-safe so it’s a much better idea to do this here than in the function we’re going to run). After the function running on the separate thread finishes, libuv will call the second function from the work request with the results of the processing. As this function is being executed back in the main thread, it’s safe to use V8 again. Here we’d wrap the results back into V8 objects and call the JavaScript callback.

When at least one thread in the thread pool is idle, the first work request from the queue is assigned to that thread. Otherwise, work requests await threads to finish their current tasks.

The default size of libuv’s thread pool is 4. That is the reason why, out of our 5 calls to the pbkdf2 function, one of them finished after around 880 mili-seconds instead of 450 mili-seconds. Since all threads in the thread pool were busy, the remaining tasks in the work queue had to wait for one of those threads to finish, then get through their work, and to finally end after 880 seconds.

Its default size is 4, but it can be changed at startup time by setting the UV_THREADPOOL_SIZE environment variable to any value (the absolute maximum is 128).

if I set process.env.UV_THREADPOOL_SIZE = 5 then the fifth task will also finish in approx 450 mili-seconds.

So if the worker pool can handle asynchronous tasks then why event-loop is needed?
Reason:

1. The event loop to execute JavaScript and also performs some asynchronous operation orchestration there (e.g. sending/receiving network traffic, depending on OS support for true asynchronous operations as exposed via libuv).
2. The worker pool handles asynchronous I/O operations for which there is weak kernel support, namely, file system operations (fs) and DNS operations (dns); and is also used for asynchronous CPU-bound work in Node.js core modules, namely compression (zlib) and cryptography (crypto).