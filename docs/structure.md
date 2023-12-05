# Structure

Follow the [Angular Style Guide](https://angular.io/guide/styleguide) as a first step. This will not only help your project stay organized, but will help other Angular developers understand and become productive quickly when joining your project. To add on to the Angular Style Guide, here are a few more recommendations to keeping a well-organized codebase.

## Functions
**Do use** *camelCase* to define functions, including when the function is separately defined in one file and imported to another.

**Why?**
>Helps to instantly recognize the import as a function instead of a class. Style Guide recommends all classes by UpperCamelCase, so keeping functions as regular camelCase helps to immediately distinct between a class and a function.

`example-util.ts`
```typescript
export const exampleUtil => () {
  console.log('we are here');
}
```

`example.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { exampleUtil } from './example-util'; 

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
})
export class exampleComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    exampleUtil();
  }
}
```


## Observables
**Do declare** *Observable* variables using a '$' suffix as a naming convention

**Why?**
>Helps to instantly recognize the variable as an observable. If you want a property to store the most recent value from an observable, it can be convenient to simply use the same name with or without the '$'. This helps to immediately align the property along with the observable that is watching changes to update it.

`example.component.ts`
```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html'
})
export class StopwatchComponent {
  stopwatchValue: number;
  stopwatchValue$: Observable<number>;

  start() {
    this.stopwatchValue$.subscribe(num =>
      this.stopwatchValue = num
    );
  }
}
```

## Constants and Mocks
**Do use** *CAPS* to define constants or mocks, including when the constant (or mock) is separately defined in one file and imported to another


**Why?**
>Helps to instantly recognize the import as a constant (or mock) instead of a class or function. (Style Guide recommends all classes by UpperCamelCase, functions are camelCase).

___

**Do use** the suffix *.const.ts* for a file that contains only constant definitions.
**Do use** the suffix *.mock.ts* for a file that contains only a mock definition.

**Why?**
>Helps to instantly recognize the contents of the file

___

**Do use** the same name as the model file for the mock file. For example, *user.ts* and *user.mock.ts*

**Why?**
>Helps to instantly align the mock with the model contract

`example.const.ts`
```typescript
export const STATUS = 'fetching data';
example.mock.ts

import { example } from './example' // model definition

export const EXAMPLE = {
  name: 'Dan',
  email: 'dan@accenture.com'
} as example;
example.service.ts

import { Injectable } from '@angular/core';
import { STATUS } from './example.const';
import { EXAMPLE } from './example.mock';

@Injectable({
  providedIn: 'root',
})
export class ExampleService {

  constructor() { }

  getData() {
    console.log(STATUS);
    return EXAMPLE;
  } 
}
```

## Private Members
**Do use** '_' as a prefix on private variables and functions.

**Why?**
>Helps to instantly recognize the variable or function as private

`example.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { exampleUtil } from './example-util'; 

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
})
export class ExampleComponent implements OnInit {
  private _initiated;

  constructor() { }

  ngOnInit() {
    this._initiated = true;
  }

}
```

## Routes
**Do use** *kebab-case* uniformly across all routes.

**Why?**
>Helps readability of the route as well as SEO indexing (if paired with Server Side Rendering through Angular Universal)

`app.module.ts`
```typescript
const routes: Routes = [
  { path: 'sample-route-one', component: FirstComponent },
  { path: 'sample-route-two', component: SecondComponent },
  { path: '',   redirectTo: '/sample-route-one', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
```

## Module Organization
It is recommended that features should always be organized into feature modules. Typically, these will often match a menu structure, or a navigation structure. If the code is organized in this fashion, it becomes easy to add an advanced feature such as [lazy loading](https://angular.io/guide/lazy-loading-ngmodules) where a code-split chunk of the application is loaded as the user enters that area of the application (clicking that area of the menu for example). This **Organization Principle** should be adhered to from beginning to end to enable your application to **scale** gracefully.
```
src
├── app
│   └── feature1
│       └── feature1-component1
│       └── feature1-component2
│       └── feature1-module
│       └── sub-feature1
│           └── sub-feature1-component1
│           └── sub-feature1-component2
│           └── sub-feature1-module
│   └── feature2
│       └── feature2-component1
│       └── feature2-component2
│       └── feature2-module
```

## Shared Code
The Angular [Style Guide](https://angular.io/guide/styleguide) recommends that code be organized by feature. It is common (especially in large applications) that you may need to share pieces of code between components in a feature, a parent feature, or even application wide.

**Do adopt** a standard dir name such as 'shared' to hold commonalities between members. In a multi-tiered feature scenario, there would be a 'shared' folder to hold what's necessary to be shared at that level. For example code that is needed to be global is in a top level 'shared' dir, necessary to be shared within a feature would be in a 'shared' dir at the feature level, and necessary to be shared within a sub-feature would be in a 'shared' dir at the sub-feature level. If demand for a shared piece of code grows as the application gets larger, it can be promoted upwards as necessary.

**Why?**
>This helps keeps things local to a feature if necessary, and eliminate a large shared directory which will make it harder to locate items. Also, will keep code local to a **code-split chunk** (if using a code-splitting technique) rather than adding all shared code to the first global chunk.

`Shared Code By Features`
```
src
├── app
│   └── feature1
│       └── shared
│       └── feature1-component1
│       └── feature1-component2
│       └── feature1-module
│       └── sub-feature1
│           └── shared
│           └── sub-feature1-component1
│           └── sub-feature1-component2
│           └── sub-feature1-module
│   └── feature2
│       └── shared
│       └── feature2-component1
│       └── feature2-component2
│       └── feature2-module
│   └── shared
```

## Core Code
The core module is a module that is only imported once in the *AppModule* and never again in the other modules.

This is such an important point to remember that there is actually code to ensure that your core module is only imported one time in your application (which can happen if you're working as part of a large team), put this code in the class constructor under the core folder:

```typescript
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. You should only import Core modules in the AppModule only.');
    }
  }
}
```

The core folder should contain your singleton services, for example: user.service.ts, authentication.service.ts, error.interceptor.ts, etc. Think of any service, component, or directive that needs to be available globally within your application and that does not require more than one instantiation.

`Core Code By Application`
```
src
├── app
│   └── feature1
│       └── shared
│       └── feature1-component1
│       └── feature1-component2
│       └── feature1-module
│       └── sub-feature1
│           └── shared
│           └── sub-feature1-component1
│           └── sub-feature1-component2
│           └── sub-feature1-module
│   └── feature2
│       └── shared
│       └── feature2-component1
│       └── feature2-component2
│       └── feature2-module
│   └── shared
│   └── core
```