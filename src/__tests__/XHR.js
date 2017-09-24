import XHR from '../XHR.js';

describe('XHR', () => {
	const windowMock = {
		isClient() {
			return true;
		}
	};
	class Blob {}
	class BufferSource {}
	class FormData {}
	class URLSearchParams {}
	class ReadableStream {}

	let pluginInstance;
	let xhrSendCallback = () => Promise.resolve(null);
	let xhrProgressInterval = 10; // milliseconds
	let xhrResponseHeaders = [['content-type', 'application/javascript']];

	beforeAll(() => {
		global.Blob = global.Blob || Blob;
		global.BufferSource = global.BufferSource || BufferSource;
		global.FormData = global.FormData || FormData;
		global.URLSearchParams = global.URLSearchParams || URLSearchParams;
		global.ReadableStream = global.ReadableStream || ReadableStream;

		global.XMLHttpRequest = class XMLHttpRequest {
			constructor() {
				this.readyState = 0;
				this.status = 0;
				this.response = undefined;

				this._listeners = {};
				this._requestHeaders = [];
			}

			open(method, url, async, username, password) {
				if (async !== true) {
					throw new Error(`The async flag must be true, but ${async} was provided`);
				}
				if (username || password) {
					throw new Error(
						'The HTTP Auth info (username and password) must not be provided, but ' +
						`${username}:${password} was provided`
					);
				}
				this._method = method;
				this._url = url;
			}

			addEventListener(type, callback) {
				if (!['readystatechange', 'progress', 'load', 'abort', 'timeout', 'error'].includes(type)) {
					throw new Error(`Unsupported event type: ${type}`);
				}
				if (this._listeners[type]) {
					throw new Error(`Cannot register more listener of the ${type} event`);
				}

				this._listeners[type] = callback;
			}

			setRequestHeader(headerName, value) {
				this._requestHeaders.push([headerName, value]);
			}

			abort() {
				this._aborted = true;
				this._listeners.abort({ type: 'abort', target: this });
			}

			send(body) {
				let progressIntervalId;
				let nextImmediate;

				nextImmediate = setImmediate(() => {
					this.readyState = 1;
					this._listeners.readystatechange({ type: 'readystatechange', target: this });

					nextImmediate = setImmediate(() => {
						this.readyState = 2;
						this._listeners.readystatechange({ type: 'readystatechange', target: this });

						progressIntervalId = setInterval(() => {
							this._listeners.progress({ type: 'progress', target: this });
						}, xhrProgressInterval);

						xhrSendCallback(this, body).then(responseBody => {
							this.readyState = 3;
							this._listeners.readystatechange({ type: 'readystatechange', target: this });
							clearInterval(progressIntervalId);
							if (this._timeoutId) {
								clearTimeout(this._timeoutId);
							}

							nextImmediate = setImmediate(() => {
								this.response = responseBody;
								this.readyState = 4;
								this._listeners.readystatechange({ type: 'readystatechange', target: this });
								this._listeners.load({ type: 'load', target: this });
							});
						}).catch(error => {
							this._listeners.error({ type: 'error', target: this, error });
						});
					});
				});

				if (this.timeout) {
					this._timeoutId = setTimeout(() => {
						if (progressIntervalId) {
							clearInterval(progressIntervalId);
						}
						clearImmediate(nextImmediate);
						this._listeners.timeout({ type: 'timeout', target: this });
					}, this.timeout);
				}
			}

			getAllResponseHeaders() {
				return xhrResponseHeaders.map(pair => pair.join(': ')).join('\r\n') + '\r\n';
			}
		};
	});

	beforeEach(() => {
		pluginInstance = new XHR(windowMock);
	});

	using(['get', 'post', 'put', 'patch', 'delete'], (method) => {
		it('should throw an error at the server side', () => {
			const serverSideWindowMock = {
				isClient() {
					return false;
				},

				getWindow() {
					return global;
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

	afterAll(() => {
		delete global.XMLHttpRequest;
	});

	function using(values, func) {
		for (const value of values) {
			func.call(this, value);
		}
	}
});
