/**
 * Decorator for setting the static {@code idParameterName} property of an
 * entity class, which specifies the name of the ID parameter of an entity in
 * the entity's resource's links.
 *
 * @param {string} idParameterName The name of the link parameters used to
 *        specify the ID(s) of the entity(ies).
 * @return {function(function(
 *             new: AbstractHalsonEntity,
 *             HalsonRestClient,
 *             Object<string, *>,
 *             ?AbstractHalsonEntity=
 *         ))} Callback that sets the ID link parameter name on the class
 *         provided to it.
 */
export default idParameterName => {
  return classConstructor => {
    Object.defineProperty(classConstructor, 'idParameterName', {
      value: idParameterName
    });
  };
};
