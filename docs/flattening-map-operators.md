# Flattening Map Operators

Flattening operators are a powerful way to nest observables without needing to handle multiple subscriptions. Use the correct one for each case to avoid **race condition**.

> A **race condition** or **race hazard** is the condition of an electronics, software, or other system where the system's substantive behavior is dependent on the sequence or timing of other uncontrollable events. It becomes a bug when one or more of the possible behaviors is undesirable. [Wikipedia](https://en.wikipedia.org/wiki/Race_condition).

Let's take a look at four of the RxJS flattening operators in more depth. We will use the following code sample of click events from a login button and the affects of the different operators:

```typescript
ngOnInit() {
    // simulate login button clicks with numbered events for readability
    from(["1", "2", "3"]).pipe(
        tap(event => console.log(`click ${event}`)),
        (concatMap | mergeMap | switchMap | exhaustMap)(event => this.login(event))
    )
    .subscribe(response => {
        console.log(response);
    });
};

login(event): Observable<any> {
    // simulate different endpoint response times
    // click 1 - 300ms
    // click 2 - 400ms 
    // click 3 - 200ms
    const delayTime = {
        1: 300,
        2: 400, 
        3: 200
    };
    return of(`login ${event} success`).pipe(delay(delayTime[event]));
}
```


### concatMap
Runs subscriptions/requests in order and is less performant. 
  > Use for GET, POST and PUT requests when order is important.


  - Ensure execution in the order events arrive.
  - Most common operator for HTTP requests.
  
  Console results from the above code sample:
```
// click 1
// click 2
// click 3
// login 1 success
// login 2 success
// login 3 success
```

### switchMap
Cancels the current subscription/request and can cause race condition. 
  > Use for GET requests or cancelable requests like searches.

  - Switch execution to the new event and cancel any execution that has not completed from previous events.
  - Good use for autocompletes as the most recent event is used

  Console results:
```
// click 1
// click 2
// click 3
// login 3 success 
```

### mergeMap
Runs subscriptions/requests in parallel. 
> Use for GET, PUT, POST and DELETE methods when order is nor important.

- Execute events in parallel.
- Good for getting results as fast as possible when order does not matter.

Console results:

```
// click 1
// click 2
// click 3
// login 3 success
// login 1 success
// login 2 success
```


### exhaustMap
Ignores all subsequent subscriptions/requests until it completes. 
  > Use for login when you do not want more requests until the initial one is complete.

  - Wait for inner observable to complete before allowing any new events.
  - Good for preventing accidental double execution.
  - Login buttons are a great use case for exhaustMap

  Console results:
```
// click 1
// click 2
// click 3
// login 1 success
```
