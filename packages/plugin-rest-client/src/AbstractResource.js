import RestClient from './RestClient';

/**
 * Symbols for representing the private fields in the entity.
 *
 * @type {Object<string, Symbol>}
 */
const PRIVATE = Object.freeze({
	restClient: Symbol('restClient'),
	entityClass: Symbol('entityClass'),
	entityClassConfigured: Symbol('entityClassConfigured')
});

/**
 * The base class for creating REST API service classes, used to group REST API methods
 * specified by the REST API client implementation on the given AbstractEntity Class.
 */
export default class AbstractResource {
	static get $dependencies() {
		return [RestClient];
	}

	/**
	 * Initializes the service.
	 *
	 * @param {RestClient} restClient REST API client.
	 */
	constructor(restClient) {
		if ($Debug) {
			if (!(restClient instanceof RestClient)) {
				throw new TypeError(
					'The rest client must be a RestClient ' +
						`instance, ${restClient} provided`
				);
			}
		}

		/**
		 * The REST API client to use to communicate with the REST API.
		 *
		 * @type {RestClient}
		 */
		this[PRIVATE.restClient] = restClient;
		Object.defineProperty(this, PRIVATE.restClient, {
			enumerable: false
		});
	}

	/**
	 * Returns the REST API client instance that is used in this service class. The
	 * returned REST API client will also be used in all the dynamic methods of
	 * this service.
	 *
	 * @return {RestClient} The REST API client.
	 */
	get $restClient() {
		return this[PRIVATE.restClient];
	}

	/**
	 * Returns entity class identifying the resource of this service, it is also used
	 * to initialize all data fetched using the appropriate class methods.
	 *
	 * @return {?AbstractEntity} Entity class identifying the resource of this service.
	 */
	static get entityClass() {
		if ($Debug) {
			if (!this[PRIVATE.entityClassConfigured]) {
				throw new TypeError(
					'The entityClass field is abstract and must be overridden'
				);
			}
		}

		return this[PRIVATE.entityClass];
	}

	/**
	 * This setter is used for compatibility with the Public Class Fields ES
	 * proposal (at stage 2 at the moment of writing this).
	 *
	 * See the related getter for more details about this property.
	 *
	 * @param {?AbstractEntity} entityClass Entity class identifying the resource of this service.
	 */
	static set entityClass(entityClass) {
		if ($Debug) {
			if (this[PRIVATE.entityClassConfigured]) {
				throw new TypeError('The entityClass property cannot be reconfigured');
			}
		}

		this[PRIVATE.entityClass] = entityClass;
		Object.defineProperty(this, PRIVATE.entityClass, {
			enumerable: false
		});
		this[PRIVATE.entityClassConfigured] = true;
	}

	/**
	 * Retrieves the specified entities from the REST API resource
	 * identified by the {@link AbstractResource.entityClass}.
	 *
	 * @param {Object<string, (number|string|(number|string)[])>=} parameters
	 *        The additional parameters to send to the server with the request
	 *        to configure the server's response.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @param {?AbstractEntity=} parentEntity The parent entity containing the
	 *        resource from which the entities should be listed.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	list(parameters = {}, options = {}, parentEntity = null) {
		return this[PRIVATE.restClient].list(
			this.constructor.entityClass,
			parameters,
			options,
			parentEntity
		);
	}

	/**
	 * Retrieves the specified entity or entities from the REST API resource
	 * identified by the {@link AbstractResource.entityClass}.
	 *
	 * @param {(number|string|(number|string)[])} id The ID(s) identifying the
	 *        entity or group of entities to retrieve.
	 * @param {Object<string, (number|string|(number|string)[])>=} parameters
	 *        The additional parameters to send to the server with the request
	 *        to configure the server's response.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @param {?AbstractEntity=} parentEntity The parent entity containing the
	 *        resource from which the entity should be retrieved.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	get(id, parameters = {}, options = {}, parentEntity = null) {
		return this[PRIVATE.restClient].get(
			this.constructor.entityClass,
			id,
			parameters,
			options,
			parentEntity
		);
	}

	/**
	 * Creates a new entity in the REST API resource identifying by this
	 * {@link AbstractResource.entityClass} class using the provided data.
	 *
	 * @param {Object<string, *>} data The entity data. The data should be
	 *        compatible with this entity's structure so that they can be
	 *        directly assigned to the entity, and will be automatically
	 *        serialized before submitting to the server.
	 * @param {Object<string, (number|string|(number|string)[])>=} parameters
	 *        The additional parameters to send to the server with the request
	 *        to configure the server's response.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @param {?AbstractEntity=} parentEntity The parent entity containing the
	 *        nested resource within which the new entity should be created.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	create(data, parameters = {}, options = {}, parentEntity = null) {
		// We create an entity-like object so that we can serialize the data
		// and properly create a new entity instance later in the REST API client.
		let fakeEntity = Reflect.construct(this.constructor.entityClass, [
			data,
			parentEntity
		]);
		let serializedData = fakeEntity.$serialize();

		return this[PRIVATE.restClient].create(
			this.constructor.entityClass,
			serializedData,
			parameters,
			options,
			parentEntity
		);
	}

	/**
	 * Deletes the specified entity or entities from the REST API resource
	 * identified by this {@link AbstractResource.entityClass} class.
	 *
	 * @param {(number|string|(number|string)[])} id The ID(s) identifying the
	 *        entity or group of entities to retrieve.
	 * @param {Object<string, (number|string|(number|string)[])>=} parameters
	 *        The additional parameters to send to the server with the request
	 *        to configure the server's response.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @param {?AbstractEntity=} parentEntity The parent entity containing the
	 *        resource from which the entity should be deleted.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	delete(id, parameters = {}, options = {}, parentEntity = null) {
		return this[PRIVATE.restClient].delete(
			this.constructor.entityClass,
			id,
			parameters,
			options,
			parentEntity
		);
	}

	/**
	 * Patches the state of an entity using the provided data. The method
	 * first patches the state of provided entity in the REST API resource,
	 * and, after a successful update, the method then patches the state of
	 * provided entity's instance.
	 *
	 * @param {AbstractEntity} entity Instance of the entity to be patched.
	 * @param {Object<string, *>} data The data with which provided entity
	 * 		  should be patched. The data should be compatible with provided
	 * 		  entity's structure so that they can be directly assigned to the
	 * 		  entity, and will be automatically serialized before submitting
	 * 		  to the server.
	 * @param {Object<string, (number|string|(number|string)[])>=} parameters
	 *        The additional parameters to send to the server with the request
	 *        to configure the server's response.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         the provided entity's class has the {@code inlineResponseBody}
	 *         flag set.
	 */
	patch(entity, data, parameters = {}, options = {}) {
		let resource = entity.constructor;
		let id = entity[resource.idFieldName];

		return this[PRIVATE.restClient]
			.patch(resource, id, entity.$serialize(data), parameters, options)
			.then(response => {
				if (!resource.isImmutable) {
					Object.assign(this, data);
				}

				entity.$validatePropTypes();
				return response;
			});
	}

	/**
	 * Replaces entity in the REST API resource with the provided entity's current
	 * state.
	 *
	 * @param {AbstractEntity} entity Entity containing state to be replaced.
	 * @param {Object<string, (number|string|(number|string)[])>=} parameters
	 *        The additional parameters to send to the server with the request
	 *        to configure the server's response.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         the provided entity's class has the {@code inlineResponseBody}
	 *         flag set.
	 */
	replace(entity, parameters = {}, options = {}) {
		let resource = entity.constructor;
		let id = entity[resource.idFieldName];

		return this[PRIVATE.restClient].replace(
			resource,
			id,
			entity.$serialize(),
			parameters,
			options
		);
	}
}
