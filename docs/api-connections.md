# API Connections & Mocking

## Environments
Use [environment file configurations](https://angular.io/guide/build) to separately declare any url differences for backend connections per each environment. 

**DO NOT hardcode** host URL's directly in service file code, this should be a configuration. Even if the root url is the same for all environments (for example, exposed through a proxy as '/api' everywhere), keeping this as a configuration gives the application more flexibility for the future.

## Local Proxy
When working locally, you will not have the backend services on the same server as the local server that is serving your application. In order to avoid [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (or pre-flight) errors when connecting to the backend services, you can use the [proxy configuration](https://angular.io/guide/build#proxying-to-a-backend-server) that comes included when you setup your application using **angular-cli**. This is the most convenient way to connect to live services. Avoid opening CORS headers on the backend for this scenario.

When working locally, it is often advantageous to be able to connect to multiple different backend environments, especially if you are debugging some specific data setup that seems to be troublesome. A good way to set this up is to include multiple `proxy.conf.env` files within the codebase. This way, developers can quickly switch between environments.

## HttpInterceptor
When connecting to backend services, you typically will have some type of auth flow that first completes a sign-in process and then includes a security token on all backend requests. The best way to handle this process is to use an [HttpInterceptor](https://angular.io/api/common/http/HttpInterceptor) (also, see [Intercepting request and responses](https://angular.io/guide/http#intercepting-requests-and-responses)) Interceptors are a great way to add global headers to backend connection requests in one location, and also do other things such as provide api logging, globally handle API errors, evaluate performance of backend API requests. DO NOT manually add headers to every request in each service, HttpInterceptors help keep operations like this DRY.

# Mocking

## Dev Enablement
Developing mock files can be a valuable asset so that rudimentary front end development can occur prior to a live backend service being available. At a rudimentary level, a mock can be directly returned from a service instead of a live service. You can also tie this into a simple feature flipper. This is helpful especially when working against a development backend where critical services occasionally go down. In this instance, you may be able to simply flip some features to mocks and be able to run some features locally. As a good practice, all features should be coded in this way and be able to revert to mocks where reasonably feasible.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FeatureFlipperService } from './feature-flipper.service'
import { Hero } from './hero';
import { HEROES } from './mock-heroes';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  constructor(private baseUrl: string, private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    return (FeatureFlipperService.getFeature('hasMockHeroes')) ? of(HEROES) : this.http.get(`${this.baseUrl}\heroes`);
  }
}
```

A more advanced technique to mocking can also be taken. There is a package called [angular-in-memory-web-api](https://www.npmjs.com/package/angular-in-memory-web-api) which not only hosts your mocks on the live endpoints, it also enables some level of creating, updating, and deleting assuming some standard REST principles. This is a bit more useful when you also need to simulate transactions as well as reads.

## Testing with Mocks
It is common practice to import the same mock files within specs and perform unit tests. 
> **It is a good practice** to make a copy of the mock data if the test you're performing ends up mutating the data. What can happen is that the mock itself can be mutated by reference, and another test can run and expect the data in its original form. 

Since unit tests are not guaranteed to run in the same order all the time, this can lead to flakey unit test runs which are extremely hard to debug. **Always copy mocked data** when importing them into tests.