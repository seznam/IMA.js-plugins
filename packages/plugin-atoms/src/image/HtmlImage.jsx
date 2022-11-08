import { PageContext } from '@ima/react-page-renderer';
import { createRef, PureComponent } from 'react';
import Loader from '../loader/Loader';
import Sizer from '../sizer/Sizer';

const MIN_EXTENDED_PADDING = 300;
const TIME_TO_SHOW_LOADER = 3000;

/**
 * Html image
 *
 * @namespace ima.ui.atom.image
 * @module ima.ui.atom
 */

export default class HtmlImage extends PureComponent {
  static get contextType() {
    return PageContext;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.src !== prevState.src ||
      nextProps.srcSet !== prevState.srcSet ||
      nextProps.sizes !== prevState.sizes
    ) {
      return {
        showLoader: prevState.showLoader || false,
        src: nextProps.src,
        srcSet: nextProps.srcSet,
        sizes: nextProps.sizes,
        noloading: nextProps.noloading || prevState.noloading || false
      };
    }

    return null;
  }

  constructor(props, context) {
    super(props, context);

    this.state = {};

    this._mounted = false;
    this._visibleInViewport = false;
    this._loadIndicatorTimer = null;

    this._registeredVisibilityId = null;

    this._onVisibilityWriter = this.onVisibilityWriter.bind(this);

    this._rootElement = createRef();

    this._helper = this.context.$Utils.$UIComponentHelper;
    this._settings = this.context.$Utils.$Settings;
  }

  get useIntersectionObserver() {
    return this.props.useIntersectionObserver !== undefined
      ? this.props.useIntersectionObserver
      : this._settings.plugin.uiAtoms.useIntersectionObserver.images;
  }

  get disableNoScript() {
    return this.props.disableNoScript !== undefined
      ? this.props.disableNoScript
      : this._settings.plugin.uiAtoms.disableNoScript.images;
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

  componentDidUpdate(prevProps) {
    if (
      this.props.src !== prevProps.src ||
      this.props.srcSet !== prevProps.srcSet ||
      this.props.sizes !== prevProps.sizes
    ) {
      this._visibleInViewport = false;

      if ((prevProps.noloading || this.props.noloading) === false) {
        this._registerToCheckingVisibility();
      }
    }
  }

  render() {
    return (
      <div
        ref={this._rootElement}
        className={this._helper.cssClasses(
          {
            'atm-image': true,
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
        {this.props.placeholder ? (
          <img
            src={this.props.placeholder}
            alt={this.props.alt}
            className={this._helper.cssClasses({
              'atm-blur': true,
              'atm-fill': true,
              'atm-visibility': !(
                this.state.noloading && this._visibleInViewport
              )
            })}
          />
        ) : null}
        {this.state.noloading ? (
          <img
            src={this.props.src}
            srcSet={this.props.srcSet}
            sizes={this.props.sizes}
            alt={this.props.alt}
            className={this._helper.cssClasses({
              'atm-fill': true,
              'atm-loaded': this.state.noloading && this._visibleInViewport,
              'atm-cover': this.props.cover
            })}
            {...this._helper.getEventProps(this.props)}
            {...this._helper.getAriaProps(this.props)}
          />
        ) : null}
        {this.state.showLoader && !this.state.noloading ? (
          <Loader mode="small" layout="center" />
        ) : null}
        {!this.disableNoScript && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<img
                  src="${this.props.src || ''}"
                  srcset="${this.props.srcSet || ''}"
                  sizes="${this.props.sizes || ''}"
                  alt="${this.props.alt || ''}"
                  class="${this._helper.cssClasses('atm-fill atm-loaded')}"
                  ${this._helper.serializeObjectToNoScript(
                    this._helper.getAriaProps(this.props)
                  )}/>`
            }}
          />
        )}
      </div>
    );
  }

  onVisibilityWriter(visibility, observer) {
    if (this._visibleInViewport === false && visibility > 0) {
      observer && observer.disconnect();
      this._visibleInViewport = true;
      this._unregisterToCheckingVisibility();
      this._preLoadImage();
    }
  }

  _unregisterToCheckingVisibility() {
    if (this._registeredVisibilityId) {
      this._helper.visibility.unregister(this._registeredVisibilityId);
      this._registeredVisibilityId = null;
    }
  }

  _registerToCheckingVisibility() {
    let extendedPadding =
      this.props.extendedPadding ||
      Math.max(
        Math.round(
          this._helper.componentPositions.getWindowViewportRect().height
        ),
        MIN_EXTENDED_PADDING
      );

    this._registeredVisibilityId = this._helper.visibility.register(
      this._helper.getVisibilityReader(this._rootElement.current, {
        extendedPadding,
        useIntersectionObserver: this.useIntersectionObserver,
        width: this.props.width,
        height: this.props.height
      }),
      this._helper.wrapVisibilityWriter(this._onVisibilityWriter)
    );
  }

  _preLoadImage() {
    this._loadIndicatorTimer = setTimeout(() => {
      this.setState({ showLoader: true });
    }, TIME_TO_SHOW_LOADER);

    let image = new Image();

    if (!image.decode) {
      image.onload = () => {
        this._imageIsLoaded();
      };
    }
    image.onerror = () => {
      this._imageIsLoaded();
    };

    let { src, srcSet, sizes } = this.props;

    if (srcSet && this._areResponsiveImagesSupported(image)) {
      if (sizes) {
        image.sizes = sizes;
      }

      image.srcset = srcSet;
    } else if (src) {
      image.src = src;
    }

    if (image.decode) {
      image
        .decode()
        .then(() => {
          this._imageIsLoaded();
        })
        .catch(() => {
          this._imageIsLoaded();
        });
    }

    if (!srcSet && !src) {
      this._imageIsLoaded();
    }
  }

  _imageIsLoaded() {
    if (!this._loadIndicatorTimer) {
      return;
    }

    clearTimeout(this._loadIndicatorTimer);
    this._loadIndicatorTimer = null;

    if (this._mounted) {
      this.setState({ noloading: true, showLoader: false });
    }
  }

  _areResponsiveImagesSupported(image) {
    return 'srcset' in image && 'sizes' in image;
  }
}
