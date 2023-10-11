import * as hooks from '@ima/react-page-renderer';
import classnames from 'classnames';
import { shallow } from 'enzyme';
import { Infinite } from 'infinite-circle';
import { withContext } from 'shallow-with-context';
import { toMockedInstance } from 'to-mock';

import dummyRouter from '../../__tests__/mocks/router';
import dummyWindow from '../../__tests__/mocks/window';
import ComponentPositions from '../../ComponentPositions';
import UIComponentHelper from '../../UIComponentHelper';
import Visibility from '../../Visibility';
import { Sizer } from '../Sizer';

jest.mock('@ima/react-page-renderer', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ima/react-page-renderer'),
  };
});

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
      $UIComponentHelper: uiComponentHelper,
      $CssClasses: classnames,
    },
  };

  beforeEach(() => {
    const Component = withContext(Sizer, context);

    jest.spyOn(hooks, 'useComponentUtils').mockReturnValue(context.$Utils);

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
      height: 9,
    });

    expect(wrapper.get(0).props.style.paddingTop).toBe('56.25%');
  });
});
