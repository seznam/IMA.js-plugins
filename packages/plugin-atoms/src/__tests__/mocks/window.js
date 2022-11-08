import { Window } from '@ima/core';
import { toMockedInstance } from 'to-mock';

export default toMockedInstance(Window, {
  getWindow() {
    return {
      innerWidth: 1024,
      innerHeight: 768,
    };
  },
  isClient: () => true,
});
