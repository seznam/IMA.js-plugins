# @ima/plugin-merkur

The [@ima/plugin-merkur](https://gitlab.seznam.net/IMA.js/ima-plugins/tree/master/packages/plugin-merkur) is for easy integration [merkur](https://merkur.js.org/) widget to [ima](https://imajs.io) application.

## Instalace

```javascript
npm install @ima/plugin-merkur --save
```

```javascript
// /app/build.js

var vendors = {
    common: [
      '@ima/plugin-merkur'
    ]
};
```

## Usage

```javascript
// /app/page/home/HomeController
import { AbstractController } from '@ima/core';
import { MerkurResource } from '@ima/plugin-merkur';

class HomeController extends AbstractController {
  static get $dependencies() {
    return [MerkurResource];
  }

  constructor(merkurResource) {
    this._merkurResource = merkurResource;
  }

  load() {
    const data = {
      containerSelector: '.widget__container',
      // When using merkur slots
      slots: {
        headline: {
          containerSelector: '.widget__headline-slot'
        }
      }
    };

    const widgetProperties = this._merkurResource
      .get('http://localhost:4444/widget', data)
      .then((response) => response.body);


    return {
      widgetProperties
    }
  }
}

// /app/page/home/HomeView
import React from 'react';
import { MerkurWidget } from '@merkur/integration-react';

class HomeView extends React.Component {
  render() {
    const { widgetProperties } = this.props;
    
    return (
      <div>
        <MerkurWidget widgetProperties={widgetProperties}>
          <div>Loading phrase</div>
        </MerkurWidget>
      </div>
    );
  }
}

```
