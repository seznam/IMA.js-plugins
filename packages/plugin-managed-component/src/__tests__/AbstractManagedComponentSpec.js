import { Dispatcher } from '@ima/core';

import { toMockedInstance } from 'to-mock';

import AbstractManagedComponent from '../AbstractManagedComponent';

const eventTarget = {
  addEventListener: jest.fn()
};

const listener = {
  bind: jest.fn()
};

listener.bind.mockReturnValue(listener);

describe('AbstractManagedComponent', () => {
  class Component extends AbstractManagedComponent {
    constructor() {
      super({
        $Utils: {
          $Dispatcher: toMockedInstance(Dispatcher)
        }
      });
    }
  }

  it('should add event listener to event target', () => {
    let component = new Component();

    component.addDomListener(eventTarget, 'event', listener);

    expect(eventTarget.addEventListener).toBeCalled();
  });
});
