
/**
 * Utility for configuring the REST client using the configuration provided by
 * the server.
 *
 * @interface
 */
export default class Configurator {
	/**
	 * Retrieves the REST API client configuration provided by the server.
	 *
	 * @return {Promise<Object<string, *>>} A promise that will resolve to the
	 *         client configuration provided by the server.
	 */
	getConfiguration() {}
}
