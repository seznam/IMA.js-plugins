import ScriptLoaderPlugin from '../ScriptLoaderPlugin';
import Events from '../Events';

describe('ScriptLoaderPlugin', () => {
	let scriptLoaderPlugin = null;
	let url = '//example.com/some.js';
	let template = 'some js code';
	let element = null;

	let ImaWindow = {
		isClient() {
			return true;
		}
	};
	let ImaDispatcher = {
		fire() {}
	};
	let ResourceLoader = {
		promisify() {},
		injectToPage() {}
	};

	beforeEach(() => {
		scriptLoaderPlugin = new ScriptLoaderPlugin(ImaWindow, ImaDispatcher, ResourceLoader);
		element = {
			onload() {},
			onerror() {},
			onabort() {}
		};
	});

	describe('load method', () => {

		beforeEach(() => {
			spyOn(scriptLoaderPlugin, '_createScriptElement')
				.and
				.returnValue(element);
		});

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

		it('the dispatcher fire loaded event for scripts loaded by template', (done) => {
			spyOn(ImaDispatcher, 'fire');
			spyOn(ResourceLoader, 'promisify')
				.and
				.returnValue(Promise.resolve());

			scriptLoaderPlugin
				.load(url, template)
				.then(() => {
					expect(ImaDispatcher.fire).toHaveBeenCalledWith(Events.LOADED, { url }, true);
					done();
				})
				.catch(done);
		});

		it('the dispatcher fire loaded event for scripts loaded by url', (done) => {
			spyOn(ImaDispatcher, 'fire');
			spyOn(ResourceLoader, 'promisify')
				.and
				.returnValue(Promise.resolve());

			scriptLoaderPlugin
				.load(url)
				.then(() => {
					expect(ImaDispatcher.fire).toHaveBeenCalledWith(Events.LOADED, { url }, true);
					done();
				})
				.catch(done);
		});

		it('the dispatcher fire loaded event with errors', (done) => {
			spyOn(ImaDispatcher, 'fire');
			spyOn(ResourceLoader, 'promisify')
				.and
				.returnValue(Promise.reject(new Error('message')));

			scriptLoaderPlugin
				.load(url)
				.catch((error) => {
					expect(ImaDispatcher.fire).toHaveBeenCalledWith(Events.LOADED, { url, error }, true);
					done();
				});
		});

	});

});
