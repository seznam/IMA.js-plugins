
/**
 * Utility for easier communication with a REST API server.
 *
 * @interface
 */
export default class RestClient {
	/**
	 * Retrieves the entities from the specified REST resource.
	 *
	 * The response may be adjusted, filtered, sorted, or extended using the
	 * additional parameters sent to the server, depending on the server's
	 * options and capabilities.
	 *
	 * Implementation note: The method performs a GET HTTP request to the REST
	 * API.
	 *
	 * @param {*} resource The resource from which the entities should be
	 *        retrieved.
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
	 * @param {*} parentEntity The parent entity within which the specified
	 *        resource will be manipulated. It may be needed to determine the
	 *        parent resource from the entity. Use {@code null} if the
	 *        specified resource is a top-level resource within the REST API.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         the resource is a class extending the {@code AbstractEntity}
	 *         class and has the {@code inlineResponseBody} flag set.
	 */
	list(resource, parameters = {}, options = {}, parentEntity = null) {}

	/**
	 * Retrieves the specified entity form the specified REST resource.
	 *
	 * The response may be adjusted, filtered, or extended using the additional
	 * parameters sent to the server, depending on the server's options and
	 * capabilities.
	 *
	 * Implementation note: The method performs a GET HTTP request to the REST
	 * API.
	 *
	 * @param {*} resource The resource from which the entity should be
	 *        retrieved.
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
	 * @param {*} parentEntity The parent entity within which the specified
	 *        resource will be manipulated. It may be needed to determine the
	 *        parent resource from the entity. Use {@code null} if the
	 *        specified resource is a top-level resource within the REST API.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         the resource is a class extending the {@code AbstractEntity}
	 *         class and has the {@code inlineResponseBody} flag set.
	 */
	get(resource, id, parameters = {}, options = {}, parentEntity = null) {}

	/**
	 * Patches the specified entity in the specified REST resource using the
	 * provided partial state of the entity, replacing the matching properties
	 * and adding the missing ones.
	 *
	 * Note that the the method cannot be used to remove existing fields from
	 * the entity, the {@linkcode replace} method has to be used for that
	 * instead.
	 *
	 * Implementation note: The method performs a PATCH HTTP request to the
	 * REST API.
	 *
	 * @param {*} resource The resource in which the entity should be modified.
	 * @param {(number|string|(number|string)[])} id The ID(s) identifying the
	 *        entity or group of entities to modify.
	 * @param {*} data The data representing the modifications to make to the
	 *        entity.
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
	 * @param {*} parentEntity The parent entity within which the specified
	 *        resource will be manipulated. It may be needed to determine the
	 *        parent resource from the entity. Use {@code null} if the
	 *        specified resource is a top-level resource within the REST API.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         the resource is a class extending the {@code AbstractEntity}
	 *         class and has the {@code inlineResponseBody} flag set.
	 */
	patch(resource, id, data, parameters = {}, options = {}, parentEntity = null) {}

	/**
	 * Replaces the specified entity in the specified REST resource by a new
	 * entity created using the provided data.
	 *
	 * Implementation note: The method performs a PUT HTTP request to the REST
	 * API.
	 *
	 * @param {*} resource The resource in which the entity should be created.
	 * @param {(number|string|(number|string)[])} id The ID(s) identifying the
	 *        entity or group of entities to replace.
	 * @param {*} data The data representing the entity.
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
	 * @param {*} parentEntity The parent entity within which the specified
	 *        resource will be manipulated. It may be needed to determine the
	 *        parent resource from the entity. Use {@code null} if the
	 *        specified resource is a top-level resource within the REST API.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         the resource is a class extending the {@code AbstractEntity}
	 *         class and has the {@code inlineResponseBody} flag set.
	 */
	replace(resource, id, data, parameters = {}, options = {}, parentEntity = null) {}

	/**
	 * Creates a new entity using the provided data in the specified REST
	 * resource.
	 *
	 * Implementation note: The method performs a POST HTTP request to the REST
	 * API.
	 *
	 * @param {*} resource The resource in which the entity should be created.
	 * @param {*} data The data representing the entity.
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
	 * @param {*} parentEntity The parent entity within which the specified
	 *        resource will be manipulated. It may be needed to determine the
	 *        parent resource from the entity. Use {@code null} if the
	 *        specified resource is a top-level resource within the REST API.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         the resource is a class extending the {@code AbstractEntity}
	 *         class and has the {@code inlineResponseBody} flag set.
	 */
	create(resource, data, parameters = {}, options = {}, parentEntity = null) {}

	/**
	 * Deletes the resource entity identified by the specified ID from the
	 * specified REST resource.
	 *
	 * Implementation note: The method performs a DELETE HTTP request to the
	 * REST API.
	 *
	 * @param {*} resource The resource from which the entity should be
	 *        deleted.
	 * @param {(number|string|(number|string)[])} id The ID(s) identifying the
	 *        entity or group of entities to delete.
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
	 * @param {*} parentEntity The parent entity within which the specified
	 *        resource will be manipulated. It may be needed to determine the
	 *        parent resource from the entity. Use {@code null} if the
	 *        specified resource is a top-level resource within the REST API.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         the resource is a class extending the {@code AbstractEntity}
	 *         class and has the {@code inlineResponseBody} flag set.
	 */
	delete(resource, id, parameters = {}, options = {}, parentEntity = null) {}
}
