import classnames from 'classnames';
import { shallow } from 'enzyme';
import { Infinite } from 'infinite-circle';
import { toMockedInstance } from 'to-mock';
import { withContext } from 'shallow-with-context';
import Sizer from '../Sizer';
import UIComponentHelper from '../../UIComponentHelper';
import Visibility from '../../Visibility';
import ComponentPositions from '../../ComponentPositions';
import dummyRouter from '../../__tests__/mocks/router';
import dummyWindow from '../../__tests__/mocks/window';

describe('Sizer component', () => {
  let wrapper = null;
  let visibility = toMockedInstance(Visibility);
  let componentPositions = toMockedInstance(ComponentPositions);
  let infinite = toMockedInstance(Infinite);
  let uiComponentHelper = new UIComponentHelper(
    dummyRouter,
    dummyWindow,
    visibility,
    componentPositions,
    infinite,
    classnames
  );
  let context = {
    $Utils: {
      $UIComponentHelper: uiComponentHelper
    }
  };

  beforeEach(() => {
    const Component = withContext(Sizer, context);

    wrapper = shallow(<Component />, { context });
  });

  it('should set atm-sizer class', () => {
    expect(wrapper.hasClass('atm-sizer')).toBeTruthy();
  });

  it('should set atm-placeholder class if is defined placeholder props', () => {
    wrapper.setProps({ placeholder: true });

    expect(wrapper.hasClass('atm-placeholder')).toBeTruthy();
  });

  it('should calculate ratio between width and height', () => {
    wrapper.setProps({
      width: 16,
      height: 9
    });

    expect(wrapper.get(0).props.style.paddingTop).toEqual('56.25%');
  });
});
