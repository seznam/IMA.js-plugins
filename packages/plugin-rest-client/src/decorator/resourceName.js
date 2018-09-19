
/**
 * Decorator for setting the static {@code resourceName} property of an entity
 * class, which specifies the name of the REST API resource to use with the
 * provided entity class.
 *
 * @param {string} resourceName The name of the REST API resource.
 * @return {function(function(
 *             new: AbstractEntity,
 *             RestClient,
 *             Object<string, *>,
 *             ?AbstractEntity=,
 *         ))} Callback that sets the resource name on the class provided to
 *         it.
 */
export default (resourceName) => {
	return (classConstructor) => {
		Object.defineProperty(classConstructor, 'resourceName', {
			value: resourceName
		});
	};
};
