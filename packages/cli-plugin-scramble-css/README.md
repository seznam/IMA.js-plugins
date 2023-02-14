# @ima/cli-plugin-scramble-css

Implements CSS class minimizer and uglifier that can be reverse-compiled at runtime (you can access classes using their original name).

It works by processing all CSS files using custom PostCSS plugin, that mangles (scrambles) and minimizes all classes, while also building translation table (`hashtable.json`) along the way.

The result is CSS file with mangled class names and companion hashtable that we use in our custom `$CssClasses` processor to, translate existing classes used out components to the new scrambled ones.

## Requirements

For this feature to work **you need to wrap all your `classNames` in `cssClasses` function.** Otherwise you'll end up with scrambled classes in CSS file but original class names in your components.

```jsx
import { useComponent } from '@ima/react-page-renderer';

export default function Card() {
  const { cssClasses } = useComponent();

  return (
    // highlight-next-line
    <div className={cssClasses('card')} />
  );
}
```

or in case of **class components**:

```jsx
import { AbstractPureComponent } from '@ima/react-page-renderer';

export default class Card extends AbstractPureComponent {
  render() {
    return (
      // highlight-next-line
      <div className={this.cssClasses('card')} />
    );
  }
}
```

## Installation

```bash
npm install @ima/cli-plugin-scramble-css -D
```

## Usage

```js
// ./ima.config.js
const { ScrambleCssPlugin } = require('@ima/cli-plugin-scramble-css');

/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  plugins: [new ScrambleCssPlugin()],
};
```

### `$CssClasses` override and `hashtable.json`

We have to provide our custom `$CssClasses` processor and pass it our generate `hashtable.json` file. To do that, we're going to load it's contents in the app environment:

```js
// ./server/config/environment.js
const fs = require('fs');
const path = require('path');

const hashTablePath = path.resolve(
  __dirname,
  '../../build/static/css/hashTable.json'
);

module.exports = (() => {
  return {
    prod: {
      $App: {
        scrambleCss: {
          hashTable: fs.existsSync(hashTablePath)
            ? JSON.parse(fs.readFileSync(hashTablePath))
            : null,
        },
      },
      // ...
    }
  }
});

```

Finally, the hashtable is now available under `config.$App.scrambleCss.hashTable`, so we're going to provide it to the plugin's custom `$CssClasses` processor in the app `bind.js` file, and we're done:

```js
// ./app/config/bind.js
import { scrambleCssClasses } from '@ima/cli-plugin-scramble-css/scrambleCssClasses';

export default (ns, oc, config) => {
  oc.bind(
    '$CssClasses',
    scrambleCssClasses(config?.$App?.scrambleCss?.hashTable),
    []
  );
};
```

## CLI Arguments

### --scrambleCss

> `boolean`

The scrambling is enabled by default for `production` environment. However you can explicitly enable/disable it using this CLI argument. This applies for both CLI commands.

## Options

```ts
new ScrambleCssPlugin(options: {
  scrambleCssMinimizerOptions?: {
    assetFilter?: (filename: string) => boolean;
    hashTableFilename?: string;
    mainAssetFilter?: (filename: string) => boolean;
  };
});
```

### scrambleCssMinimizerOptions

> `object`

These are passed directly into the `ScrambleCssMinimizer`. You can define custom:

- `assetFilter` - filter files to scramble.
- `hashTableFilename` - custom translation `hashtable.json` filename. Defaults to: **./build/static/css/hashTable.json**.
- `mainAssetFilter` - should resolve to the **main css file**. The minimizer first processes the main.css file and generates the `hashtable.json` **translation table**. If you then want to process other assets with existing hashtable, these should be filtered out in this function, since the minimizer minimizes them in **second pass using existing** `hashtable.json`.

> **Note:** You should be fine with the default options in almost any situation except some special use cases.

---

For more information, take a look at the [IMA.js documentation](https://imajs.io/cli/plugins/analyze-plugin).
