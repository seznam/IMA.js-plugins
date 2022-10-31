import { PageContext } from '@ima/react-page-renderer';
import React from 'react';
import Sizer from '../sizer/Sizer';

const MIN_EXTENDED_PADDING = 500;

/**
 * Html classic iframe
 *
 * @namespace ima.ui.atom.iframe
 * @module ima.ui.atom
 */

export default class HtmlIframe extends React.PureComponent {
  static get contextType() {
    return PageContext;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      visibleInViewport:
        nextProps.noloading || prevState.visibleInViewport || false
    };
  }

  constructor(props, context) {
    super(props, context);

    this.state = {};

    this._registeredVisibilityId = null;

    this._onVisibilityWriter = this.onVisibilityWriter.bind(this);

    this._rootElement = React.createRef();

    this._helper = this.context.$Utils.$UIComponentHelper;
    this._settings = this.context.$Utils.$Settings;
  }

  get useIntersectionObserver() {
    return this.props.useIntersectionObserver !== undefined
      ? this.props.useIntersectionObserver
      : this._settings.plugin.uiAtoms.useIntersectionObserver.iframes;
  }

  get disableNoScript() {
    return this.props.disableNoScript !== undefined
      ? this.props.disableNoScript
      : this._settings.plugin.uiAtoms.disableNoScript.iframes;
  }

  componentDidMount() {
    if (this.state.visibleInViewport === false) {
      this._registerToCheckingVisibility();
    }
  }

  componentWillUnmount() {
    this._unregisterToCheckingVisibility();
  }

  render() {
    return (
      <div
        ref={this._rootElement}
        className={this._helper.cssClasses(
          {
            'atm-iframe': true,
            'atm-overflow': true,
            'atm-placeholder': !this.state.visibleInViewport,
            'atm-responsive': this.props.layout === 'responsive',
            'atm-fill': this.props.layout === 'fill'
          },
          this.props.className
        )}
        style={
          this.props.layout === 'responsive'
            ? {}
            : {
                width: this.props.width || 'auto',
                height: this.props.height || 'auto'
              }
        }
        {...this._helper.getDataProps(this.props)}>
        {this.props.layout === 'responsive' ? (
          <Sizer
            width={this.props.width}
            height={this.props.height}
            placeholder={true}
          />
        ) : null}
        {this.state.visibleInViewport ? (
          <iframe
            src={this.props.src}
            name={this.props.src}
            srcDoc={this.props.srcDoc}
            width={this.props.width}
            height={this.props.height}
            scrolling={this.props.scrolling}
            sandbox={this.props.sandbox}
            frameBorder={this.props.frameBorder}
            allow={this.props.allow}
            allowFullScreen={this.props.allowFullScreen}
            marginWidth={this.props.marginWidth}
            marginHeight={this.props.marginHeight}
            className={this._helper.cssClasses({
              'atm-fill': true
            })}
            {...this._helper.getEventProps(this.props)}
            {...this._helper.getAriaProps(this.props)}
          />
        ) : null}
        {!this.disableNoScript && (
          <noscript
            className={this._helper.cssClasses('atm-fill')}
            style={{
              display: 'block',
              width: this.props.width || 'auto',
              height: this.props.height || 'auto'
            }}
            dangerouslySetInnerHTML={{
              __html: `<iframe
                  src="${this.props.src}"
                  ${
                    this.props.srcDoc !== null
                      ? `srcdoc="${this.props.srcDoc}"`
                      : ''
                  }
                  width="${this.props.width || 'auto'}"
                  height="${this.props.height || 'auto'}"
                  ${this.props.sandbox ? `sandbox="${this.props.sandbox}"` : ''}
                  scrolling="${this.props.scrolling || 'no'}"
                  frameborder="${this.props.frameBorder || '0'}"
                                  ${
                                    this.props.allow
                                      ? `allow="${this.props.allow}"`
                                      : ''
                                  }
                  allowfullscreen="${this.props.allowFullScreen || '0'}"
                  ${
                    Number.isInteger(this.props.marginWidth)
                      ? `marginwidth="${this.props.marginWidth}"`
                      : ''
                  }
                  ${
                    Number.isInteger(this.props.marginHeight)
                      ? `marginheight="${this.props.marginHeight}"`
                      : ''
                  }
                  class="${this._helper.cssClasses('atm-fill atm-loaded')}"
                  ${this._helper.serializeObjectToNoScript(
                    this._helper.getAriaProps(this.props)
                  )}></iframe>`
            }}
          />
        )}
      </div>
    );
  }

  onVisibilityWriter(visibility, observer) {
    if (visibility > 0) {
      observer && observer.disconnect();
      this._unregisterToCheckingVisibility();

      if (this.state.visibleInViewport === false) {
        this.setState({ visibleInViewport: true });
      }
    }
  }

  _unregisterToCheckingVisibility() {
    if (this._registeredVisibilityId) {
      this._helper.visibility.unregister(this._registeredVisibilityId);
      this._registeredVisibilityId = null;
    }
  }

  _registerToCheckingVisibility() {
    let extendedPadding = Math.max(
      this._helper.componentPositions.getWindowViewportRect().height / 2,
      MIN_EXTENDED_PADDING
    );

    this._registeredVisibilityId = this._helper.visibility.register(
      this._helper.getVisibilityReader(this._rootElement.current, {
        useIntersectionObserver: this.useIntersectionObserver,
        extendedPadding,
        width: this.props.width,
        height: this.props.height
      }),
      this._helper.wrapVisibilityWriter(this._onVisibilityWriter)
    );
  }
}
