// @ts-ignore
import { clone } from '@ima/helpers';

import { Mapper } from './mapper/Mapper';

export type MapperItem = {
  mapper: Mapper;
  newKey: string;
};

/**
 * The base class for typed REST API entities. Usage of typed entities may be
 * optional and is dependent on the specific implementation of the REST API
 * client.
 */
export class AbstractEntity {
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
  get dataFieldMapping(): {
    [key: string]: MapperItem | Mapper | string;
  } {
    return {};
  }

  /**
   * Initializes the entity.
   *
   * @param {Object<string, *>} data Entity data, which will be directly
   *        assigned to the entity's fields.
   */
  constructor(data: object) {
    const entityData = this.deserialize(data);

    Object.assign(this, entityData);
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
  serialize(data: any = this) {
    const mapping = this._getDataFieldMapping();

    const initialValue: { [key: string]: MapperItem } = {};
    const reverseMapping: {
      [key: string]: MapperItem;
    } = Object.entries(mapping).reduce((acc, [key, value]) => {
      acc[value.newKey] = Object.assign({}, value, { newKey: key });

      return acc;
    }, initialValue);

    const serializedData: { [key: string]: any } = {};
    Object.entries(data).forEach(([key, value]) => {
      let newValue = value;
      let newKey = key;
      if (reverseMapping[key]) {
        const mapperItem = reverseMapping[key];
        newKey = mapperItem.newKey;
        newValue = mapperItem.mapper.serialize(value);
      }

      serializedData[newKey] = newValue;
    });

    return serializedData;
  }

  _getDataFieldMapping(): {
    [key: string]: MapperItem;
  } {
    const dataFieldMapping = this.dataFieldMapping;

    const processedDataFieldMapping: { [key: string]: MapperItem } = {};
    Object.entries(dataFieldMapping).forEach(([key, value]) => {
      let mapperItem: MapperItem;

      if (value instanceof Mapper) {
        mapperItem = { mapper: value, newKey: key };
      } else if (typeof value === 'string') {
        mapperItem = { mapper: new Mapper(), newKey: value };
      } else {
        mapperItem = value;
      }

      processedDataFieldMapping[key] = mapperItem;
    });

    return processedDataFieldMapping;
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
  deserialize(data: object) {
    const mapping = this._getDataFieldMapping();

    const deserializedData: { [key: string]: any } = {};
    Object.entries(data).forEach(([key, value]) => {
      let newValue = value;
      let newKey = key;
      if (mapping[key]) {
        const mapperItem = mapping[key];
        newKey = mapperItem.newKey;
        newValue = mapperItem.mapper.deserialize(value);
      }

      deserializedData[newKey] = newValue;
    });

    return deserializedData;
  }

  /**
   * Creates a clone of this entity.
   *
   * @returns {AbstractEntity} A clone of this entity.
   */
  clone() {
    const data = clone(this.serialize());

    return Reflect.construct(this.constructor, [data]);
  }

  /**
   * Creates a clone of this entity with its state patched using the provided
   * state patch object.
   *
   *
   * @param {Object<string, *> | AbstractEntity} statePatch The patch of this entity's state
   *        that should be applied to the clone.
   * @returns {AbstractEntity} The created patched clone.
   */
  cloneAndPatch(statePatch: any) {
    const data = this.serialize();
    const patchData =
      statePatch instanceof this.constructor
        ? this.serialize(statePatch)
        : statePatch;
    const mergedData = clone({ ...data, ...patchData });

    return Reflect.construct(this.constructor, [mergedData]);
  }
}
