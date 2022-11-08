import { PageContext } from '@ima/react-page-renderer';
import { PureComponent } from 'react';

/**
 * Common loader
 *
 * @namespace ima.ui.atom.loader
 * @module ima.ui.atom
 */

export default class Loader extends PureComponent {
  static get contextType() {
    return PageContext;
  }

  static get defaultProps() {
    return {
      mode: '',
      layout: '',
      timeout: null,
      color: 'black',
      className: '',
      'data-e2e': null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.timeout) {
      return {
        showLoader: true,
      };
    }

    if (nextProps.timeout !== prevState.timeout) {
      return {
        showLoader: prevState.showLoader || false,
      };
    }

    return null;
  }

  constructor(props, context) {
    super(props, context);

    this.state = {};

    this._timer = null;
  }

  componentDidMount() {
    this._setTimer();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.timeout !== this.props.timeout) {
      this._clearTimer();
      this._setTimer();
    }
  }

  componentWillUnmount() {
    this._clearTimer();
  }

  render() {
    const helper = this.context.$Utils.$UIComponentHelper;
    const { className, mode, layout, color = 'black' } = this.props;

    if (!this.state.showLoader) {
      return null;
    }

    return (
      <div
        className={helper.cssClasses(
          {
            'atm-loader': true,
            ['atm-loader-' + mode]: mode,
            ['atm-loader-' + layout]: layout,
          },
          className
        )}
        {...helper.getEventProps(this.props)}
        {...helper.getDataProps(this.props)}
      >
        <div
          className={helper.cssClasses({
            'atm-loader-animation': true,
            ['atm-loader-animation-' + color]: color,
          })}
        />
      </div>
    );
  }

  _setTimer() {
    if (!this.props.timeout) {
      return;
    }

    this._timer = setTimeout(() => {
      this.setState({ showLoader: true });
    }, this.props.timeout);
  }

  _clearTimer() {
    clearTimeout(this._timer);
  }
}
