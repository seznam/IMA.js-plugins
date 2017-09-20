import GenericError from 'ima/error/GenericError.js';
import StatusCode from 'ima/http/StatusCode.js';
import Window from 'ima/window/Window.js';

const EMPTY_OBJECT = {};

/**
 * Options for a request sent using the HTTP agent.
 * @typedef {Object} XHRRequestOptions
 * @property {number} [timeout] Specifies the request timeout in milliseconds.
 * @property {number} [repeatRequest] Specifies the maximum number of tries to
 *           repeat the request if the request fails.
 * @property {Object<string, string>} [headers] Sets the additional request
 *           headers (the keys are case-insensitive header names, the values
 *           are header values).
 * @property {boolean} [withCredentials] Flag that indicates whether the
 *           request should be made using credentials such as cookies or
 *           authorization headers.
 * @property {function(XHRResponse)} [postProcessor] Response post-processor
 *           applied just before the response is returned.
 * @property {function(RequestObserver)} [observe] The callback that will
 *           receive an observer object when the request is initiated.
 */

/**
 * Request observer and controller object. The state of the request may be
 * observed by setting its <code>on</code>-prefixed properties (these are
 * <code>null</code> by default.
 * @typedef {Object} RequestObserver
 * @property {number} state The current <code>readyState</code> state of the
 *           observed XHR request.
 * @property {function()} abort Callback used to abort the observed XHR
 *           request.
 * @property {?function(Event)} [onstatechange] Callback invoked when the
 *           <code>readystatechange</code> event occurs on the observed
 *           request.
 * @property {?function(Event)} [onprogress] Callback invoked when the
 *           <code>progress</code> event occurs on the observed request.
 */

/**
 * Object representing an HTTP response. This is compatible with the IMA's
 * HTTP Agent's <code>AgentResponse</code> type.
 * @typedef {Object} XHRResponse
 * @property {number} status The HTTP response status code.
 * @property {*} body The parsed response body, parsed as JSON.
 * @property {Object<string, string>} headers The response HTTP headers.
 * @property {XHRRequestParameters} params The parameters that were used to
 *           make the request.
 * @property {boolean} cached Whether or not the response has been cached -
 *           this is always <code>false</code>.
 */

/**
 * @typedef {Object} XHRRequestParameters
 * @property {string} method The HTTP method used to make the request.
 * @property {string} url The original URL to which the request should have
 *           been made.
 * @property {string} transformedUrl The final URL after all pre-processors
 *           have been applied. This is the URL to which the request was made.
 * @property {Object<string, (boolean|number|string)>} data The data sent in
 *           the original request.
 * @property {XHRRequestOptions} options The options used to make the request.
 */

export class XHR {
	static get $dependencies() {
		return [
			Window
		];
	}

	/**
	 * @param {Window} window
	 * @param {XHRRequestOptions=} defaultOptions
	 */
	constructor(window, defaultOptions = {}) {
		this._window = window;
		this._defaultOptions = {};
		this._defaultHeaders = {};
	}

	/**
	 * @param {string} url
	 * @param {*} data
	 * @param {XHRRequestOptions} options
	 */
	get(url, data, options = {}) {
		return this._prepareAndSendRequest('get', url, data, options);
	}

	/**
	 * @param {string} url
	 * @param {*} data
	 * @param {XHRRequestOptions} options
	 */
	post(url, data, options = {}) {
		return this._prepareAndSendRequest('post', url, data, options);
	}

	/**
	 * @param {string} url
	 * @param {*} data
	 * @param {XHRRequestOptions} options
	 */
	put(url, data, options = {}) {
		return this._prepareAndSendRequest('put', url, data, options);
	}

	/**
	 * @param {string} url
	 * @param {*} data
	 * @param {XHRRequestOptions} options
	 */
	patch(url, data, options = {}) {
		return this._prepareAndSendRequest('patch', url, data, options);
	}

	/**
	 * @param {string} url
	 * @param {*} data
	 * @param {XHRRequestOptions} options
	 */
	delete(url, data, options = {}) {
		return this._prepareAndSendRequest('delete', url, data, options);
	}

	/**
	 * @param {string} headerName
	 * @param {string} value
	 */
	setDefaultHeader(headerName, value) {
		this._defaultHeaders[headerName] = value;
	}

	/**
	 * Deletes all currently set default headers.
	 */
	clearDefaultHeaders() {
		this._defaultHeaders = {};
	}

	/**
	 * @param {string} method
	 * @param {string} url
	 * @param {*} data
	 * @param {XHRRequestOptions} options
	 * @return {Promise<XHRResponse>}
	 */
	_prepareAndSendRequest(method, url, data, options) {
		if (!this._window.isClient()) {
			throw new GenericError(
				'The XHR plugin may be used only at the client-side.'
			);
		}

		const completeOptions = this._composeOptions(options);
		const requestParams = this._composeRequestParameters(
			method,
			url,
			data,
			completeOptions
		);
		const completeUrl = method.toLowerCase() === 'get' ?
			url + (url.includes('?') ? '&' : '?') + this._encodeQuery(data)
			:
			url;
		const body = method.toLowerCase() === 'get' ?
			null
			:
			this._shouldEncodeRequestBody(data) ? JSON.stringify(data) : data;

		return this._sendRequest(
			method,
			completeUrl,
			body,
			completeOptions,
			requestParams
		).catch((requestError) => {
			if (completeOptions.repeatRequest > 0) {
				return this._prepareAndSendRequest(
					method,
					url,
					data,
					Object.assign(
						{},
						completeOptions,
						{
							repeatRequest: completeOptions.repeatRequest - 1
						}
					)
				);
			} else {
				throw requestError;
			}
		});
	}

	/**
	 * @param {string} method
	 * @param {string} url
	 * @param {*} body
	 * @param {XHRRequestOptions} options
	 * @param {XHRRequestParameters} requestParams
	 * @return Promise<XHRResponse>
	 */
	_sendRequest(method, url, body, options, requestParams) {
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'json';
		if (options.timeout) {
			xhr.timeout = options.timeout;
		}
		if (options.withCredentials) {
			xhr.withCredentials = true;
		}

		const observer = {
			get state() {
				return xhr.readyState;
			},
			abort() {
				xhr.abort();
			},
			onstatechange: null,
			onprogress: null
		};
		if (options.observe) {
			options.observe(observer);
		}

		xhr.open(method, url);
		for (const headerName of Object.keys(options.headers)) {
			xhr.setRequestHeader(headerName, options.headers[headerName]);
		}

		return this._sendXHRRequest(
			xhr,
			body,
			observer,
			options,
			requestParams
		);
	}

	/**
	 * @param {XMLHttpRequest} xhr
	 * @param {*} body
	 * @param {RequestObserver} observer
	 * @param {XHRRequestOptions} options
	 * @param {XHRRequestParameters} requestParams
	 * @return {Promise<XHRResponse>}
	 */
	_sendXHRRequest(xhr, body, observer, options, requestParams) {
		return new Promise((resolve, reject) => {
			xhr.addEventListener('readystatechange', (event) => {
				if (observer.onstatechange) {
					observer.onstatechange(event);
				}
			});
			xhr.addEventListener('progress', (event) => {
				if (observer.onprogress) {
					observer.onprogress(event);
				}
			});
			xhr.addEventListener('load', (event) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const response = this._composeResponse(xhr, requestParams);
					if (options.postProcessor) {
						resolve(options.postProcessor(response));
					} else {
						resolve(response);
					}
				} else {
					reject(new GenericError('The request failed.', { xhr }));
				}
			});
			xhr.addEventListener('error', (event) => {
				reject(new GenericError('The request failed.', {
					cause: event
				}));
			});
			xhr.addEventListener('timeout', (event) => {
				reject(new GenericError('The request timed out.', {
					cause: event
				}));
			});

			xhr.send(body);
		}).catch((requestError) => {
			throw this._composeRequestError(requestError, requestParams);
		});
	}

	/**
	 * @param {Error} cause
	 * @param {XHRRequestParameters} requestParams
	 * @return {GenericError}
	 */
	_composeRequestError(cause, requestParams) {
		const params = cause instanceof GenericError ?
			cause.getParams()
			:
			EMPTY_OBJECT;
		const status = (
			params.status ||
			(params.xhr && params.xhr.status) ||
			((params.cause && params.cause.type === 'timeout') ?
				StatusCode.TIMEOUT
				:
				StatusCode.SERVER_ERROR
			)
		);

		return new GenericError(cause.message, Object.assign(
			{},
			requestParams,
			{
				status,
				body: (
					params.xhr &&
					(params.xhr.response || params.xhr.responseText)
				),
				cause
			}
		));
	}

	/**
	 * @param {XMLHttpRequest} xhr
	 * @param {XHRRequestParameters} requestParams
	 * @return {XHRResponse}
	 */
	_composeResponse(xhr, requestParams) {
		return {
			status: xhr.status,
			body: xhr.response,
			params: requestParams,
			headers: this._parseHeaders(xhr.getAllResponseHeaders()),
			cached: false
		};
	}

	/**
	 * @params {string} allHeaders
	 * @return {Object<string, string>}
	 */
	_parseHeaders(allHeaders) {
		const parsedHeaders = {};
		for (const header of allHeaders.split('\r\n')) {
			if (!header || !header.includes(':')) {
				continue;
			}

			const [headerName, values] = header.split(/:\s*/, 2);
			parsedHeaders[headerName] = values;
		}
		return parsedHeaders;
	}

	/**
	 * @param {Object<string, (boolean|number|string)>} query
	 * @return {string}
	 */
	_encodeQuery(query) {
		// It would be great if we had native support for URLSearchParams, but
		// IE does not support them
		return Object.keys(query).map(
			key => [key, query[key]].map(encodeURIComponent).join('=')
		).join('&');
	}

	/**
	 * @param {string} method
	 * @param {string} url
	 * @param {Object<string, (boolean|number|string)>} data
	 * @param {XHRRequestOptions} options
	 * @return {XHRRequestParameters}
	 */
	_composeRequestParameters(method, url, data, options) {
		return {
			method,
			url,
			transformedUrl: url,
			data,
			options
		};
	}

	/**
	 * @param {*} requestBody
	 * @return {boolean}
	 */
	_shouldEncodeRequestBody(requestBody) {
		if (!requestBody || typeof requestBody === 'string') {
			return false;
		}

		const NOOP = function() {};
		const window = this._window.getWindow();
		const Blob = window.Blob || NOOP;
		const BufferSource = window.BufferSource || NOOP;
		const FormData = window.FormData || NOOP;
		const URLSearchParams = window.URLSearchParams || NOOP;
		const ReadableStream = window.ReadableStream || NOOP;
		const isNative = (
			requestBody instanceof Blob ||
			requestBody instanceof BufferSource ||
			requestBody instanceof FormData ||
			requestBody instanceof URLSearchParams ||
			requestBody instanceof ReadableStream
		);
		return !isNative;
	}

	/**
	 * @param {XHRRequestOptions} options
	 * @return {XHRRequestOptions}
	 */
	_composeOptions(options) {
		return Object.assign(
			{},
			this._defaultOptions,
			options,
			{
				headers: Object.assign(
					{},
					this._defaultOptions.headers,
					this._defaultHeaders,
					options.headers
				)
			}
		);
	}
}
