# BOOTSTRAP SCSS Integration
[Bootstrap](https://getbootstrap.com/) is originally written using the SCSS pre-processor. It is possible to include Bootstrap through its final .min.css file.

`angular.json`
```yaml
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "styles.css"
]
```

However, the **preferred way** of integrating Bootstrap is at the SCSS level. Integrating with the SCSS source files gives us greater flexibility to reuse common variables and functions (mix-ins) that have been defined within the framework. This enables us to redefine these values once ([DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)) to create a custom theme on top of Bootstrap. In order to do this, you would also need to create your angular app to be an SCSS project. The recommended way to do this is through the **angular-cli**.

```console
ng new my-example-app --style=scss
```

Once you've installed bootstrap as an npm package, import the master .scss file into styles.scss

`styles.scss`
```scss
@import "../node_modules/bootstrap/scss/bootstrap.scss";
// other global imports...
@import "./scss/typography.scss";
@import "./scss/buttons.scss";
```

Typically, you'd like to override colors and other variables to create your own theme. In order to do that, create a local _variables.scss file. This is where you would perform overrides of bootstrap's _variables.scss file, and also create any of your own. Take a look at node_modules/bootstrap/scss/_variables.scss to see what has been defined and should be overridden. Here's an example of changing the primary color to red.

`scss/_variables.scss`
```scss
$primary:       red !default;
```

Once defined, import this before the main bootstrap.scss within styles.scss. Order is important!

`styles.scss`
```scss
@import "./scss/variables.scss";
@import "../node_modules/bootstrap/scss/bootstrap.scss";
// other global imports...
@import "./scss/typography.scss";
@import "./scss/buttons.scss";
```

Occasionally, it is also useful to have access to variables within local component SCSS files (this often happens with common theme colors). We can accomplish this with imports as well. Always avoid redefining a style that has been defined through a variable or a mixin. The purpose of leveraging SCSS is so that we can reuse commonly defined code (DRY).

`example.component.scss`
```scss
@import "~/scss/variables";

.example-element {
    background-color: $primary;
}
```