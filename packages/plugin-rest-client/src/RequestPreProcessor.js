
/**
 * The request pre-processor is a utility for pre-processing the REST API
 * request before it is passed to the HTTP agent.
 *
 * @interface
 */
export default class RequestPreProcessor {
	/**
	 * Pre-processes the provided REST API request to a form in which it should
	 * be passed to the HTTP agent, or the next pre-processor in the queue.
	 *
	 * The method mey also return a response object if there is no need to send
	 * the request to the REST API server; the response will be returned to the
	 * caller of the REST API client's methods.
	 *
	 * Note that the returned response will still pass all the response
	 * post-processors registered with the current REST API client.
	 *
	 * @param {Request} request The REST API request to pre-process before
	 *        passing it to the HTTP agent.
	 * @return {(Request|Response|Promise<Response>)} The request, as it should
	 *         be passed to the next request pre-processor, or the HTTP agent
	 *         itself if there are no remaining pre-processors left; or a
	 *         response (or promise that will resolve to a response) to return
	 *         to the caller of the REST API client's methods if there is no
	 *         need to make an actual HTTP request to the server.
	 */
	process(request) {}
}
