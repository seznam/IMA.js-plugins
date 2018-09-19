
/**
 * Decorator for setting the static {@code idFieldName} property of an entity
 * class, which specifies the name of the field that contains the entity's
 * primary key (ID).
 *
 * @param {string} idParameterName The name of the field containing the
 *        entity's ID.
 * @return {function(function(
 *             new: AbstractEntity,
 *             RestClient,
 *             Object<string, *>,
 *             ?AbstractEntity=
 *         ))} Callback that sets the name of the field containing the entity's
 *         ID.
 */
export default (idParameterName) => {
	return (classConstructor) => {
		Object.defineProperty(classConstructor, 'idFieldName', {
			value: idParameterName
		});
	};
};
