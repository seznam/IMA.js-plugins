import { Window } from '@ima/core';
import { toMockedInstance } from 'to-mock';

export default toMockedInstance(Window, {
  getCurrentRouteInfo: () => {
    return {
      params: {
        amp: false,
      },
    };
  },
});
