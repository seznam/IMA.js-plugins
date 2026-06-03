import {
  maxHeightMedia,
  maxWidthMedia,
  minAndMaxWidthMedia,
  minHeightMedia,
  minWidthMedia,
} from '../media';
import { px } from '../units';

describe('units media', () => {
  it.each([
    [
      'maxWidthMedia',
      maxWidthMedia(px(1024)),
      '~"all and (max-width: 1024px)"',
    ],
    ['minWidthMedia', minWidthMedia(px(320)), '~"all and (min-width: 320px)"'],
    [
      'maxHeightMedia',
      maxHeightMedia(px(768)),
      '~"all and (max-height: 768px)"',
    ],
    [
      'minHeightMedia',
      minHeightMedia(px(480)),
      '~"all and (min-height: 480px)"',
    ],
    [
      'minAndMaxWidthMedia',
      minAndMaxWidthMedia(px(320), px(1024)),
      '~"all and (min-width: 320px) and (max-width: 1024px)"',
    ],
  ])(
    '%s creates media query with default media type',
    (name, mediaUnit, result) => {
      expect(mediaUnit.__mediaQuery).toBe(true);
      expect(mediaUnit.valueOf()).toBe(result);
      expect(mediaUnit.toString()).toBe(result);
    }
  );

  it.each([
    [
      'maxWidthMedia',
      maxWidthMedia(px(1024), 'screen'),
      '~"screen and (max-width: 1024px)"',
    ],
    [
      'minWidthMedia',
      minWidthMedia(px(320), 'print'),
      '~"print and (min-width: 320px)"',
    ],
    [
      'maxHeightMedia',
      maxHeightMedia(px(768), 'speech'),
      '~"speech and (max-height: 768px)"',
    ],
    [
      'minHeightMedia',
      minHeightMedia(px(480), 'screen'),
      '~"screen and (min-height: 480px)"',
    ],
    [
      'minAndMaxWidthMedia',
      minAndMaxWidthMedia(px(320), px(1024), 'screen'),
      '~"screen and (min-width: 320px) and (max-width: 1024px)"',
    ],
  ])(
    '%s creates media query with custom media type',
    (name, mediaUnit, result) => {
      expect(mediaUnit.__mediaQuery).toBe(true);
      expect(mediaUnit.valueOf()).toBe(result);
      expect(mediaUnit.toString()).toBe(result);
    }
  );
});
