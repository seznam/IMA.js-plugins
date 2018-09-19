
/**
 * Decorator for setting the static {@code propTypes} property of an  entity
 * class, which specifies the types of the entity's data-holding properties.
 *
 * @param {Object<string, *>} propTypes The descriptor of types of the entity's
 *        data-holding properties.
 * @return {function(function(
 *             new: AbstractEntity,
 *             RestClient,
 *             Object<string, *>,
 *             ?AbstractEntity=
 *         ))} Callback that sets the descriptor of the types of the entity's
 *         data-holding properties.
 */
export default (propTypes) => {
	return (classConstructor) => {
		Object.defineProperty(classConstructor, 'propTypes', {
			value: propTypes
		});
	};
};
