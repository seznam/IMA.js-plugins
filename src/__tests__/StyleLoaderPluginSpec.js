import Events from '../Events';
import StyleLoaderPlugin from '../StyleLoaderPlugin';

describe('StyleLoaderPlugin', () => {
	let styleLoaderPlugin = null;
	let url = '//example.com/some.css';
	let template = 'some css code';
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
		styleLoaderPlugin =
			new StyleLoaderPlugin(ImaWindow, ImaDispatcher, ResourceLoader);
		element = {
			onload() {},
			onerror() {},
			onabort() {}
		};
		global.document = {
			querySelector() {}
		};
	});

	afterEach(() => {
		delete global.document;
	});

	describe('load method', () => {

		beforeEach(() => {
			spyOn(styleLoaderPlugin, '_createStyleElement')
				.and
				.returnValue(element);
		});

		it('should throw an error at server side', () => {
			spyOn(ImaWindow, 'isClient')
				.and
				.returnValue(false);

			expect(() => {
				styleLoaderPlugin.load(url);
			}).toThrow();
		});

		it('should return value from cache', (done) => {
			styleLoaderPlugin._loadedStyles[url] = Promise.resolve({ url });

			styleLoaderPlugin
				.load(url)
				.then((value) => {
					expect(value.url).toEqual(url);
					done();
				})
				.catch((error) => {
					done(error);
				});
		});

		it('the dispatcher fire loaded event for styles loaded by template', (done) => {
			spyOn(ImaDispatcher, 'fire');
			spyOn(ResourceLoader, 'promisify')
				.and
				.returnValue(Promise.resolve());

			styleLoaderPlugin
				.load(url, template)
				.then(() => {
					expect(ImaDispatcher.fire).toHaveBeenCalledWith(Events.LOADED, { url }, true);
					done();
				})
				.catch(done);
		});

		it('the dispatcher fire loaded event for styles loaded by url', (done) => {
			spyOn(ImaDispatcher, 'fire');
			spyOn(ResourceLoader, 'promisify')
				.and
				.returnValue(Promise.resolve());

			styleLoaderPlugin
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

			styleLoaderPlugin
				.load(url)
				.catch((error) => {
					expect(ImaDispatcher.fire).toHaveBeenCalledWith(Events.LOADED, { url, error }, true);
					done();
				});
		});

	});

});
