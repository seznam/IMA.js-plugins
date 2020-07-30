# ima-plugin-managed-component

The `AbstractMangedComponent` is an extension of the
[IMA](https://github.com/seznam/IMA.js-skeleton)'s `AbstractComponent`,
providing API for easier registration of DOM, event bus, dispatcher, timeout
and interval listeners, which are **automatically** bound to the component's
instance (`this`) and are automatically deregistered from the
`componentWillUnmount()` callback (unless completed or manually deregistered
prior to the callback's execution).

This also applies to the event listeners bound to the elements rendered by the
component - components extending the `AbstractManagedComponent` will have them
automatically bound to `this`, as is the case with components created by the
`React.createClass` API.

## Installation

Install the plugin as an npm module:

```
npm install --save ima-plugin-managed-component
```

Next you need to add the plugin to your vendors. Open the `app/build.js` file
of your IMA application, and add the following element to the `vendors.common`
array:

```javascript
'ima-plugin-managed-component'
```

With that the build process is configured and you may start using this plugin
(you may need to restart your `dev` process):

```javascript
import AbstractManagedComponent from 'ima-plugin-managed-component';

export default class MyReactComponent extends AbstractManagedComponent {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div className='my-react-component'>
        You have pressed the button {this.state.count} times.
        <button onClick={this.onButtonClicked}>
          Press me!
        </button>
      </div>
    )
  }

  componentDidMount() {
  	this.addDomListener(window, 'scroll', this.onScroll);
  	this.listen(this, 'customEventBusEvent', this.onNotified);
  	this.addDispatcherListener('userSignedIn', this.onUserSignedIn);
  	this.setTimeout(this._handleRunningTooLong, 60000);
  	this.setInterval(this._handleTick, 1000);
  }

  componentWillUnmount() {
  	super.componentWillUnmount(); // Optional, will be handled automatically
  	
  	// There is no need to do the following, this will be handled automatically
  	this.removeDomListener(window, 'scroll', this.onScroll);
  	this.unlisten(this, 'customEventBusEvent', this.onNotified);
  	this.removeDispatcherListener('userSignedIn', this.onUserSignedIn);
  	this.clearTimeout(this._handleRunningTooLong);
  	this.clearInterval(this._handleTick);
  }
  
  onButtonClicked(event) {
    this.setState({
      count: this.state.count + 1
    })
  }

  onScroll(event) {}

  onNotified(event) {}

  onUserSignedIn(eventData) {}

  _handleTick() {}

  _handleRunningTooLong() {}
}
```

## Implementation details

The `AbstractManagedComponent` overrides, if necessary, the
`componentWillUnmount` method, that executes the client code's overriding
implementation first, and the `AbstractManagedComponent`'s after that for
cleaning up the listeners, timeouts and intervals.

The `AbstractManagedComponent` also overrides the `render` method, executing
the client code's implementation and post-processing the result by binding the
event listeners. Only the event listeners that are provided via props named
with the `on` prefix will be bound to the component's instance.
