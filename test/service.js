import Service from '../src/service';
import EVENTS from '../src/events';

describe('Service', () => {
	let service = null;
	let url = '//example.com/some.js';

	let IMAWindow = {
		isClient: () => {}
	};
	let IMADispatcher = {
		fire: () => {}
	};

	beforeEach(() => {
		service = new Service(IMAWindow, IMADispatcher, EVENTS);
	});

	describe('load method', () => {

		it('should reject promise with error on server side', () => {
			spyOn(IMAWindow, 'isClient')
				.and
				.returnValue(false);

			service
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

			service._loadedScripts[url] = Promise.resolve({ url });

			service
				.load(url)
				.then((value) => {
					expect(value.url).toEqual(url);
				});
		});

	});

});
