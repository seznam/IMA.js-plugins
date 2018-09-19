
const PRIVATE = {
	dataFieldName: Symbol('dataFieldName'),
	dataFieldNameConfigured: Symbol('dataFieldNameConfigured')
};
if ($Debug) {
	Object.freeze(PRIVATE);
}

/**
 * A typed representation of a data field mapper for declarative mapping of raw
 * data to entity properties.
 */
export default class AbstractDataFieldMapper {
	/**
	 * Throws a {@code TypeError} because this class and classes extending this
	 * class are static.
	 *
	 * @throws {TypeError} Thrown because this class is static.
	 */
	constructor() {
		if ($Debug) {
			throw new TypeError(
				'The data field mapper classes are always static and ' +
				'therefore cannot be instantiated'
			);
		}
	}

	/**
	 * Returns the name of the property in the raw data that should be mapped
	 * to the entity property with which is this mapper associated.
	 *
	 * The property of the raw data of the same name as the target entity
	 * property will be used if this property returns {@code null}.
	 *
	 * @return {?string} The name of the property in the raw data that should
	 *         be mapped to the entity property with which is this mapper
	 *         associated.
	 */
	static get dataFieldName() {
		if ($Debug) {
			if (!this[PRIVATE.dataFieldNameConfigured]) {
				throw new Error(
					'The dataFieldName property is abstract and must be ' +
					'overridden'
				);
			}
		}

		return this[PRIVATE.dataFieldName];
	}

	/**
	 * This setter is used for compatibility with the Public Class Fields ES
	 * proposal (at stage 2 at the moment of writing this).
	 *
	 * See the related getter for more details about this property.
	 *
	 * @param {?string} dataFieldName The name of the raw data property to map
	 *        to an entity property using this mapper.
	 */
	static set dataFieldName(dataFieldName) {
		if ($Debug) {
			if (this[PRIVATE.dataFieldNameConfigured]) {
				throw new TypeError(
					'The dataFieldName property cannot be reconfigured'
				)
			}
		}

		this[PRIVATE.dataFieldName] = dataFieldName;
		if ($Debug) {
			this[PRIVATE.dataFieldNameConfigured] = true;
		}
	}

	/**
	 * Deserializes the provided raw value obtained from the REST API to
	 * format that is used in the entity's target property.
	 *
	 * @param {*} value The raw value to deserialize, as provided by the REST
	 *        API.
	 * @param {AbstractEntity} entity The entity of which's property value is
	 *        being deserialized.
	 * @return {*} The deserialized value that should be set to the entity's
	 *         property.
	 */
	static deserialize(value, entity) {
		throw new Error(
			'The deserialize method is abstract and must be overridden'
		)
	}

	/**
	 * Serializes the provided entity's property value to format that is safe
	 * to send to the REST API.
	 *
	 * @param {*} value The entity's property value.
	 * @param {AbstractEntity} entity The entity of which's property value is
	 *        being serialized.
	 * @return {*} The serialized value.
	 */
	static serialize(value, entity) {
		throw new Error(
			'The serialize method is abstract and must be overridden'
		)
	}

	/**
	 * Generates a new data field mapper using the provided data field name,
	 * serialization callback and deserialization callback.
	 *
	 * @param {?string} dataFieldName The name of the raw data field being
	 *        mapped, or {@code null} if it is the same as the name of the
	 *        entity property being mapped.
	 * @param {function(*, AbstractEntity): *} deserialize The callback to use
	 *        for deserialization of a raw value.
	 * @param {function(*, AbstractEntity): *} serialize The callback to use
	 *        for serializing the entity's property value.
	 * @return {function(new: AbstractDataFieldMapper)} The generated data
	 *         field mapper.
	 */
	static makeMapper(dataFieldName, deserialize, serialize) {
		return class DataFieldMapper extends AbstractDataFieldMapper {
			static get dataFieldName() {
				return dataFieldName;
			}

			static set dataFieldName(dataFieldName) {
				if ($Debug) {
					throw new TypeError(
						'The dataFieldName property of generated data field ' +
						'mappers cannot be reconfigured'
					);
				}
			}

			static deserialize(value, entity) {
				return deserialize(value, entity);
			}

			static serialize(value, entity) {
				return serialize(value, entity);
			}
		}
	}
}
