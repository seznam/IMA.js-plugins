import ScriptLoaderPlugin from '../ScriptLoaderPlugin';
import Events from '../Events';

describe('ScriptLoaderPlugin', () => {
	let scriptLoaderPlugin = null;
	let url = '//example.com/some.js';

	let ImaWindow = {
		isClient: () => {}
	};
	let ImaDispatcher = {
		fire: () => {}
	};

	beforeEach(() => {
		scriptLoaderPlugin = new ScriptLoaderPlugin(ImaWindow, ImaDispatcher, Events);
	});

	describe('load method', () => {

		it('should reject promise with error on server side', (done) => {
			spyOn(ImaWindow, 'isClient')
				.and
				.returnValue(false);

			scriptLoaderPlugin
				.load(url)
				.catch((error) => {
					expect(error instanceof Error).toEqual(true);
					done();
				});
		});

		it('should return value from cache', (done) => {
			spyOn(ImaWindow, 'isClient')
				.and
				.returnValue(true);

			scriptLoaderPlugin._loadedScripts[url] = Promise.resolve({ url });

			scriptLoaderPlugin
				.load(url)
				.then((value) => {
					expect(value.url).toEqual(url);
					done();
				})
				.catch((error) => {
					done(error);
				});
		});

	});

});
