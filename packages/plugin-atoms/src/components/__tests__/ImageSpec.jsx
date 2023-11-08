import { Router, Window } from '@ima/core';
import * as hooks from '@ima/react-page-renderer';
import classnames from 'classnames';
import { shallow } from 'enzyme';
import { Infinite } from 'infinite-circle';
import { withContext } from 'shallow-with-context';
import { toMockedInstance } from 'to-mock';

import ComponentPositions from '../../ComponentPositions';
import UIComponentHelper from '../../UIComponentHelper';
import Visibility from '../../Visibility';
import { Image } from '../Image';

jest.mock('@ima/react-page-renderer', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ima/react-page-renderer'),
  };
});

describe('Image component', () => {
  let wrapper = null;

  let router = toMockedInstance(Router);
  let window = toMockedInstance(Window);
  let visibility = toMockedInstance(Visibility);
  let componentPositions = toMockedInstance(ComponentPositions);
  let infinite = toMockedInstance(Infinite);
  let uiComponentHelper = new UIComponentHelper(
    router,
    window,
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
  const Img = withContext(Image, context);

  beforeEach(() => {
    jest.spyOn(hooks, 'useComponentUtils').mockReturnValue(context.$Utils);
  });

  it('should has defined default attributes', () => {
    wrapper = shallow(
      <Img src='./static/source.jpg' witdth={300} height={200} />,
      { context }
    );
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<img height="200" src="./static/source.jpg" loading="lazy" decoding="async" class="atm-image atm-placeholder"/>"`
    );
  });

  it('should be responsive in layout', () => {
    wrapper = shallow(
      <Img
        src='./static/source.jpg'
        witdth={300}
        height={200}
        layout='responsive'
      />,
      { context }
    );
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<img height="200" src="./static/source.jpg" loading="lazy" decoding="async" class="atm-image atm-layout-responsive atm-placeholder"/>"`
    );
  });
});
