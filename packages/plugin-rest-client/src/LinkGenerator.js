
/**
 * Generator of HTTP(S) URLs to use for accessing or manipulating the resources
 * within the accessed REST API.
 *
 * @interface
 */
export default class LinkGenerator {
	/**
	 * Generates the URL to use for accessing or manipulating the specified
	 * resource.
	 *
	 * @param {*} parentEntity The parent entity within which the specified
	 *        resource will be manipulated. It may be needed to determine the
	 *        parent resource from the entity. Use {@code null} if the
	 *        specified resource is a top-level resource within the REST API.
	 * @param {*} resource The identifier of the REST resource.
	 * @param {?(number|string|(number|string)[])} id Unique ID(s) of a single
	 *        entity or a group of entities to access within the specified
	 *        resource, or {@code null} if the resource itself should be
	 *        accessed.
	 * @param {Object<string, (number|string|(number|string)[])>} parameters
	 *        Additional parameters to use to generate the access URL.
	 * @param {?Object<string, *>} serverConfiguration Configuration of the
	 *        REST client as provided by the server, or {@code null} if no
	 *        server-provided configuration is being used with the current REST
	 *        client.
	 * @return {string} The generated URL for accessing the specified resource.
	 */
	createLink(parentEntity, resource, id, parameters, serverConfiguration) {}

	/**
	 * Encodes the provided parameters as a
	 * {@code application/x-www-form-urlencoded} query string. The query string
	 * will not be prefixed by a question mark ({@code ?}).
	 *
	 * @param {Object<string, (number|string)>} parameters The query parameters
	 *        to encode.
	 * @param {string=} separator Separator of the key-value pairs.
	 * @param {string=} valueSeparator Separator of keys and values.
	 * @param {function((number|string)): string=} encoder The key and value
	 *        encoding function.
	 * @return {string} The encoded parameters.
	 */
	static encodeQuery(parameters, separator = '&', valueSeparator = '=',
			encoder = encodeURIComponent) {
		let pairs = [];
		let keys = Object.keys(parameters);
		let count = keys.length;
		for (let i = 0; i < count; i++) {
			let key = keys[i];
			let value = parameters[key];
			pairs.push(`${encoder(key)}${valueSeparator}${encoder(value)}`);
		}
		return pairs.join(separator);
	}
}
