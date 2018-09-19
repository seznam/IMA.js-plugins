
/**
 * Decorator for settings the static {@code isImmutable} flag on an entity
 * class, which makes all entities of that type immutable.
 *
 * @param {function(
 *            new: AbstractEntity,
 *            RestClient,
 *            Object<string, *>,
 *            ?AbstractEntity=
 *        )} classConstructor The entity class.
 */
export default (classConstructor) => {
	Object.defineProperty(classConstructor, 'isImmutable', {
		value: true
	});
};
