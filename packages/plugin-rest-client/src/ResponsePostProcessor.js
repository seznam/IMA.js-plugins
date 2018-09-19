
/**
 * The response post-processor is a utility for post-processing the REST API
 * response before it is returned to the caller of the REST API client's
 * methods.
 *
 * @interface
 */
export default class ResponsePostProcessor {
	/**
	 * Post-processes the provided REST API response to a form in which is
	 * should be passed to the caller of the REST API client's methods, or the
	 * next post-processor in the queue.
	 *
	 * @param {Response} response The REST API response to post-process before
	 *        returning it to the caller of the REST API client's methods.
	 * @return {Response} The response as it should be passed to the caller of
	 *         the REST API client's methods.
	 */
	process(response) {}
}
