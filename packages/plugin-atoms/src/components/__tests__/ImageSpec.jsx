import '../../main'; // To ensure that pluginLoader is called

import { renderWithContext } from '@ima/testing-library';

import { Image } from '../Image';

describe('Image component', () => {
  it('should has defined default attributes', async () => {
    const { container } = await renderWithContext(
      <Image src='./static/source.jpg' witdth={300} height={200} />
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <img
        class="atm-image atm-placeholder"
        decoding="async"
        height="200"
        loading="lazy"
        src="./static/source.jpg"
      />
    `);
  });

  it('should be responsive in layout', async () => {
    const { container } = await renderWithContext(
      <Image
        src='./static/source.jpg'
        witdth={300}
        height={200}
        layout='responsive'
      />
    );
    expect(container.firstChild).toMatchInlineSnapshot(`
      <img
        class="atm-image atm-layout-responsive atm-placeholder"
        decoding="async"
        height="200"
        loading="lazy"
        src="./static/source.jpg"
      />
    `);
  });
});
