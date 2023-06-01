import { clone } from '@ima/helpers';

import { BaseMapper, DataFieldValue, MapperItem } from './mapper/BaseMapper';

export interface EntityConstructor {
  new (data: object): Entity;
}

export interface Entity {
  serialize(data: object): any;
  deserialize(data: object): any;
}

/**
 * The base class for typed REST API entities. Usage of typed entities may be
 * optional and is dependent on the specific implementation of the REST API
 * client.
 */
export class BaseEntity {
  /**
   * Returns the description of automatic mapping of the raw data exchanged
   * between the REST API, and the properties of this
   * entity.
   *
   * The keys of the returned object are the names of the API properties.
   *
   * The value associated with key is one of the following:
   *
   * - The new name of the property in this entity. This is useful when the
   *   property only needs to be renamed.
   *
   * - The mapper instance of BaseMapper. This is useful when the property only needs to changed format but not renamed.
   *
   * - The MapperItem object eg.: { mapper: new EntityListMapper(BaseEntity), newKey: 'authors' }.
   *  This is useful when the property needs changed format and renamed too.
   *
   * @returns {Object<string, (
   *          string |
   *          Mappper |
   *           {
   *             newKey: string,
   *             mapper: instance of BaseMapper,
   *           }
   *         )>} The description of how the raw data properties should be
   *         mapped to the entity properties and vice versa.
   */
  get dataFieldMapping(): {
    [key: string]: DataFieldValue;
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
   * complete state if invoked by the {@linkcode cloneAndPatch()} method.
   *
   * The default implementation of this method implements a mapping based on
   * the {@linkcode dataFieldMapping} property's value.
   *
   * @param {BaseEntity} data
   * @returns {Object<string, *>} Data object representing this entity in a
   *         way that is compatible with the REST API.
   */
  serialize(data: any = this): any {
    const mapping = this.#getDataFieldMapping();

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

  /**
   * Transform dataFieldMapping result to MapperItems.
   *
   * @returns {Object<string, (
   *           {
   *             newKey: string,
   *             mapper: instance of BaseMapper,
   *           }
   *         )>}
   */
  #getDataFieldMapping(): {
    [key: string]: MapperItem;
  } {
    const dataFieldMapping = this.dataFieldMapping;

    const processedDataFieldMapping: { [key: string]: MapperItem } = {};
    Object.entries(dataFieldMapping).forEach(([key, value]) => {
      processedDataFieldMapping[key] = BaseMapper.createMapperItem(value, key);
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
  deserialize(data: object): any {
    const mapping = this.#getDataFieldMapping();

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
   * @returns {BaseEntity} A clone of this entity.
   */
  clone() {
    const data = clone(this.serialize());

    return Reflect.construct(this.constructor, [data]);
  }

  /**
   * Creates a clone of this entity with its state patched using the provided
   * state patch object.
   *
   * @param {Object<string, *> | BaseEntity} statePatch The patch of this entity's state
   *        that should be applied to the clone.
   * @returns {BaseEntity} The created patched clone.
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