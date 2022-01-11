# @ima/react-hooks
Collection of **React hooks** for use in IMA.js applications.

## Contents of this file
* [`Installation`](#installation)
* [`Hooks`](#hooks)

## Installation
#### 1. Install plugin
```console
npm install @ima/react-hooks --save
```

#### 2. Update build config
```javascript
// /app/build.js

var vendors = {
	common: [
		'@ima/react-hooks'
	]
};
```

## Hooks
* [`useComponent`](#user-content-usecomponent--object)
* [`useComponentUtils`](#user-content-usecomponentutils--objectstring-object)
* [`useCssClasses`](#user-content-usecssclasses--functionstringobjectstring-booleanstring-string)
* [`useLink`](#user-content-uselink--functionstring-objectstring--string)
* [`useLocalize`](#user-content-uselocalize--functionstring-objectstring--string)
* [`useDispatcher`](#user-content-usedispatcherevent-callback----fire-functionstring-objectstring--boolean-)
* [`useOnce`](#user-content-useoncecallback--void)
* [`usePageContext`](#user-content-usepagecontext--reactconsumer)
* [`useSettings`](#user-content-usessr---isserver-boolean-isclient-boolean-)
* [`useSSR`](#user-content-usesettingsselector--objectany)
* [`useWindowEvent`](#user-content-usewindowevent-eventtarget--null-event-callback-usecapture--false-----window-functionstring-objectstring--boolean-dispatchevent-function-createcustomevent-function-)

---

### useComponent() ⇒ `object`
Base hook you can use to initialize your component.

Returns object, which gives you access to the same features you would
get in your class component (`AbstractComponent`):
 * **Utility methods**: `cssClasses`, `localize`, `link`, `fire`, `listen`, `unlisten`.
 * **Objects**: `utils` (=== ComponentUtils).

`@example`
```javascript
const { utils, cssClasses } = useComponent();
```

---

### useComponentUtils() ⇒ `Object<string, Object>`
Provides direct access to ComponentUtils.

`@example`
```javascript
const utils = useComponentUtils();
```

---

### useCssClasses() ⇒ `function(...(string|Object<string, boolean>|[string])): string`
Provides direct access to CssClasses.

`@example`
```javascript
const cssClasses = useCssClasses();
```

---

### useLink() ⇒ `function(string, Object<string, *>): string`

Provides direct access to $Router.link().

`@example`
```javascript
const link = useLink();
link('route-name', params)
```

---

### useLocalize() ⇒ `function(string, Object<string, *>): string`
Provides direct access to $Dictionary.get().

`@example`
```javascript
const localize = useLocalize();
localize('userName', { AGE: 24 })
```

---

### useDispatcher(event?, callback?)  ⇒ `{ fire: function(string, Object<string, *>, boolean) }`
Hook to register listeners for dispatcher events. Returns
decorated dispatcher fire function. Omitting hook params
doesn't register any events to the dispatcher but provides
access to the dispatcher's fire method.

`@example`
```javascript
const { fire } = useDispatcher(
	'dispatcher-event',
	() => {}
);

// Access $Dispatcher's.fire method without registering listener
const { fire } = useDispatcher();

// Firing custom event
useEffect(() => {
	fire('another-event', { data: {} })
});
```

| **Param** | **Type** | **Description** |
|:-:|:-:|:-|
| event | `string` | Optional Event name. |
| callback | `function` | Optional Callback to register to dispatcher. |

---

### useOnce(callback) ⇒ `void`
"Constructor" like hook, which makes sure, that provided callback
is called only once during component's lifecycle.

`@example`
```javascript
useOnce(() => {
	oneTimeAction();
});
```

| **Param** | **Type** | **Description** |
|:-:|:-:|:-|
| callback | `function` | Callback to invoke only once. |

---

### usePageContext() ⇒ `React.Consumer`
Provides direct access to IMA Page context.

`@example`
```javascript
const pageContext = usePageContext();
```

---

### useSettings(selector?) ⇒ `object|any`
IMA $Settings access provider with optional selector. Returns
an empty object if the settings was not found.

`@example`
```javascript
const settings = useSettings();
console.log(settings.$Cache.enabled);

// Using settings selector
const { scripts, documentView } = useSettings('$Page.$Render');
const esScripts = useSettings('$Page.$Render.esScripts');
```

| **Param** | **Type** | **Description** |
|:-:|:-:|:-|
| selector | `string` | Optional settings path selector. |

---

### useSSR() ⇒ `{ isServer: boolean, isClient: boolean }`
Provides two utility values `isClient` and `isServer`,
which lets you know what kind of rendering is being done.

`@example`
```javascript
const { isClient, isServer } = useSSR();
```

---

### useWindowEvent({ eventTarget = null, event, callback, useCapture = false })  ⇒ `{ window: function(string, Object<string, *>, boolean), dispatchEvent: function(), createCustomEvent: function() }`
Hook which you can use to quickly bind native window events.
It returns object with utility methods, that are usually used
together with binding/unbinding window events.

If we omit event target while using this hook, it defaults to current window.
This results in smaller and cleaner syntax in most use cases.
Omitting function parameters provides access to some window utils.

`@example`
```javascript
const { dispatchEvent, createCustomEvent } = useWindowEvent({
	event: 'custom-event',
	callback: () => windowEventCallback(a, b)
});

// Using custom event target
const { dispatchEvent } = useWindowEvent({
	event: 'click',
	eventTarget: window.getElementById('page'),
	callback: () => windowEventCallback(a, b),
	useCapture: false,
});

// Dispatching custom event
useEffect(() => {
	dispatchEvent(
		createCustomEvent('custom-event'),
		{ data: {} }
	);
});

// Omitting function parameters
const {
  window,
  dispatchEvent,
  createCustomEvent
} = useWindowEvent();
```

| **Param** | **Type**  | **Default** | **Description** |
|:-:|:-:|:-:|:-|
| params.eventTarget | `string` | `null` | Optional event target, if left blank defaults to current window (=> can be omitted in most use cases). |
| params.event | `string` |   | Event name. |
| params.callback | `string` |   | Callback to register to window event. |
| params.useCapture | `string` | `false` | Use capture instead of bubbling (default). |
