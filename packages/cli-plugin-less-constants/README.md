# @ima/cli-plugin-less-constants

Adds preprocessor which reads CSS values defined in a JS file and generates files with their **LESS and CSS declarations**.

Can be used to share CSS values between **JS** and **LESS** files or even multiple npm packages, allowing easy overrides.

## Contents of this file
- [Installation](#installation)
- [Usage](#usage)
  - [Create file with constants](#create-file-with-constants)
  - [Import generated files in globals](#import-generated-files-in-globals)
  - [Usage in JavaScript](#usage-in-javascript)
- [Options](#options)
- [Units](#units)
  - [Available helpers](#available-helpers)
  - [Custom units](#custom-units)
- [Themes](#themes-1)
  - [Multiple themes](#multiple-themes)
    - [Usage in JavaScript](#usage-in-javascript-1)
  - [Single theme](#single-theme)


## Installation

```bash
npm install @ima/cli-plugin-less-constants -D
```

## Usage

```js
// ./ima.config.js
const { LessConstantsPlugin } = require('@ima/cli-plugin-less-constants');

/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  plugins: [
    new LessConstantsPlugin({
      entry: './app/config/theme.js'
    })
  ],
};
```

### Create file with constants

Create theme.js file with constants definitions. Use [units helper functions](#units) for sizes, colors and media queries and export constants from your entry file.

```js
// ./app/config/theme.js
import { units, media } from '@ima/cli-plugin-less-constants/units';

const { hex, lessMap, px, rgba, rem, vw } = units;

export default {
  bodyfontSize: rem(1),
  headerHeight: px(120),
  bodyWidth: vw(100),
  color: {
    text: hex('000000'), // works also with '#000000'
    link: 'blue',
    shade: rgba(0, 0, 0, 0.2),
  }
  greaterThanMobile: media.maxWidthMedia(px(360), 'screen'),
  zIndexes: lessMap({
    header: 100,
    footer: 200,
    body: 1,
  }),
};
```

This produces the following two output files:

```less
// ./build/less-constants/constants.less
@bodyfont-size: 1rem;
@header-height: 120px;
@body-width: 100vw;
@color-text: #000000;
@color-link: blue;
@color-shade: rgba(0,0,0,0.2);
@greater-than-mobile: ~"screen and (max-width: 360px)";
@z-indexes: {
  header: 100;
  footer: 200;
  body: 1;
}
```

```less
// ./build/less-constants/cssConstants.less
// note: --greater-than-mobile is not generated - CSS variables cannot be used in media query declarations
:root {
  --bodyfont-size: 1rem;
  --header-height: 120px;
  --body-width: 100vw;
  --color-text: #000000;
  --color-link: blue;
  --color-shade: rgba(0,0,0,0.2);
  --z-indexes-header: 100;
  --z-indexes-footer: 200;
  --z-indexes-body: 1;
}
```

### Import generated files in globals

Finally, don't forget to import the generated `./build/less-constants/constants.less` file in your `./app/less/globals.less` to have the variables available in all LESS files automatically without explicit import. If you want to use the CSS variables form of your theme constants, import also file `./build/less-constants/cssConstants.less`. This is optional when you have only one theme but necessary with multiple [themes](#themes-1).

```js
// ./app/less/globals.less
@import "../../build/less-constants/constants.less";
@import "../../build/less-constants/cssConstants.less"; // optional with 1 theme
```

You can verify that your constants are actually used in your `less` files. The `verify` option should include all directories that contain your `less` files.

```js
// ./ima.config.js
const { LessConstantsPlugin } = require('@ima/cli-plugin-less-constants');

/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  plugins: [
    new LessConstantsPlugin({
      entry: './app/config/theme.js'
      verify: ['./app']
    })
  ],
};
```

### Usage in JavaScript

Since every unit function returns [`Unit`](#units) object, you can always access its value through the `.valueOf()` method or read the CSS interpreted value by calling `.toString()`.

```jsx
import { headerHeight } from 'app/config/theme.js';

export default function ThemeComponent({ children, title, href }) {
  return (
    <div>
      Header height has an absolute value of: {headerHeight.valueOf()} {/* 120 */},
      while it's CSS value is: {headerHeight.toString()} {/* 120px */}
    </div>
  );
}
```

> **CAVEAT:** The constants are generated in the `preProcess` method which **runs just ONCE, before the compilation**. So make sure to restart the build manually when you add new constants, to trigger the re-generation of the `less` files.

## Options

```typescript
new LessConstantsPlugin(options: {
  entry: string;
  outputLessConstants?: string;
  outputCssConstants?: string;
  themes?: ['light' | 'dark'] | ['light', 'dark', ...string[]];
  defaultTheme?: 'light' | 'dark';
  verify?: string[];
});
```

### entry

> `string`

Path to the LESS constants JS file.

### outputLessConstants

> `string`

Optional custom output path for less declarations, defaults to `./build/less-constants/constants.less`.

### outputCssConstants

> `string`

Optional custom output path for css declarations, defaults to `./build/less-constants/cssConstants.less`.

### themes

> `['light' | 'dark'] | ['light', 'dark', ...string[]]`

Optional list of themes, defaults to `['light']`. This option sets support for light, dark and custom themes and generates separate declarations for each theme in `cssConstants.less` file. More about how it works: [Themes](#themes).

### defaultTheme

> `'light' | 'dark'`

Optional default theme, defaults to `'light'`. This value will be used when user has no known theme preference.

### verify

> `string[]`

Optional list of directories which are searched for `.less` files to verify whether all constants from `theme.js` are actually used. List of unused constants is printed in the console. This option is useful to keep your theme file clean.

> **CAVEAT:** the plugin checks usage of constants only in `.less` files, so if you use some constants only in your JS files, they will be marked as unused.

## Units

The plugin provides unit functions for almost every unit available + some other helpers. Helpers returns `Unit` object with following interfaces:

```typescript
type PropertyValue = string | number | Unit;

// size and color helpers
interface Unit {
  __propertyDeclaration: true;
  valueOf: () => string | number;
  toString: () => string;
}
// media query helpers
interface MediaUnit {
  __mediaQuery: true;
  valueOf: () => string;
  toString: () => string;
}
// lessMap helper
interface MapUnit {
  __lessMap: true;
  valueOf: (key?: string) => Record<string, PropertyValue> | PropertyValue;
  toString: () => string;
}
// theme helper
interface ThemeUnit {
  __theme: true;
  valueOf: (key?: string) => Record<string, PropertyValue> | PropertyValue;
  toString: () => string;
}
```

### Available helpers

 - **Numeric (size) values** - `em`, `ex`, `ch`, `rem`, `lh`, `rlh`, `vw`, `vh`, `vmin`, `vmax`, `vb`, `vi`, `svw`, `svh`, `lvw`, `lvh`, `dvw`, `dvh`, `cm`, `mm`, `Q`, `inches`, `pc`, `pt`, `px`, `percent`.
 - **Color values** - `hex`, `rgb`, `rgba`, `hsl`, `hsla`.
 - **Media queries** - `maxWidthMedia`, `minWidthMedia`, `minAndMaxWidthMedia`, `maxHeightMedia`, `minHeightMedia`.
 - **LESS map helper** - `lessMap` can be used to group together similar values in an "object-like" value.
 - **theme helper** - `theme` can be used to define theme-specific values.

### Custom units

If you're missing any helpers, you can always define your own, either custom ones (as long as they adhere to the `Unit` or `MediaUnit` interface) or you can use helpers `asUnit` and `asMedia`:

```typescript
import { asUnit, asMedia } from '@ima/cli-plugin-less-constants/units';

function myUnit(value: number): Unit {
  return asUnit(' bananas', [value]);
}
myUnit(5).toString(); // '5 bananas'
myUnit(5).valueOf(); // 5

function exactWidthMedia(value: string | Unit): MediaUnit {
  return asMedia(`~"all and (width: ${value.toString()})"`);
}
exactWidthMedia(px(1000)).toString(); // '~"all and (width: 1000px)"'
```

```typescript
function asUnit(
  unit: string,
  parts: (string | number)[],
  template = '${parts}${unit}'
): Unit {
  return {
    __propertyDeclaration: true,

    valueOf(): number | string {
      if (parts.length !== 1) {
        return this.toString();
      }

      return parts[0]!;
    },

    toString(): string {
      return template
        .replace('${parts}', parts.join(','))
        .replace('${unit}', unit);
    },
  };
}

function asMedia(query: string): MediaUnit {
  return {
    __mediaQuery: true,

    valueOf(): string {
      return query;
    },

    toString(): string {
      return query;
    },
  };
}
```

## Themes

The plugin adds support for themes implemented with CSS variables. This solution respects user's preference (set in user's system) and allows also explicit preference for your website.

### Multiple themes

**All values that depend on theme should be used as CSS variables, not LESS variables.**

1\. First specify your themes in the plugin options:

```js
// ./ima.config.js
const { LessConstantsPlugin } = require('@ima/cli-plugin-less-constants');

module.exports = {
  plugins: [
    new LessConstantsPlugin({
      entry: './app/config/theme.js',
      themes: ['light', 'dark', 'fruit'],
      defaultTheme: 'light', // must have value of system theme 'light' or 'dark', cannot be custom theme 'fruit'
    })
  ],
};
```

2\. Define all your values in your JS file with constants. Values depending on theme are defined with `theme` helper function. The `theme` helper accepts an object with keys corresponding to your themes. You can use any of the available [size and color unit](#available-helpers) helpers as values in the `theme` helper.

```js
// ./app/config/theme.js
import { units, media } from '@ima/cli-plugin-less-constants/units';

const { hex, px, theme } = units;

export default {
  mediaDesktop: media.minWidthMedia(px(1100)),
  lineHeight: 1.2,
  pagePaddingDesktop: px(20),
  colorScheme: theme({
    light: 'light',
    dark: 'dark',
    fruit: 'light',
  }),
  fontWeight: theme({
    light: 300,
    dark: 400,
    fruit: 300,
  }),
  color: {
    text: theme({
      light: hex('#000000'),
      dark: hex('#ffffff'),
      fruit: hex('#811c1c'),
    }),
    link: theme({
      light: 'blue',
      dark: 'cyan',
      fruit: 'magenta',
    }),
  }
};

```
This produces the following two output files:

```less
// ./build/less-constants/constants.less
@desktop-media: ~"all and (min-width: 1100px)";
@line-height: 1.2;
@page-padding-desktop: 20px;
@color-scheme: {
  light: light;
  dark: dark;
  fruit: light;
}
@font-weight: { // theme
  light: 300;
  dark: 400;
  fruit: 300;
}
@color-text: {  // theme
  light: #000000;
  dark: #ffffff;
  fruit: #811c1c;
}
@color-link: {  // theme
  light: blue;
  dark: cyan;
  fruit: magenta;
}
```

```less
// ./build/less-constants/cssConstants.less
:root {
  --line-height: 1.2;
  --page-padding: 20px;
}
:root,
[data-theme="light"] {
  --color-scheme: light;
  --font-weight: 300;
  --color-text: #000000;
  --color-link: blue;
}
@media (prefers-color-scheme: dark) {
  :root[data-theme=""],
  :root:not([data-theme]) {
  --color-scheme: dark;
  --font-weight: 400;
  --color-text: #ffffff;
  --color-link: cyan;
  }
}
[data-theme="dark"] {
  --color-scheme: dark;
  --font-weight: 400;
  --color-text: #ffffff;
  --color-link: cyan;
}
[data-theme="fruit"] {
  --color-scheme: light;
  --font-weight: 300;
  --color-text: #811c1c;
  --color-link: magenta;
}
```
3\. Use the generated CSS variables in your `less` files.

```less
.myComponent {
  color: var(--color-text);
  font-weight: var(--font-weight);

  @media @media-desktop {
    padding: var(--page-padding-desktop);
  }
}
```

4\. If you do absolutely nothing else now, your page will automatically switch between light and dark theme based on user's system preference. If you want to allow users to explicitly choose their theme, add a theme switching control to your page which sets `data-theme` attribute on the `html` element.

Theme switch should work as follows:
- user should be able to choose between all themes defined in the plugin options AND system preference
- the theme switch should set `data-theme` attribute on the `html` element to the name of the theme, for example `dark`, `light` or `fruit`
- for system preference, the value of `data-theme` should be empty string `''` or the attribute should be removed completely, so that the media query for system preference works correctly
- the theme switch should also set the chosen theme in a persistent storage - cookie is a good option, because it can be read both on client and server side.

#### Usage in JavaScript

You can still read all values in JS, but you should be aware that values depending on theme will not have a single value. And unless you have some robust detection of current theme (which can be changed anytime by system), you won't know which value is currently used. So it's best to use CSS variables for styling with theme-dependent values in your JS as well, to keep the consistency with your `less` files and avoid potential bugs.

```jsx
import { color, pagePaddingDesktop } from 'app/config/theme.js';

export default function ThemeComponent({ children, title, href }) {
  return (
    <div>
      Text color has different values for different themes:
      {`${color.text.valueOf('light')}, ${color.text.valueOf('dark')}, ${color.text.valueOf('fruit')}`} {/* 000000, ffffff, 811c1c */}
      I do not know the current theme, but I can safely style text with CSS variable, like this:
      <span style={{ color: 'var(--color-text)' }}>I am colored with the text color of the current theme!</span>
      And I can still safely read and use values that do not depend on theme:<br />
      Page padding for desktop is: {pagePaddingDesktop.valueOf()} {/* 20 */}
    </div>
  );
}
```

### Single theme

You do not have to specify plugin options `themes` and `defaultTheme`. In this case, it is considered that you have one theme - `light`.

```js
// ./app/config/theme.js
import { units, media } from '@ima/cli-plugin-less-constants/units';

const { hex, px, theme } = units;

export default {
  pagePaddingDesktop: px(20),
  color: {
    text: theme({
      light: hex('#000000'), // THIS VALUE WILL BE USED AS CSS VARIABLE
      dark: hex('#ffffff'),
    }),
  }
};
```

This produces the following two output files:

```less
// ./build/less-constants/constants.less
@page-padding-desktop: 20px;
@color-text: {  // theme
  light: #000000;
  dark: #ffffff;
}
```

```less
// ./build/less-constants/cssConstants.less
:root {
  --page-padding-desktop: 20px;
  --color-text: #000000;
}
```

You can specify also `dark` is a single theme, in which case `dark` values will be used as CSS variables:

```js
// ./ima.config.js
const { LessConstantsPlugin } = require('@ima/cli-plugin-less-constants');

module.exports = {
  plugins: [
    new LessConstantsPlugin({
      entry: './app/config/theme.js',
      themes: ['dark'],
      defaultTheme: 'dark',
    })
  ],
};
```

```less
// ./build/less-constants/cssConstants.less
:root {
  --page-padding-desktop: 20px;
  --color-text: #ffffff;
}
```