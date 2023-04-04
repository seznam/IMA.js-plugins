/**
 * The base class for typed REST API entities. Usage of typed entities may be
 * optional and is dependent on the specific implementation of the REST API
 * client.
 */
export default class AbstractEntity {
  /**
   * Initializes the entity.
   *
   * @param {Object<string, *>} data Entity data, which will be directly
   *        assigned to the entity's fields.
   */
  constructor(data) {
    const entityData = this.$deserialize(data);

    Object.assign(this, entityData);
  }

  /**
   * Returns the description of automatic mapping of the raw data exchanged
   * between the REST API and the REST API client, and the properties of this
   * entity.
   *
   * The keys of the returned object are the names of the properties of this
   * entity. The value associated with key is one of the following:
   *
   * - The name of the property in the raw data. This is useful when the
   *   property only needs to be renamed.
   *
   * - A property name and value mapping object, providing the name of the
   *   property in the raw data (for renaming), a callback for deserializing
   *   the value from raw data and a callback for serializing the entity's
   *   property value to raw data. The {@code dataFieldName} property may
   *   return {@code null} if the property does not need to be renamed.
   *
   * @returns {Object<string, (
   *           string|
   *           {
   *             dataFieldName: ?string,
   *             deserialize: function(*, AbstractEntity): *,
   *             serialize: function(*, AbstractEntity): *
   *           }
   *         )>} The description of how the raw data properties should be
   *         mapped to the entity properties and vice versa.
   */
  static get dataFieldMapping() {
    return {};
  }

  /**
   * Serializes this entity into a JSON-compatible plain JavaScript object
   * that has a structure that is compatible with the entity's REST API
   * resource.
   *
   * Note that this method may not receive a representation of the entity's
   * complete state if invoked by the {@linkcode patch()} method.
   *
   * The default implementation of this method implements a mapping based on
   * the {@linkcode dataFieldMapping} property's value.
   *
   * @param {AbstractEntity} data
   * @returns {Object<string, *>} Data object representing this entity in a
   *         way that is compatible with the REST API.
   */
  $serialize(data = this) {
    const mappings = this.constructor.dataFieldMapping;

    const serializedData = {};
    for (let entityPropertyName of Object.keys(data)) {
      if (!Object.prototype.hasOwnProperty.call(mappings, entityPropertyName)) {
        serializedData[entityPropertyName] = data[entityPropertyName];
        continue;
      }
      let mapper = mappings[entityPropertyName];
      let value = data[entityPropertyName];
      if (mapper instanceof Object) {
        let serializedValue = mapper.serialize(value, this);
        let dataFieldName = mapper?.dataFieldName || entityPropertyName;
        serializedData[dataFieldName] = serializedValue;
      } else {
        serializedData[mapper] = value;
      }
    }

    return serializedData;
  }

  /**
   * Pre-processes the provided data obtained from the REST API into a form
   * that can be assigned to this entity.
   *
   * This method can be used to format data, rename fields, generated
   * computed fields, etc.
   *
   * Note that this method may not receive a representation of the entity's
   * complete state in some cases.
   *
   * The default implementation of this method implements a mapping based on
   * the {@linkcode dataFieldMapping} property's value.
   *
   * @param {Object<string, *>} data The data retrieved from the REST API.
   * @returns {Object<string, *>} The data ready to be assigned to this
   *         entity.
   */
  $deserialize(data) {
    const mappings = this.constructor.dataFieldMapping;

    const mappedDataProperties = {};
    Object.entries(mappings).forEach(([propertyName, mapper]) => {
      if (mapper instanceof Object) {
        const dataFieldName = mapper.dataFieldName || propertyName;

        mappedDataProperties[dataFieldName] = propertyName;
      } else {
        mappedDataProperties[mapper] = propertyName;
      }
    });

    let deserializedData = {};
    for (let propertyName of Object.keys(data)) {
      if (
        !Object.prototype.hasOwnProperty.call(
          mappedDataProperties,
          propertyName
        )
      ) {
        deserializedData[propertyName] = data[propertyName];
        continue;
      }
      let entityPropertyName = mappedDataProperties[propertyName];
      let rawValue = data[propertyName];
      let mapper = mappings[entityPropertyName];
      if (mapper instanceof Object) {
        deserializedData[entityPropertyName] = mapper.deserialize(
          rawValue,
          this
        );
      } else {
        deserializedData[entityPropertyName] = rawValue;
      }
    }

    return deserializedData;
  }

  /**
   * Creates a clone of this entity with its state patched using the provided
   * state patch object.
   *
   * Note that this method is meant to be used primarily for creating
   * modified versions of immutable entities.
   *
   * @param {Object<string, *>} statePatch The patch of this entity's state
   *        that should be applied to the clone.
   * @returns {AbstractEntity} The created patched clone.
   */
  cloneAndPatch(statePatch) {
    let data = this.$serialize();
    let patchData = this.$serialize(statePatch);
    let patchedData = Object.assign({}, data, patchData);
    let entityClass = this.constructor;

    return new entityClass(patchedData);
  }
}
