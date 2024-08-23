import { renderWithContext } from '@ima/testing-library';

import { Sizer } from '../Sizer';

describe('Sizer component', () => {
  let wrapper = null;

  beforeEach(async () => {
    wrapper = await renderWithContext(<Sizer />);
  });

  it('should set atm-sizer class', () => {
    expect(wrapper.container.firstChild).toHaveClass('atm-sizer');
  });

  it('should set atm-placeholder class if is defined placeholder props', () => {
    wrapper.rerender(<Sizer placeholder={true} />);

    expect(wrapper.container.firstChild).toHaveClass('atm-placeholder');
  });

  it('should calculate ratio between width and height', () => {
    wrapper.rerender(<Sizer width={16} height={9} />);

    expect(wrapper.container.firstChild.style.paddingTop).toBe('56.25%');
  });
});
