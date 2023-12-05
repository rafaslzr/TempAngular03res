# RxJS Best Practices

> [RxJS](https://rxjs.dev/) is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code. This project is a rewrite of Reactive-Extensions/RxJS with better performance, better modularity, better debuggable call stacks, while staying mostly backwards compatible, with some breaking changes that reduce the API surface

## Observables

- By convention, all observable variables end with "$".

- When using observables, use appropriate pipeable operators for data manipulation prior to subscribing, usually in a service:

```typeScript
getUsersFilterName(name: string): Observable<Users[]> {
    return this.http.get<Users[]>(this.url)
        .pipe(
            tap(user => ... do logging ),
            filter(user => user.name === name),
            map(user => {
                ... do mapping
            })
        );
}
```

- Unsubscribe to observables when it is not needed anymore to prevent memory leaks creating an observable:
  In a service:
```typescript
private user = new Subject<User>();

updateUser(newUser: User) {
    // this can be an http call
    this.user.next(newUser);
}

getUserUpdatedObservable(): Observable<User> {
    return this.user.asObservable();
}
```
  - Or in the component:
  
```typescript
private userSub: Subscription;
...
ngOnInit(): void {
    this.userSub = this.service.getUserUpdatedObservable()
        .subscribe(data => {
            ... do some work
        });
}

ngOnDestroy(): void {
  this.userSub.unsubscribe();
}
```

- If you have more than one **Subscription**, use *takeUntil* or *takeWhile* operators:

```typescript
isSubscribed = false;

ngOnInit(): void {
    this.isSubscribed = true;
    this.service.getUserUpdatedObservable1()
        .pipe(takeWhile(() => this.isSubscribed))
        .subscribe(data => {
            ... do some work
        });
    this.service.getSomethingElseObservable()
        .pipe(takeWhile(() => this.isSubscribed))
        .subscribe(data => {
            ... do some work
        });
}

ngOnDestroy(): void {
  this.isSubscribed = false;
}
```

- Do not expose **Subjects**. Use a *getter* because you should not use have a public variable after a private variable
```typescript
private user = new Subject<User>();
// userObservable$ = this.user.asObservable();  do not do this - bad practice 

getUserUpdated(newUser: User) {
    // this can be an http call
    this.user.next(newUser);
}

getUserUpdatedObservable(): Observable<User> {
    return this.user.asObservable();
}
```

- Avoid having nested subscriptions. Avoid this scenario:

```typescript
ngOnInit(): void {
    this.activatedRoute.subscribe(params => {
        const id = params.get('id')
        this.service.getSomething(id).subscribe((data: Data) => {
            this.someVariable = data;
        })       
    });
}
```
- This requires to manage two subscriptions, two data and error paths, and also would be difficult to test. Instead, use operators such as *switchMap*:

```typescript
// In this instance it flatters the observable
ngOnInit(): void {
    this.activatedRoute.pipe(
        switchMap(params => {
            return this.service.getSomething(params.get('id'));
        })
    ).subscribe((data: Data) => {
        this.someVariable = data;
    });
}
```

