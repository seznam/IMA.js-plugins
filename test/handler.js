import Handler from '../src/handler';
import EVENTS from '../src/events';

describe('Handler', () => {
	let handler = null;
	let url = '//example.com/some.js';

	let IMAWindow = {
		isClient: () => {}
	};
	let IMADispatcher = {
		fire: () => {}
	};

	beforeEach(() => {
		handler = new Handler(IMAWindow, IMADispatcher, EVENTS);
	});

	describe('load method', () => {

		it('should reject promise with error on server side', () => {
			spyOn(IMAWindow, 'isClient')
				.and
				.returnValue(false);

			handler
				.load(url)
				.catch((value) => {
					expect(value.url).toEqual(url);
					expect(value.error instanceof Error).toEqual(true);
				});
		});

		it('should return value from cache', () => {
			spyOn(IMAWindow, 'isClient')
				.and
				.returnValue(true);

			handler._loadedScripts[url] = Promise.resolve({ url });

			handler
				.load(url)
				.then((value) => {
					expect(value.url).toEqual(url);
				});
		});

	});

});
