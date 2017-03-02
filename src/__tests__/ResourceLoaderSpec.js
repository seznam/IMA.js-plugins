import ResourceLoader from '../ResourceLoader';

describe('ResourceLoader', () => {

	let appendCalled;

	beforeEach(() => {
		appendCalled = null;
		global.document = {
			head: {
				appendChild(...args) {
					appendCalled = args;
				}
			}
		};
	});

	afterEach(() => {
		delete global.document;
	});

	it('should throw an error when used at the server side', () => {
		delete global.document;
		expect(() => {
			new ResourceLoader({}, 'foo');
		}).toThrow();
	});

	it('should append the resource element to the document head', () => {
		const element = {
			mark: Math.random() + Date.now()
		};
		const loader = new ResourceLoader(element, 'foo');
		loader.injectToPage();
		expect(appendCalled).toEqual([element]);
	});

	it('should resolve the load promise when the resource loads', done => {
		const element = {};
		const loader = new ResourceLoader(element, 'foo');
		expect(typeof element.onload).toBe('function');
		element.onload();
		loader.loadPromise.then(done);
	});

	it('should reject the load promise when resource fails to load', done => {
		const element = {};
		const loader = new ResourceLoader(element, 'foo');
		expect(typeof element.onerror).toBe('function');
		expect(typeof element.onabort).toBe('undefined');
		element.onerror();
		loader.loadPromise.catch(done);
	});

	it('should allow rejecting the load promise on abort', done => {
		const element = {};
		const loader = new ResourceLoader(element, 'foo', true);
		expect(typeof element.onerror).toBe('function');
		expect(typeof element.onabort).toBe('function');
		element.onabort();
		loader.loadPromise.catch(done);
	});

});
