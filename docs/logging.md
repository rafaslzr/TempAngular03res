# LOGGING
Logging can be a powerful tool, especially when logs are sent back to the server for analysis. There are some libraries out there that can be leveraged to help with this such as [ngx-logger](https://www.npmjs.com/package/ngx-logger). 

However, it is not too difficult to write your own leveraging Angular Services, which are also singletons. This service can then be injected anywhere it is needed. Adding server log collection together with global error handling gives you a powerful combination of detecting issues that are occurring in your application. 

Here are some considerations to be made when adding logging functionality to your application:
- The logger should try to match the log levels that are already in the console (debug, error, info, log, warn). This helps so that they can be optionally printed to the console with the matching level. Allow logging to console to be turned on or off. Seeing logs in the console is helpful in lower environments but should be turned off in production.
- The logger should be able to turn on and off its different levels. The levels should closely match the different levels available in the console. Development environments are more verbose, and production is typically only warnings and errors. Your team should come up with guidance on levels and how to add logs and enforce them on peer review. The logger should import the environment and then set the log levels accordingly.
- The logger should also be configurable as to how often it sends logs to the server. It should collect and store log data in memory, if no data exists, it will not attempt to send a request.
- The logger should send a final request to the server when the browser closes. This can be done leveraging the "beforeunload" event in the window.
```typescript
window.addEventListener("beforeunload", () => {
  // send logs
})
```
- Use the HTML5 [Navigator.sendBeacon()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) to send data to the server. This API is specifically designed for sending logs to a server and uses a separate process to complete the request. This means that the logging will not take away from the performance of your application. Also, it allows for requests to be sent in crashing situations where "beforeunload" is fired. XHR requests are often canceled in this scenario when the browser crashes, but sendBeacon is more reliable and can capture more data on when these situations occur.
