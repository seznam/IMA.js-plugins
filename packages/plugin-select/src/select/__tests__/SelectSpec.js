import { shallow } from 'enzyme';
import React from 'react';
import select, { createStateSelector } from '../select';

describe('plugin-select:', () => {
  const appState = {
    media: {
      width: 90,
      height: 60
    },
    title: 'title'
  };
  const componentContext = {
    $Utils: {
      $PageStateManager: {
        getState: () => {
          return appState;
        }
      }
    }
  };
  const componentInstance = {
    context: componentContext
  };
  const selectorMethods = [
    state => {
      return {
        width: state.media.width
      };
    },
    state => {
      return {
        height: state.media.height
      };
    }
  ];

  beforeEach(() => {
    global.$Debug = true;
  });

  afterEach(() => {
    delete global.$Debug;
  });

  describe('createStateSelector', () => {
    it('should select extra properties from state', () => {
      let extraProps = createStateSelector(...selectorMethods)(
        componentInstance
      );

      expect(extraProps).toMatchSnapshot();
    });

    it('should trow error for undefined $PageStateManager', () => {
      expect(() => {
        createStateSelector(...selectorMethods)({ context: { $Utils: {} } });
      }).toThrow();
    });
  });

  describe('select', () => {
    let wrapper = null;
    const defaultProps = {
      props: 'props'
    };

    class Component extends React.PureComponent {
      render() {
        return <h1>text</h1>;
      }
    }

    it('should render component', () => {
      wrapper = shallow(React.createElement(Component, defaultProps), {
        context: componentContext
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render component with extraProps', () => {
      let EnhancedComponent = select(...selectorMethods)(Component);

      wrapper = shallow(React.createElement(EnhancedComponent, defaultProps), {
        context: componentContext
      });

      expect(wrapper).toMatchSnapshot();
    });
  });
});
