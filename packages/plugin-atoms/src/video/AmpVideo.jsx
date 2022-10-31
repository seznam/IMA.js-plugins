import { PageContext } from '@ima/react-page-renderer';
import React from 'react';

/**
 * Amp video player.
 *
 * @namespace ima.ui.atom.video
 * @module ima.ui.atom
 */
export default class AmpVideo extends React.PureComponent {
  // @if server
  static get contextType() {
    return PageContext;
  }

  render() {
    let helper = this.context.$Utils.$UIComponentHelper;
    let {
      src,
      poster,
      autoplay,
      controls,
      loop,
      muted,
      width,
      height,
      layout,
      className,
      children
    } = this.props;

    return (
      <amp-video
        src={src}
        poster={poster}
        autoplay={autoplay}
        controls={controls}
        loop={loop}
        muted={muted}
        width={width}
        height={height}
        layout={layout}
        class={helper.cssClasses(className)}
        {...helper.getDataProps(this.props)}
        {...helper.getAriaProps(this.props)}>
        <div placeholder="" />
        {children}
      </amp-video>
    );
  }
  // @endif
}
