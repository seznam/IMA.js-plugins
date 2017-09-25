import StatusCode from 'ima/http/StatusCode.js';
import XHR from '../XHR.js';

describe('XHR', () => {
	const windowMock = {
		isClient() {
			return true;
		},

		getWindow() {
			return global;
		}
	};
	class Blob {}
	class BufferSource {}
	class FormData {}
	class URLSearchParams {}
	class ReadableStream {}

	/**
	 * @type XHR
	 */
	let pluginInstance;
	let xhrSendCallback;
	let xhrProgressInterval;
	let xhrResponseHeaders;

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

			open(method, url, async = true, username = null, password = null) {
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

						Promise.resolve(xhrSendCallback(this, body)).then(responseBody => {
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
		xhrSendCallback = () => Promise.resolve(null);
		xhrProgressInterval = 10; // milliseconds
		xhrResponseHeaders = [['content-type', 'application/javascript']];
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

		it(`should handle a ${method} request without data`, async() => {
			const status = 201;
			const responseBody = null;
			const url = 'http://localhost:8080/api/v1/' + Math.random();
			xhrSendCallback = async(xhr, requestBody) => {
				expect(xhr._method).toBe(method);
				expect(xhr._url).toBe(url + (method === 'get' ? '?' : ''));
				expect(xhr._requestHeaders).toEqual([]);
				expect(requestBody).toBe(null);
				xhr.status = status;
				return responseBody;
			};

			const response = await pluginInstance[method](url);
			expect(response).toEqual({
				status,
				body: responseBody,
				headers: { 'content-type': 'application/javascript' },
				params: {
					method,
					url,
					transformedUrl: url,
					data: method === 'get' ? {} : null,
					options: { headers: {} }
				},
				cached: false
			});
		});

		it(`should handle a ${method} request with data`, async() => {
			const status = 200;
			const responseBody = {
				testing: [1, 2, { hello: 'there' }]
			};
			const url = 'http://localhost:8080/api/v1/' + Math.random();
			const requestData = {
				'&': '=',
				abc: 123
			};
			xhrSendCallback = async(xhr, requestBody) => {
				expect(xhr._method).toBe(method);
				expect(xhr._url).toBe(
					url + (method === 'get' ? '?%26=%3D&abc=123' : '')
				);
				expect(xhr._requestHeaders).toEqual([]);
				expect(requestBody).toEqual(method === 'get' ? null : JSON.stringify(requestData));
				xhr.status = status;
				xhrResponseHeaders.push(
					['x-time', 'now, later'],
					['should', 'definitely']
				);
				return responseBody;
			};

			const response = await pluginInstance[method](url, requestData);
			expect(response).toEqual({
				status,
				body: responseBody,
				headers: {
					'content-type': 'application/javascript',
					'x-time': 'now, later',
					should: 'definitely'
				},
				params: {
					method,
					url,
					transformedUrl: url,
					data: requestData,
					options: { headers: {} }
				},
				cached: false
			});
		});

		it(`should time out a ${method} request after timeout`, async() => {
			xhrSendCallback = () => new Promise(() => {});

			try {
				await pluginInstance[method]('http://::1/api', {}, {
					timeout: 1
				});
			} catch (timeoutError) {
				expect(timeoutError.getParams().status).toBe(StatusCode.TIMEOUT);
				return;
			}

			throw new Error('The request should have timed out');
		});

		it(`should repeat a failed ${method} request the specified number of times`, async() => {
			let counter = 0;
			xhrSendCallback = () => {
				counter++;
			};

			try {
				await pluginInstance[method]('http://::1/api', {}, { repeatRequest: 2 });
			} catch (requestError) {
				expect(counter).toBe(3);
				return;
			}

			throw new Error('The request should have been rejected');
		});

		it(`should send the specified headers in a ${method} request`, async() => {
			xhrSendCallback = (xhr) => {
				expect(xhr._requestHeaders).toEqual([
					['foo', 'bar'],
					['some', 'thing']
				]);
				xhr.status = 200;
			};

			await pluginInstance[method]('http://::1/api', {}, {
				headers: {
					foo: 'bar',
					some: 'thing'
				}
			});
		});

		it(`should send the cross-origin credentials in a ${method} request`, async() => {
			xhrSendCallback = (xhr) => {
				expect(xhr.withCredentials).toBe(true);
				xhr.status = 200;
			};

			await pluginInstance[method]('http://::1/api', {}, {
				withCredentials: true
			});
		});

		it(`should allow post-processing the response of a ${method} request`, async() => {
			xhrSendCallback = (xhr) => {
				xhr.status = 200;
				return [1, 2];
			};

			const responce = await pluginInstance[method]('http://::1/api', {}, {
				postProcessor(response) {
					expect(response).toEqual({
						status: 200,
						body: [1, 2],
						headers: { 'content-type': 'application/javascript' },
						params: {
							method,
							url: 'http://::1/api',
							transformedUrl: 'http://::1/api',
							data: {},
							options: { postProcessor: this.postProcessor, headers: {} }
						},
						cached: false
					});
					return {
						status: 201,
						body: [1, 2, 3],
						headers: {},
						params: {},
						cached: false
					};
				}
			});

			expect(responce).toEqual({
				status: 201,
				body: [1, 2, 3],
				headers: {},
				params: {},
				cached: false
			});
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

			it(`should not encode native request body objects of a ${method} request`, () => {
			});
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

	it('should append the data to the query string for a get request', async() => {
		// use a URL that already has a query string
		const url = 'http://localhost:8080/api/v1/resource?id=1';
		const requestData = {
			abc: 123
		};

		xhrSendCallback = (xhr, requestBody) => {
			expect(xhr._url).toBe(`${url}&abc=123`);
			expect(requestBody).toBe(null);
			xhr.status = 200;
		};

		await pluginInstance.get(url, requestData);
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
