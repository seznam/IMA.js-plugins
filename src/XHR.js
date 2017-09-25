import GenericError from 'ima/error/GenericError.js';
import StatusCode from 'ima/http/StatusCode.js';
import Window from 'ima/window/Window.js';

/**
 * Empty object used as a fallback immutable value where an object is expected.
 *
 * @type {{}}
 */
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
 * @property {XHRRequestOptions} options The complete options used to make the
 *           request, with the defaults filled in for easier debugging.
 */

/**
 * The main class of this plugin for making HTTP requests using the
 * XMLHttpRequest backend, which - at the moment of writing this - offers
 * progress events and aborting requests, features that are not at the moment
 * available for the fetch API.
 *
 * This class may be used only at the client side.
 */
export default class XHR {

	static get $dependencies() {
		return [
			Window
		];
	}

	/**
	 * Initializes the XHR request agent.
	 *
	 * @param {Window} window The IMA's Window helper.
	 * @param {XHRRequestOptions=} defaultOptions The default request options.
	 */
	constructor(window, defaultOptions = EMPTY_OBJECT) {
		this._window = window;
		this._defaultOptions = defaultOptions;
		this._defaultHeaders = {};
	}

	/**
	 * Sends a GET request to the specified url.
	 *
	 * @param {string} url The URL to which the request should be made.
	 * @param {*=} data The data to send in the request's query string.
	 * @param {XHRRequestOptions=} options The optional request options.
	 * @return {Promise<XHRResponse>} A promise that will resolve to the
	 *         response object.
	 */
	get(url, data = EMPTY_OBJECT, options = EMPTY_OBJECT) {
		return this._prepareAndSendRequest('get', url, data, options);
	}

	/**
	 * Sends a POST request to the specified url, carrying the specified
	 * request body.
	 *
	 * @param {string} url The URL to which the request should be made.
	 * @param {*=} data The data to send send in the request's body.
	 * @param {XHRRequestOptions=} options The optional request options.
	 * @return {Promise<XHRResponse>} A promise that will resolve to the
	 *         response object.
	 */
	post(url, data = null, options = EMPTY_OBJECT) {
		return this._prepareAndSendRequest('post', url, data, options);
	}

	/**
	 * Sends a PUT request to the specified url, carrying the specified
	 * request body.
	 *
	 * @param {string} url The URL to which the request should be made.
	 * @param {*=} data The data to send send in the request's body.
	 * @param {XHRRequestOptions=} options The optional request options.
	 * @return {Promise<XHRResponse>} A promise that will resolve to the
	 *         response object.
	 */
	put(url, data = null, options = EMPTY_OBJECT) {
		return this._prepareAndSendRequest('put', url, data, options);
	}

	/**
	 * Sends a PATCH request to the specified url, carrying the specified
	 * request body.
	 *
	 * @param {string} url The URL to which the request should be made.
	 * @param {*=} data The data to send send in the request's body.
	 * @param {XHRRequestOptions=} options The optional request options.
	 * @return {Promise<XHRResponse>} A promise that will resolve to the
	 *         response object.
	 */
	patch(url, data = null, options = EMPTY_OBJECT) {
		return this._prepareAndSendRequest('patch', url, data, options);
	}

	/**
	 * Sends a DELETE request to the specified url, carrying the specified
	 * request body.
	 *
	 * @param {string} url The URL to which the request should be made.
	 * @param {*=} data The data to send send in the request's body.
	 * @param {XHRRequestOptions=} options The optional request options.
	 * @return {Promise<XHRResponse>} A promise that will resolve to the
	 *         response object.
	 */
	delete(url, data = null, options = EMPTY_OBJECT) {
		return this._prepareAndSendRequest('delete', url, data, options);
	}

	/**
	 * Sets the specified header's default value. This overrides the header's
	 * value in the default options.
	 *
	 * @param {string} headerName The name of the header to set.
	 * @param {string} value The default value to use when the header is not
	 *        set in the request's options.
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
	 * Creates and sends an HTTP request using the specified HTTP method to the
	 * specified url, carrying the specified data in either the query string
	 * (for GET requests) or request body (otherwise).
	 *
	 * The method will re-attempt the request if it fails and additional tries
	 * have been specified in the <code>repeatRequest</code> option.
	 *
	 * @param {string} method The HTTP method to use.
	 * @param {string} url The URL to which the request should be made.
	 * @param {*} data The data to send in the request. These will be encoded
	 *        into the query string for GET requests, and sent as request body
	 *        for requests using other HTTP methods.
	 * @param {XHRRequestOptions} options Request options, as provided by the
	 *        caller of the public API.
	 * @return {Promise<XHRResponse>} A promise that will resolve to the
	 *         response object.
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
	 * Creates and sends an HTTP request using the specified HTTP method to the
	 * specified url, carrying the specified request body.
	 *
	 * @param {string} method The HTTP method to use.
	 * @param {string} url The URL to which the request should be made.
	 * @param {*} body The body to send in the request.
	 * @param {XHRRequestOptions} options Options provided by the caller of the
	 *        public API, augmented with the default options and headers.
	 * @param {XHRRequestParameters} requestParams Parameters that were used to
	 *        create the request.
	 * @return Promise<XHRResponse> A promise that will resolve to the
	 *         response object.
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
	 * Sends the specified HTTP request, with the provided body as the
	 * request's body.
	 *
	 * @param {XMLHttpRequest} xhr The XMLHttpRequest instance to use to send
	 *        the request. The instance must already be configured and ready
	 *        for sending the request body.
	 * @param {*} body The body to send with the request.
	 * @param {RequestObserver} observer The observer of the request to send.
	 * @param {XHRRequestOptions} options Options provided by the caller of the
	 *        public API, augmented with the default options and headers.
	 * @param {XHRRequestParameters} requestParams The parameters that were
	 *        used to create the request.
	 * @return {Promise<XHRResponse>} A promise that will resolve to the
	 *         response object.
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
	 * Creates a new error containing all the meta-information related to the
	 * request at hand. The returned error is meant to be used for rejecting
	 * the promise returned by the public API of this class.
	 *
	 * @param {Error} cause The cause of the request's failure.
	 * @param {XHRRequestParameters} requestParams Parameters that were used to
	 *        create the request.
	 * @return {GenericError} The error to reject the request promise with.
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
	 * Composes an object representing a request response.
	 *
	 * @param {XMLHttpRequest} xhr The XMLHttpRequest instance representing the
	 *        sent request.
	 * @param {XHRRequestParameters} requestParams Parameters that were used to
	 *        create the request.
	 * @return {XHRResponse} Composed response object.
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
	 * Parses the provided string containing a set of HTTP headers into a
	 * key-value object.
	 *
	 * @params {string} allHeaders A string containing HTTP headers separated
	 *         by the CRLF sequence.
	 * @return {Object<string, string>} Parsed HTTP headers.
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
	 * Encodes the provided query parameters into a query string.
	 *
	 * @param {Object<string, (boolean|number|string)>} query The query to
	 *        encode.
	 * @return {string} Encoded query string, without the "?" prefix.
	 */
	_encodeQuery(query) {
		// It would be great if we had native support for URLSearchParams, but
		// IE does not support them
		return Object.keys(query).map(
			key => [key, query[key]].map(encodeURIComponent).join('=')
		).join('&');
	}

	/**
	 * Composes an object representing the parameters used to create the
	 * request.
	 *
	 * @param {string} method The HTTP method to use to make the request.
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string)>} data The data sent with
	 *        the request.
	 * @param {XHRRequestOptions} options The options passed by the calling
	 *        API.
	 * @return {XHRRequestParameters} The composed request parameters object.
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
	 * Tests whether the provided request body needs to be manually encoded as
	 * JSON.
	 *
	 * @param {*} requestBody The request body.
	 * @return {boolean} <code>true</code> if and only if the provided request
	 *         body should be manually encoded as JSON, the request body may be
	 *         used as-is otherwise.
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
	 * Composes complete request options by filling in the ones missing in the
	 * provided options using the default options and default headers.
	 *
	 * @param {XHRRequestOptions} options The options, as provided by the
	 *        calling code.
	 * @return {XHRRequestOptions} Composed options, with the default options
	 *         and default headers filled in.
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
