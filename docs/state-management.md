# State Management

## @Input and @Output
Using instance variables and **@Input** and **@Output** variables is the simplest way of managing state between components. This is the most effective way of sharing state if components are reasonably distanced from each other along the same branch in the component tree (one to two nodes away). This is not recommended if the components are not within the same branch, because passing variables up and down many branches of the tree can become cumbersome.

## Services
If state needs to be shared between two or more components that are in separate areas of the hierarchical tree (not directly related), then one option would be to store that state in a service and inject the service into any components that need this state. Ideally, you would use an **Observable Subject** (or **BehaviorSubject**) which each component would subscribe to and automatically receive state updates. This can be a good approach if instances of shared state are sparse.

## NgRx (a Flux pattern)
Using a javascript state container such as NgRx is a more robust way of handling state. This is another recommended approach if you have state that needs to be shared across disparate components in your component tree. Consider this approach instead of shared services if you have some of the following scenarios:

* There are many scenarios in your application where state should be shared
* You have complex cases for updating and managing the state
* You have situations where you need to merge two or more shared states together to contrive a new state
* You are managing real time updates to state through websockets or SSE in addition to request/response

NgRx is a powerful library that enables better debugging and testing of all state changes. For example, NgRx directly integrates with the [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) that can be directly added to your browser's developer console. While NgRx is powerful, it is not recommended to store every piece of state within the state container. Setting up actions, reducers, effects, and selectors for each state slice amounts to a lot of boilerplate code and can unnecessarily add to the complexity of the app. Recommend to use NgRx when the complexity of the situation demands it. See the [following](https://ngrx.io/guide/store/why) for more guidance on when to use NgRx.

>Additionally, it is an extra library to add to your bundle. If your application does not have complex state requirements, the bundle can be kept smaller by not adding in this extra library.

