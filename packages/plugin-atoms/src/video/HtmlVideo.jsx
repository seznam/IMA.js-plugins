import { PageContext } from '@ima/core';
import React from 'react';
import Sizer from '../sizer/Sizer';

const EXTENDED_PADDING = 300;

/**
 * HTML video player.
 *
 * @namespace ima.ui.atom.video
 * @module ima.ui.atom
 */

export default class HtmlVideo extends React.PureComponent {
  static get contextType() {
    return PageContext;
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      noloading: props.noloading || false
    };

    this._mounted = false;
    this._visibleInViewport = false;

    this._registeredVisibilityId = null;

    this._onVisibilityWriter = this.onVisibilityWriter.bind(this);

    this._rootElement = React.createRef();

    this._helper = this.context.$Utils.$UIComponentHelper;
    this._settings = this.context.$Utils.$Settings;
  }

  get useIntersectionObserver() {
    return this.props.useIntersectionObserver !== undefined
      ? this.props.useIntersectionObserver
      : this._settings.plugin.uiAtoms.useIntersectionObserver.videos;
  }

  get disableNoScript() {
    return this.props.disableNoScript !== undefined
      ? this.props.disableNoScript
      : this._settings.plugin.uiAtoms.disableNoScript.videos;
  }

  render() {
    return (
      <div
        ref={this._rootElement}
        className={this._helper.cssClasses(
          {
            'atm-video': true,
            'atm-overflow': true,
            'atm-placeholder': !this.state.noloading,
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
            placeholder={!this.state.noloading}
          />
        ) : null}
        {this.state.noloading ? (
          <video
            src={this.props.src}
            poster={this.props.poster}
            autoPlay={this.props.autoplay}
            controls={this.props.controls}
            loop={this.props.loop}
            muted={this.props.muted}
            width={this.props.width}
            height={this.props.height}
            className={this._helper.cssClasses({
              'atm-fill': true,
              'atm-loaded': this.state.noloading && this._visibleInViewport
            })}
            {...this._helper.getEventProps(this.props)}
            {...this._helper.getAriaProps(this.props)}>
            <div placeholder="" />
            {this.props.children}
          </video>
        ) : null}
        {!this.disableNoScript && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<video
								src="${this.props.src || ''}"
								poster="${this.props.alt || ''}"
								controls
								${this.props.autoplay ? 'autoPlay' : ''}
								${this.props.loop ? 'loop' : ''}
								${this.props.muted ? 'muted' : ''}
								class="${this._helper.cssClasses('atm-fill atm-loaded')}"
								${this._helper.serializeObjectToNoScript(
                  this._helper.getAriaProps(this.props)
                )}></video>`
            }}
          />
        )}
      </div>
    );
  }

  componentDidMount() {
    this._mounted = true;

    if (this.state.noloading === false) {
      this._registerToCheckingVisibility();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    this._unregisterToCheckingVisibility();
  }

  onVisibilityWriter(visibility, observer) {
    if (this._visibleInViewport === false && visibility > 0) {
      observer && observer.disconnect();
      this._visibleInViewport = true;
      this._unregisterToCheckingVisibility();
      this._preLoadPosterImage();
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
      Math.round(
        this._helper.componentPositions.getWindowViewportRect().height / 2
      ),
      EXTENDED_PADDING
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

  _preLoadPosterImage() {
    if (!this.props.poster) {
      this.setState({
        noloading: true
      });
      return;
    }

    let componentInstance = this;
    let image = new Image();
    image.onload = onLoadingCompleted;
    image.onerror = onLoadingCompleted;
    image.src = this.props.poster;

    function onLoadingCompleted() {
      if (componentInstance._mounted) {
        componentInstance.setState({
          noloading: true
        });
      }
    }
  }
}
