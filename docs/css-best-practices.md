# CSS Best Practices

## Lint
Use [stylelint](https://stylelint.io/) to set rules about creating styles. Extend off of the [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) to customize as needed. You can use this (and should use this) to enforce no **!important** declarations, as an example.

> Other recommended Linter code formatters are: 
> - [airbnb](https://github.com/airbnb/javascript) 
> - [prettier](https://prettier.io/)

## Global vs Local
- All global css should be applied to style.css, and vendor scripts (for global application) should be configured in **angular.json** file.

```yaml
"styles": [
  "./node_modules/vendor/vendor.css",
  "styles.css"
]
```

- All local css should be used in the component itself by taking advantage of **View Encapsulation**.
- You don't need to specify "encapsulation: ViewEncapsulation.Emulated" because it is default mode.
- ViewEncapsulation can be ViewEncapsulation.Emulated, 
- ViewEncapsulation.Native, ViewEncapsulation.None.
- ViewEncapsulation.Emulated emulate the shadow dom
- ViewEncapsulation.Native used the native shadow dom, which is not supported in all browsers.
- ViewEncapsulation.None disables the ViewEncapsulation
```typescript
@Component({
    ...,
    styleUrls: ['./some.component.css'],
    encapsulation: ViewEncapsulation.Native
})
```
- For best practices use the default setting **ViewEncapsulation.Emulated** or just don't specify, so it applies to that specific component only.
  
## SCSS
[SCSS](https://sass-lang.com/documentation/syntax) provides a feature rich way of creating CSS. Many popular frameworks such as Bootstrap and Material are written SCSS, and we can integrate with many of SCSS features included in those frameworks (mix-ins and variables) by also making our Angular app SCSS enabled. The preferred way of integrating SCSS within the angular application is through the angular-cli. This will automatically create all the tooling and conventions to build your .scss files into css.

```shell
ng new my-example-app --style=scss
```

### Global vs Local with SCSS
SCSS allows a richer organization structure for both global and local styles. For example, global styles can be separated into different files, and managed through imports. You can also manage passing global variables and mixins to local component styles via imports. Note that the '_' prefix in a .scss filename indicates that it's a partial file intended to be imported into a main file. The underscore may be omitted from the actual import declaration. This is not necessary, but a good practice to indicate specific files that are intended to be imported to others.

`Example Structure`
```
src
├── app
│   └── scss
│       └── _variables.scss
│       └── _mixins.scss
│       └── _typography.scss
│       └── _buttons.scss
│   └── styles.scss
```

>NOTE: DO NOT keep create component specific styles within this global structure. For example, we should not have a _login.scss file here if we have a specific login.component.ts. That should be separately maintained in a login.components.scss file and directly imported into the component.

Best practice is to keep specific style code within a domain file and only import files into styles.scss
Example Global Imports within styles.scss
```typescript
@import "./scss/variables";
@import "./scss/mixins";
@import "./scss/typography";
@import "./scss/buttons";
```

Occasionally, it may occur that you may need access to a global variable or mixin within a component style. An common example of this is reusing theme colors. Theme colors should always be managed through SCSS variables. In order to get access to that variable, we can directly import that global .scss file into our component .scss file.

Example Local Imports within `example.component.scss`

```typescript
@import "~/scss/variables";

.example-element {
    background-color: $primary;
}
```

## General CSS Best Practices
- CSS **specificity** rules
```
let's think that CSS is read and given importance in this order:
[inline styles, #ids, .classes, and elements] or [0, 0, 0, 0]. Then:

[0, 0, 1, 1]
h1.some-class  {
    background-color: red;
}

[0, 0, 1, 0]
.some-class {
    background-color: red;
}
```

- Inline styles should not be used because it is bad for maintenance.
- **!important** should be avoided because it makes debugging more difficult by breaking the natural cascading in your stylesheets. Instead use CSS **specificity** rules:
```scss
Do not use 
!important
```

- Pseudo elements represent an actual part of an element such as before and after.
```scss
div:: after {
    ...
}
```
- Pseudo class represents a state of an element such as link and hover.
```scss
a: hover {
    ...do something
}
```


