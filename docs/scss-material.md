# INCLUDING MATERIAL

Using NPM is the old way. Use AngularCLI instead:
```shell
ng add @angular/material
```

- Open the `app.module.ts` and add:
```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
      ...
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ...
  ],
  ...
})
```

- Create a material module named `material.module.ts` and import all the necessary material modules needed for the project. Having a separate module keeps the code clean and easy to maintain. It is like having a shared module:

```typescript
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  ...
} from '@angular/material';

@NgModule({
    imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ...
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ...
  ]
})
export class MaterialModule {}
```

- Open the `app.module.ts` and import the created `material.module.ts`
```typescript
@NgModule({
  ...
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ...
  ],
  ...
})
```

- If you want to include a prebuilt theme, open the `style.css` and add at the top of the file:
```scss
@import '@angular/material/prebuilt-themes/indigo-pink.css';
```

### Custom Theme
If you want to create a **custom theme**, add `src/custom_theme.scss`. This is the only scss file you need in your project. 

You can define a new [Color palette](https://material.io/archive/guidelines/style/color.html#color-color-palette) and optionally you can create your own colors variable.
```scss
$mat-custom: (
    50: #ffff,
    ...,
    700: #ffff
    contrast: (
        50: #ffff,
        ...,
        700: #ffff
    )
)
```
You can use a pre-built theme (if you don't want to create one from scratch) using, for example, an [existing one](https://material.angular.io/guide/theming#using-a-pre-built-theme).

```scss
@import '~@angular/material/theming';
// Plus imports for other components in your app.

// Include the common styles for Angular Material. We include this here so that you only
// have to load a single css file for Angular Material in your app.
// Be sure that you only ever include this mixin once!
@include mat-core();

// Define the palettes for your theme using the Material Design palettes available in palette.scss
// (imported above). For each palette, you can optionally specify a default, lighter, and darker
// hue. Available color palettes: https://material.io/design/color/
$candy-app-primary: mat-palette($mat-indigo);
$candy-app-accent:  mat-palette($mat-pink, A200, A100, A400);

// The warn palette is optional (defaults to red).
$candy-app-warn:    mat-palette($mat-red);

// Create the theme object. A theme consists of configurations for individual
// theming systems such as `color` or `typography`.
$candy-app-theme: mat-light-theme((
  color: (
    primary: $candy-app-primary,
    accent: $candy-app-accent,
    warn: $candy-app-warn,  
  )
));

// Include theme styles for core and each component used in your app.
// Alternatively, you can import and @include the theme mixins for each component
// that you are using.
@include angular-material-theme($candy-app-theme);
```

Or create a completelly new Custom Theme:

```scss
@import '~@angular/material/theming';
// this includes variables 
@include mat-core();

$custom-app-primary: mat-palette($mat-custom);
$custom-app-accent:  mat-palette($mat-custom-pink, A200, A100, A400);

// defaults
$custom-app-warn:    mat-palette($mat-custom-red);

$custom-app-theme: mat-light-theme(color: (
    $custom-app-primary, 
    $custom-app-accent, 
    $custom-app-warn
));

@include angular-material-theme($custom-app-theme);
```

- Open `angular-cli.json` and add
```yaml
"styles": [
    "style.css",
    "custom_theme.scss"
]
```

- If you have a theme in `styles.css` remove it:
```scss
// remove this
@import '@angular/material/prebuilt-themes/indigo-pink.css';
For more information, visit https://material.angular.io/guide/theming#using-a-pre-built-theme
```