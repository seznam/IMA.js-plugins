import { Window } from '@ima/core';
import { toMockedInstance } from 'to-mock';
import WebSocket from '../WebSocket';

describe('WebSocket', () => {
  let webSocket = null;
  let window = null;
  let config = {};

  describe('for server side', () => {
    beforeEach(() => {
      window = toMockedInstance(Window, {
        isClient: () => false
      });
      webSocket = new WebSocket(window, config);
    });

    it('should not call _connect for init method', () => {
      spyOn(webSocket, '_connect');

      webSocket.init();

      expect(webSocket._connect).not.toHaveBeenCalled();
    });
  });

  describe('for client side', () => {
    beforeEach(() => {
      window = toMockedInstance(window, {
        isClient: () => true
      });
      webSocket = new WebSocket(window, config);
    });

    it('should not call connect', () => {
      spyOn(webSocket, '_connect');

      webSocket.init();

      expect(webSocket._connect).toHaveBeenCalled();
    });

    it('should add subscriber for messega', () => {
      let observer = jest.fn();

      webSocket.subscribe(observer);

      expect(webSocket.observersCount()).toEqual(1);
    });

    it('should remove subscriber for messega', () => {
      let observer = jest.fn();

      webSocket.subscribe(observer);
      webSocket.unsubscribe(observer);

      expect(webSocket.observersCount()).toEqual(0);
    });
  });
});
