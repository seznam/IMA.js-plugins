
/**
 * Constants representing the upper-case names of supported HTTP methods.
 */
const HttpMethod = {
	/**
	 * The GET HTTP method.
	 *
	 * @type {string}
	 */
	GET: 'GET',

	/**
	 * The POST HTTP method.
	 *
	 * @type {string}
	 */
	POST: 'POST',

	/**
	 * The PATCH HTTP method.
	 *
	 * @type {string}
	 */
	PATCH: 'PATCH',

	/**
	 * The PUT HTTP method.
	 *
	 * @type {string}
	 */
	PUT: 'PUT',

	/**
	 * The DELETE HTTP method.
	 *
	 * @type {string}
	 */
	DELETE: 'DELETE'
};

if ($Debug) {
	Object.freeze(HttpMethod);
}

export default HttpMethod;
