import ScriptLoaderPlugin from '../ScriptLoaderPlugin';
import Events from '../Events';

describe('ScriptLoaderPlugin', () => {
	let scriptLoaderPlugin = null;
	let url = '//example.com/some.js';

	let ImaWindow = {
		isClient: () => true
	};
	let ImaDispatcher = {
		fire: () => {}
	};

	beforeEach(() => {
		scriptLoaderPlugin = new ScriptLoaderPlugin(ImaWindow, ImaDispatcher, Events);
	});

	describe('load method', () => {

		it('should throw an error at server side', () => {
			spyOn(ImaWindow, 'isClient')
				.and
				.returnValue(false);

			expect(() => {
				scriptLoaderPlugin.load(url);
			}).toThrow();
		});

		it('should return value from cache', (done) => {
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
