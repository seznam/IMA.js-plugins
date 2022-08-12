/**
 * Decorator for setting the static {@code inlineEmbeds} property of an entity
 * class, which specifies the names of the embedded resources that should be
 * inlined into the entity's fields.
 *
 * The embed names may contain prefixes separated by a colon ({@code :}) from
 * the resource name. The prefixes will not be included in the names of the
 * entity fields into which the embedded resources will be inlined.
 *
 * @param {...string} embedNames The names of the embedded resources that
 *        should be inlined into the entity's fields.
 * @returns {function(function(
 *             new: AbstractHalsonEntity,
 *             HalsonRestClient,
 *             Object<string, *>,
 *             ?AbstractHalsonEntity=
 *         ))} Callback that sets the list of names of embeds on the class
 *         provided to it.
 */
export default (...embedNames) => {
  return classConstructor => {
    Object.defineProperty(classConstructor, 'inlineEmbeds', {
      value: embedNames
    });
  };
};
