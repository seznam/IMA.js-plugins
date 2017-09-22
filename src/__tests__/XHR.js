import XHR from '../XHR.js';

describe('XHR', () => {
	const windowMock = {
		isClient() {
			return true;
		}
	};

	let xhr;

	beforeEach(() => {
		xhr = new XHR(windowMock);
	});

	using(['get', 'post', 'put', 'patch', 'delete'], (method) => {
		it('should throw an error at the server side', () => {
			const serverSideWindowMock = {
				isClient() {
					return false;
				}
			};
			const xhr = new XHR(serverSideWindowMock);
			expect(() => xhr[method]('http://localhost/')).toThrow();
		});

		// TODO: requests with and without data
		// TODO: using options (all options, including the observer)
		// TODO: default headers
		// TODO: default options
	});

	function using(values, func) {
		for (const value of values) {
			func.call(this, value);
		}
	}
});
