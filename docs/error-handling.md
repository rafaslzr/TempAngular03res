# Error Handling

## ErrorHandler Subclass
Angular defines an [ErrorHandler](https://angular.io/api/core/ErrorHandler) class that will allow us to override it and handle custom logic. Using this technique, we can do the following

- Show some sort of notification to the user via a dialog or growl-like component.
- Send the error details to the server for logging.
  
Whatever the next steps will be, here is how to setup the scenario to globally catch all errors. The first step is to subclass the ErrorHandler class.

```typescript
import { ErrorHandler, Injectable} from '@angular/core';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor() { }
  handleError(error) {
     // custom error logging 
     
     // IMPORTANT: Rethrow the error otherwise it gets swallowed
     throw error;
  }
  
}
```

In our app module, we will override the providers section to use this new class as a replacement for the default ErrorHandler class.

`app.module.ts`
```typescript
import { NgModule, ApplicationRef, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GlobalErrorHandler } from './error-handler';
import { ServicesModule } from './services';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: ErrorHandler, 
      useClass: GlobalErrorHandler
    }
  ]
})
export class AppModule { }
```

If you manually throw an error anywhere in your application, you should see the console.log statement now being written.

This is a a handy place to add a logger service, particularly if the logger service sends the logs back to the server. However, since error handling is really important it needs to be loaded first, thus making it not possible to use dependency injection in the constructor to get other services such as the error handle api service to send the server our error details. As a result, we have to manually call the injector with the service name in the execution of the handleError function. Here's an example:

```typescript
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoggingService } from '../services';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

constructor(private injector: Injector) { }

handleError(error) {
    const loggingService = this.injector.get(LoggingService);
    const message = error.message ? error.message : error.toString();

    // log on the server
    loggingService.log({ message });

    throw error;
  }  
}
```

You can also use the [stacktrace-js](https://www.stacktracejs.com/) package to get a stacktrace of the code where the error occurred.

```typescript
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { LoggingService } from '../services';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

constructor(private injector: Injector) { }

handleError(error) {
    const loggingService = this.injector.get(LoggingService);
    const location = this.injector.get(LocationStrategy);
    const message = error.message ? error.message : error.toString();
    const url = location instanceof PathLocationStrategy
      ? location.path() : '';
   
    // get the stack trace, lets grab the last 10 stacks only
    StackTrace.fromError(error).then(stackframes => {
      const stackString = stackframes
        .splice(0, 20)
        .map(function(sf) {
          return sf.toString();
        }).join('\n');
      
      // log on the server
      loggingService.log({ message, url, stack: stackString });
    });
    throw error;
  }
}
```

## HTTP Error Handler
Alternatively (and recommended), Angular defines a HTTP Error Handles class that allows us to specifically catch HTTP errors globally. An ideal use case for using HTTP error handlers (also called [HttpInterceptor](https://angular.io/api/common/http/HttpInterceptor)) is when you want to capture and log errors related to calls 'to and from' an API/service or server. You will likely encounter such a need when hosting your app on a cloud platform like AWS where a service like Cloudwatch or AppInsights needs to log errors from your application.

### Interceptors
An interceptor is a method that intercepts an operation when it just gets triggered and just before it nears its completion, for example, making an HTTP call to any source outside of the client when we need to add headers or tokens.

### Error Interceptor
An error interceptor is a special type of interceptor which is used for handling errors while making an HTTP request from both client or server sides when the request fails due to any reason. 

`httperrorinterceptor.service.ts`
```typescript
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            console.log('Client side error');
            errorMsg = `Error: ${error.error.message}`;
          }
          else {
            console.log('Server side error');
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          }
          console.log(errorMsg);
          return throwError(errorMsg);
        })
      )
  }
}
```


Again, in our app module, we will register the interceptor:

`app.module.ts`
```typescript
import { NgModule, ApplicationRef, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GlobalErrorHandler } from './error-handler';
import { ServicesModule } from './services';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './httperrorinterceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
```
