
/**
 * Decorator for setting the static {@code dataFieldMapping} property of an
 * entity class, which specifies the automatic mapping of raw entity data to
 * entity properties.
 *
 * @param {Object<string, (
 *          string|
 *          function(new: AbstractDataFieldMapper)|
 *          {
 *            dataFieldName: ?string,
 *            deserialize: function(*, AbstractEntity): *,
 *            serialize: function(*, AbstractEntity): *
 *          }
 *        )>} dataFieldMapping The descriptor of how the entity data
 *        should be mapped to the entity's properties.
 * @return {function(function(
 *             new: AbstractEntity,
 *             RestClient,
 *             Object<string, *>,
 *             ?AbstractEntity=
 *         ))} Callback that sets the data field mapping on the provided entity
 *         class.
 */
export default (dataFieldMapping) => {
	return (classConstructor) => {
		Object.defineProperty(classConstructor, 'dataFieldMapping', {
			value: dataFieldMapping
		});
	};
};
