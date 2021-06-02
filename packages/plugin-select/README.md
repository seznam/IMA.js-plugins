# @ima/plugin-select

The [IMA](https://imajs.io) plugin selects extra props from page state to your component.
It uses [HOC](https://reactjs.org/docs/higher-order-components.html) at the background for Class component or [hook](https://reactjs.org/docs/hooks-intro.html) for Function component.
It can be very useful for example some analytical data.

## Installation

```bash
npm install @ima/plugin-select --save
```

```javascript
// /app/build.js

let vendors = {
    common: [
        '@ima/plugin-select'
    ]
};

/*
The select plugin is now available.

import select from '@ima/plugin-select';
*/
```

```javascript
// /app/config/bind.js
import { ComponentUtils, PageStateManager, Dispatcher } from '@ima/core';
import PageStateManager from 'ima/page/state/PageStateManager';
import Dispatcher from 'ima/event/Dispatcher';

export default (ns, oc, settings) => { 
	...
	const componentUtils = oc.get(ComponentUtils);

	ComponentUtils.register({
    $PageStateManager: PageStateManager,
    $Dispatcher: Dispatcher
  });

} 

/*
The select plugin use $PageStateManager for selecting extra props to your component.
*/
```

## Usage

You can use `select` HOC or `useSelect` hook for Function component. Example below shows `useSelect` hook.

```javascript
import { useSelect } from '@ima/plugin-select';

const titleSelector = (state, context, props) => {
	return {
		title: state.title
	};
}

// Only for example purpose. You can use more selectors.
const emptySelector = (state, context, props) => {
	return {};
}

function Component(props) {
  const [state] = useSelect(props, titleSelector, emptySelector);

  return <h1>{state.title}</h1>;
}
```

You can use HOC `select` for Class component. Example below shows `select` HOC.

```javascript
// /app/component/Component.js
import select from '@ima/plugin-select';

// Your page state
//{
//	title: 'My title',
//	media: {
//		width: 90,
//		height: 60
//	}
//}


class Component extends React.PureComponent {
	render() {
		return <h1>{this.props.title}</h1>;
	}
}

const titleSelector = (state, context, props) => {
	return {
		title: state.title
	};
}

// Only for example purpose. You can use more selectors.
const emptySelector = (state, context, props) => {
	return {};
}

export default select(titleSelect, emptySelector)(Component);

```

## API

You can use two global methods for overriding default behaviour of select plugin.

The first one is setCreatorOfStateSelector where you can redefine your own selector from module [reselect](https://www.npmjs.com/package/reselect) like [example](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-select/src/select/__tests__/SelectSpec.js#L138).

The second one is setHoistStaticMethod where you can override [hoist-non-react-statics](https://www.npmjs.com/package/hoist-non-react-statics) module like [example](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-select/src/select/__tests__/SelectSpec.js#L155).

## IMA.js

The [IMA.js](https://imajs.io) is an application development stack for developing
isomorphic applications written in pure JavaScript.
You can find the [IMA.js](https://imajs.io) skeleton application at <https://github.com/seznam/IMA.js-skeleton>.
