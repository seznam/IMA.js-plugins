
import clone from 'clone';
import AbstractEntity from './AbstractEntity';
import HttpMethod from './HttpMethod';
import Request from './Request';
import Response from './Response';
import RestClient from './RestClient';

/**
 * Abstract implementation of the generic REST API client. Implementations of
 * the {@linkcode RestClient} interface should extend this class.
 *
 * @abstract
 */
export default class AbstractRestClient extends RestClient {
	/**
	 * Initializes the abstract REST API client.
	 *
	 * @param {HttpAgent} httpAgent The IMA HTTP agent to use to execute
	 *        requests.
	 * @param {?Configurator} configurator The configurator to use for fetching
	 *        the server-provided configuration.
	 * @param {LinkGenerator} linkGenerator The link generator used to generate
	 *        request URLs.
	 * @param {RequestPreProcessor[]} preProcessors The request pre-processors.
	 * @param {ResponsePostProcessor[]} postProcessors The response
	 *        post-processors.
	 */
	constructor(httpAgent, configurator, linkGenerator, preProcessors,
			postProcessors) {
		super();

		/**
		 * The IMA HTTP agent to use to execute requests.
		 *
		 * @private
		 * @type {HttpAgent}
		 */
		this._httpAgent = httpAgent;

		/**
		 * The configurator to use for fetching the server-provided
		 * configuration.
		 *
		 * @private
		 * @type {?Configurator}
		 */
		this._configurator = configurator;

		/**
		 * The link generator used to generate request URLs.
		 *
		 * @private
		 * @type {LinkGenerator}
		 */
		this._linkGenerator = linkGenerator;

		/**
		 * The request pre-processors.
		 *
		 * @private
		 * @type {RequestPreProcessor[]}
		 */
		this._preProcessors = preProcessors.slice();

		/**
		 * The response post-processors.
		 *
		 * @private
		 * @type {ResponsePostProcessor[]}
		 */
		this._postProcessors = postProcessors.slice();

		/**
		 * The server-provided configuration, or {@code null} if the
		 * configuration has not been fetched yet.
		 *
		 * @private
		 * @type {?Object<string, *>}
		 */
		this._serverConfiguration = null;

		/**
		 * Flag signalling whether the server-provided configuration has
		 * already been fetched.
		 *
		 * @private
		 * @type {boolean}
		 */
		this._serverConfigurationFetched = false;
	}

	/**
	 * @inheritdoc
	 * @override
	 */
	list(resource, parameters = {}, options = {}, parentEntity = null) {
		return this._prepareAndExecuteRequest(
			HttpMethod.GET,
			parentEntity,
			resource,
			null,
			parameters,
			null,
			options
		);
	}

	/**
	 * @inheritdoc
	 * @override
	 */
	get(resource, id, parameters = {}, options = {}, parentEntity = null) {
		return this._prepareAndExecuteRequest(
			HttpMethod.GET,
			parentEntity,
			resource,
			id,
			parameters,
			null,
			options
		);
	}

	/**
	 * @inheritdoc
	 * @override
	 */
	patch(resource, id, data, parameters = {}, options = {}, parentEntity = null) {
		return this._prepareAndExecuteRequest(
			HttpMethod.PATCH,
			parentEntity,
			resource,
			id,
			parameters,
			data,
			options
		);
	}

	/**
	 * @inheritdoc
	 * @override
	 */
	replace(resource, id, data, parameters = {}, options = {}, parentEntity = null) {
		return this._prepareAndExecuteRequest(
			HttpMethod.PUT,
			parentEntity,
			resource,
			id,
			parameters,
			data,
			options
		);
	}

	/**
	 * @inheritdoc
	 * @override
	 */
	create(resource, data, parameters = {}, options = {}, parentEntity = null) {
		return this._prepareAndExecuteRequest(
			HttpMethod.POST,
			parentEntity,
			resource,
			null,
			parameters,
			data,
			options
		);
	}

	/**
	 * @inheritdoc
	 * @override
	 */
	delete(resource, id, parameters = {}, options = {}, parentEntity = null) {
		return this._prepareAndExecuteRequest(
			HttpMethod.DELETE,
			parentEntity,
			resource,
			id,
			parameters,
			null,
			options
		);
	}

	/**
	 * Prepares, pre-processes and (if necessary) executes the request, then
	 * post-processes the response and resolves the returned promise to the
	 * post-processed response.
	 *
	 * The method first fetches the server-provided configuration if a
	 * configurator is set and the server-provided configuration has not been
	 * retrieved yet.
	 *
	 * @private
	 * @param {string} method The HTTP method to use when making the request.
	 * @param {*} parentEntity The parent entity within which the specified
	 *        resource will be manipulated. It may be needed to determine the
	 *        parent resource from the entity. Use {@code null} if the
	 *        specified resource is a top-level resource within the REST API.
	 * @param {*} resource The REST resource to access.
	 * @param {?(number|string|(number|string)[])} id The ID(s) identifying the
	 *        entity or group of entities to access.
	 * @param {Object<string, (number|string|(number|string)[])>} parameters
	 *        Additional parameters to use when generating the URL.
	 * @param {*} data The data to send in the request's body.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options The HTTP request option as they would be passed to
	 *        the IMA HTTP agent.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} The
	 *         post-processed server's response.
	 */
	_prepareAndExecuteRequest(method, parentEntity, resource, id, parameters,
			data, options) {
		return Promise.resolve().then(() => {
			if (this._configurator && !this._serverConfigurationFetched) {
				return this._configurator.getConfiguration().then((config) => {
					this._serverConfiguration = config;
					this._serverConfigurationFetched = true;
				});
			}
		}).then(() => {
			let url = this._generateUrl(
				parentEntity,
				resource,
				id,
				parameters
			);
			let request = this._createRequest(
				parentEntity,
				resource,
				parameters,
				method,
				url,
				data,
				options
			);

			return this._executeRequest(request);
		});
	}

	/**
	 * Creates the URL to which to send the request based on the provided
	 * information.
	 *
	 * @private
	 * @param {*} parentEntity The parent entity within which the specified
	 *        resource will be manipulated. It may be needed to determine the
	 *        parent resource from the entity. Use {@code null} if the
	 *        specified resource is a top-level resource within the REST API.
	 * @param {*} resource The resource to be accessed in the REST API.
	 * @param {?(number|string|(number|string)[])} id The ID of the entity or
	 *        entities to access.
	 * @param {Object<string, (number|string|(number|string)[])>} parameters
	 *        Additional parameters to use when generating the URL.
	 * @return {string} The generated URL.
	 */
	_generateUrl(parentEntity, resource, id, parameters) {
		return this._linkGenerator.createLink(
			parentEntity,
			resource,
			id,
			parameters,
			this._serverConfiguration
		);
	}

	/**
	 * Creates a new request object from the provided data.
	 *
	 * @private
	 * @param {*} parentEntity The parent entity within which the specified
	 *        resource will be manipulated. It may be needed to determine the
	 *        parent resource from the entity. Use {@code null} if the
	 *        specified resource is a top-level resource within the REST API.
	 * @param {*} resource The resource to be accessed in the REST API.
	 * @param {Object<string, (number|string|(number|string)[])>} parameters
	 *        Additional parameters that were used to generate the URL.
	 * @param {string} method The HTTP method to use to send the request.
	 * @param {string} url The URL to which the request should be made.
	 * @param {*} data The data to send in the request's body.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} rawOptions The HTTP request option as they would be passed to
	 *        the IMA HTTP agent.
	 * @return {Request} The created request.
	 */
	_createRequest(parentEntity, resource, parameters, method, url, data,
			rawOptions) {
		let options = Object.assign({}, rawOptions);
		let headers = options.headers || {};
		delete options.headers;

		return new Request({
			parentEntity,
			resource,
			parameters,
			method,
			url,
			data,
			headers,
			options,
			serverConfiguration: this._serverConfiguration
		});
	}

	/**
	 * Pre-processes the provided request into either a request to send to the
	 * server or a response object if the no request to the server is needed.
	 * If a request is produced, the request is then sent to the server, and
	 * the server's response is turned into a response object. Finally, the
	 * response object will be post-processed and become the resolved value of
	 * the returned promise.
	 *
	 * @private
	 * @param {Request} request The request to pre-process, and then send to
	 *        the server.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the post-processed server's response, or a
	 *         post-processed response provided by one of the pre-processors,
	 *         or an entity or array of entities or {@code null} if the
	 *         resource class has the {@code inlineResponseBody} flag set.
	 */
	_executeRequest(request) {
		let responsePromise;

		for (let preProcessor of this._preProcessors) {
			let processedRequest = preProcessor.process(request);
			if (processedRequest instanceof Request) {
				request = processedRequest;
			} else {
				responsePromise = Promise.resolve(processedRequest);
				break;
			}
		}

		if (!responsePromise) {
			responsePromise = this._executeRequestUsingHttpAgent(request);
		}

		return responsePromise.then((response) => {
			for (let postProcessor of this._postProcessors) {
				response = postProcessor.process(response);
			}

			if (request.resource.prototype instanceof AbstractEntity) {
				response = this._convertResponseBodyToEntities(response);
			}

			if (request.resource.inlineResponseBody) {
				return response.body;
			}

			return response;
		});
	}

	/**
	 * Converts the provided response to a response with the body set an
	 * entity, an array of entities, or {@code null}. The entities will be
	 * instances of the REST API resource-identifying class (a class extending
	 * the {@linkcode AbstractEntity} class).
	 *
	 * The body of the resulting response object will be {@code null} if the
	 * provided response contains no useful data in its body.
	 *
	 * @private
	 * @param {Response} response The REST API response that should have its
	 *        body replaced with entity(ies).
	 * @return {Response} Response object with its body set to an entity, an
	 *         array of entities, or {@code null} if the original body did not
	 *         contain any usable data.
	 */
	_convertResponseBodyToEntities(response) {
		let body = response.body;
		let resource = response.request.resource;
		let parentEntity = response.request.parentEntity;

		// The data has been initially deeply frozen when we created the first
		// Response object, but the entity is mutable, so we must clone the
		// data to ensure mutability of deep objects.
		let mustCloneData = !resource.isImmutable && $Debug;
		if (mustCloneData) {
			body = clone(body);
		}

		if (body instanceof Array) {
			body = body.map(entityData => new resource(
				this,
				entityData,
				parentEntity
			));
		} else if (body) {
			body = new resource(this, body, parentEntity);
		} else {
			body = null;
		}

		return new Response(Object.assign({}, response, {
			body
		}));
	}

	/**
	 * Sends the provided request using the IMA HTTP agent, and returns a
	 * promise that resolves to the server's response.
	 *
	 * @private
	 * @param {Request} request The request to send to the server.
	 * @return {Promise<Response>} A promise that will resolve to a response
	 *         object containing the server's response.
	 */
	_executeRequestUsingHttpAgent(request) {
		let methodName;
		switch (request.method) {
			case HttpMethod.GET:
				methodName = 'get';
				break;
			case HttpMethod.POST:
				methodName = 'post';
				break;
			case HttpMethod.PATCH:
				methodName = 'patch';
				break;
			case HttpMethod.PUT:
				methodName = 'put';
				break;
			case HttpMethod.DELETE:
				methodName = 'delete';
				break;
			default:
				throw new Error(`Unsupported HTTP method ${request.method}`);
		}

		return this._httpAgent[methodName](
			request.url,
			request.data || {},
			Object.assign({}, request.options, { headers: request.headers })
		).then((agentResponse) => {
			return new Response({
				status: agentResponse.status,
				headers: agentResponse.headers,
				body: agentResponse.body,
				cached: agentResponse.cached,
				request: request
			});
		});
	}
}
