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

		it(`should handle a ${method} request without data`, () => {});

		it(`should handle a ${method} request with data`, () => {});

		it(`should time out a ${method} request after timeout`, () => {});

		it(`should repeat a failed ${method} request the specified number of times`, () => {
		});

		it(`should send the specified headers in a ${method} request`, () => {
		});

		it(`should send the cross-origin credentials in a ${method} request`, () => {
		});

		it(`should allow post-processing the response of a ${method} request`, () => {
		});

		it(
			`should call the onstatechange callback of an observer and update the state during a ${method} request`,
			() => {
			}
		);

		if (method !== 'get') {
			it(
				`should call the onprogress callback of an observer when a ${method} request's upload progresses`,
				() => {
				}
			);
		}

		it(`should allow aborting a ${method} request using the observer`, () => {
		});

		it(`should compose the default headers into a ${method} request`, () => {
			// without default options
		});

		it(`should use the default options as fallbacks for the provided options of a ${method} request`, () => {
			// try with default as well headers
		});
	});

	function using(values, func) {
		for (const value of values) {
			func.call(this, value);
		}
	}
});
