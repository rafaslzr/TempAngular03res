# Common Patterns

Reactive Functional Programming is a vast topic, and getting used to the rxjs operators and marble diagrams takes practice. Here are a few common recipes for practical topics on the front end.

### Issue Multiple Requests At Once, Take Action Once All Have Completed
```typescript
let users$ = this.userService.getUsers();
let activities$ = this.activitiesService.getActivities();

// send both requests at once and emit once when both requests have emitted results
forkJoin([users$, activities$]).subscribe([users, activities] => {
  this.mergeData(users, activities);
});
```

### Cache Results in a Service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FeatureFlipperService } from './feature-flipper.service
import { Hero } from './hero';
import { HEROES } from './mock-heroes';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  private heroes: Hero[];

  constructor(private baseUrl: string, private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    if (!heroes) {
      return this.http.get(`${this.baseUrl}\heroes`).pipe(
        tap(heroes => this.heroes = heroes)
      );
    } else {
      return of(heroes);
    }
  }
}
```

### Polling a Backend Service on an Interval

```typescript
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, timer, Subscription, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap, share, retry, takeUntil } from 'rxjs/operators';
export type Currency = 'EUR' | 'USD' | 'GBP';
export interface CurrencyInfo {
   currency: Currency;
   exchangeRate: number;
}
@Injectable()
export class CurrencyService implements OnDestroy {
  private allCurrencies$: Observable<CurrencyInfo[]>;
  private stopPolling = new Subject();
  constructor(private http: HttpClient) {
    this.allCurrencies$ = timer(1, 3000).pipe(
       switchMap(() => http.get<CurrencyInfo[]>('http://localhost:8000/currencyInfo')),
       retry(),
       share(),
       takeUntil(this.stopPolling)
    );
  }
  getAllCurrencies(): Observable<CurrencyInfo[]> {
      return this.allCurrencies$;
  }
  ngOnDestroy() {
     this.stopPolling.next();
  }
}
```

### Typeahead Control That Makes a Service Call

```typescript
import { fromEvent, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap
} from 'rxjs/operators';

fromEvent(document.getElementById('type-ahead'), 'keyup')
  .pipe(
    debounceTime(200),
    map((e: any) => e.target.value),
    distinctUntilChanged(),
    switchMap(fakeContinentsRequest),
    tap(c => (document.getElementById('output').innerText = c.join('\n')))
  )
  .subscribe();
```