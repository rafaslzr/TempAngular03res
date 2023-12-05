# Performance Considerations

## Bundle Size
> Beware of adding too many packages to your application. 

You should only bring in packages with a limited scope and a small size to handle what you need to do. 

Most functionality is already included in Angular itself. For example, there should be no reason to include jquery in an Angular application. 

> Use [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) to determine what is adding to the size of your bundle.

## AOT
Always use [Ahead Of Time compiling](https://angular.io/guide/aot-compiler) when deploying to upper environments. Instead of the browser creating a javascript function out of the template when it is retrieved at runtime, this will be done instead at build time.

## Lazy-Loading
You application's initial load will become a concern as it begins to grow. At a certain point, you will need to code-split your application and load in chunks as the user traverses to specific functionality. Organize your code in feature modules from the beginning to ease this transition aplying [Lazy-loading feature modules](https://angular.io/guide/lazy-loading-ngmodules).


Lazy-Loading is a design pattern that solves the problem of delaying an object load or initialisation until the moment it's really required.

> **DON’T** load all components in `app.module.ts` by default. Instead, create a *module* and *router.module* for each “big chunk of components” you want to group.

For example, creating them with **angular-cli**:
```shell
ng generate module example –-routing
```

Go to modules/example in project folder to check the new created files:
```
|____ example-routing.module.ts
|____ example.component.css
|____ example.component.html
|____ example.component.spec.ts
|____ example.component.ts
|____ example.module.ts
```

Modify `example-routing.module.ts`:
```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExampleComponent } from './example.component';

const routes: Routes = [
	{
    path: '',
    component: ExampleComponent
	  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExampleRoutingModule { }
```

Now you can call it from `app-routing.module.ts`:

```typescript
const routes: Routes = [
 {
  path: '',
  component: MainComponent,
  children: [
 {
  loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
      }]
  },
{ path: '**', redirectTo: 'example' },
];
```
This way, `app.module.ts` is cleaner, simpler and the components load responsibility will rely on their correspondent router.

Another use case could be when our Example component has child components and routes:

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExampleComponent } from './example.component';

const routes: Routes = [
  {
    path: '',
    component: ExampleComponent,
    children: [
     {
       path: '',
       redirectTo: 'example-child',
	          pathMatch: 'full'
     },
     {
       path: 'example-child',
       loadChildren:  import('./modules/example/child/child.module').then(m => m.ChildOneModule)
     },
     {
       path: 'example-child-two',
       loadChildren: import('./modules/example/child-two/child-two.module').then(m => m.ChildTwoModule)
     }
    ]  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExampleRoutingModule { }
```

## Virtual Scrolling
You may encounter a situation where you have a component that has the possibility to scroll through a long list of items. 

In some cases, the items can grow so long that the browser will actually degrade in performance. In order to combat this, you can use a virtual scrolling technique to only request and render to the DOM the actual window of items the user needs to see. 

**Virtual Scrolling** is supported in Angular version 7+ using the @angular/cdk ([Component Development Kit](https://material.angular.io/cdk/categories)) package. Angular has extensive documentation, demos, and code examples [here](https://material.angular.io/cdk/scrolling/overview).

# Server Side Rendering
Consider using [Angular Universal](https://angular.io/guide/universal) to implement server side rendering of your application. 

Using this method, the server will immediately return a page of static content that matches what your client side components would look like. Dynamic content is then added in after the Angular app loads. This has the effect of a faster load time. 

An additional benefit of Server Side Rendering is that it allows your client side application pages to be indexed by a search engine.

