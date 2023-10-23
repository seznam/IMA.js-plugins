import { IMAGE_ATTRIBUTES } from '../constants';
import { filterProps } from '../filterProps';

describe('filterProps method', () => {
  it('should returns only valid attributes for image', () => {
    const imageProps = {
      src: 'https://imajs.io/img/logo.svg',
      width: 200,
      height: 100,
      decoding: 'async',
      loading: 'lazy',
      alt: 'description',
      noImageAttribute: true,
      onClick: () => {},
      'data-element': 'some value',
      'aria-hidden': true,
    };
    const attributes = filterProps(imageProps, IMAGE_ATTRIBUTES);

    expect(attributes).toMatchInlineSnapshot(`
      {
        "alt": "description",
        "aria-hidden": true,
        "data-element": "some value",
        "decoding": "async",
        "height": 100,
        "loading": "lazy",
        "onClick": [Function],
        "src": "https://imajs.io/img/logo.svg",
        "width": 200,
      }
    `);
  });
});
