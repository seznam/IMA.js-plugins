import { renderWithContext, waitFor } from '@ima/testing-library';

import Visibility from '../../Visibility';
import { Iframe } from '../Iframe';

describe('Iframe', () => {
  it('should render with noscript tag by default', async () => {
    const { container } = await renderWithContext(
      <Iframe src='example.html' />
    );

    expect(container.querySelector('noscript')).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render without noscript tag if visible', async () => {
    const { app, container } = await renderWithContext(
      <Iframe src='example.html' />
    );

    // Mock getBoundingClientRect to simulate visibility
    container.firstChild.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
    }));
    app.oc.get(Visibility).notify(); // Trigger visibility observer

    // The component needs to re-render to remove noscript tag, there is no generic way to wait for it,
    // so we need to wait for the noscript tag to disappear
    await waitFor(() =>
      expect(container.querySelector('noscript')).not.toBeInTheDocument()
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
