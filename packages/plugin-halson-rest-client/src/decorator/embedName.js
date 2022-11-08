/**
 * Decorator for setting the static {@code embedName} property of an entity
 * class, which specifies the name of the embed that contains the entities
 * when listing the resource.
 *
 * @param {string} embedName The name of the embed that contains the entities
 *        when listing the resource.
 * @returns {function(function(
 *             new: AbstractHalsonEntity,
 *             HalsonRestClient,
 *             Object<string, *>,
 *             ?AbstractHalsonEntity=
 *         ))} Callback that sets the list of name of embed that contains the
 *         entities when listing the resource represented by the provided
 *         class.
 */
export default embedName => {
  return classConstructor => {
    Object.defineProperty(classConstructor, 'embedName', {
      value: embedName,
    });
  };
};
