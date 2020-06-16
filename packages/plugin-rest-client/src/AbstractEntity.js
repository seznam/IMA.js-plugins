import AbstractDataFieldMapper from './AbstractDataFieldMapper';
import { deepFreeze } from './utils';

/**
 * Symbols for representing the private fields in the entity.
 *
 * @type {Object<string, Symbol>}
 */
const PRIVATE = {
  // static private fields
  resourceName: Symbol('resourceName'),
  resourceNameConfigured: Symbol('resourceNameConfigured'),
  idFieldName: Symbol('idFieldName'),
  idFieldNameConfigured: Symbol('idFieldNameConfigured'),
  inlineResponseBody: Symbol('inlineResponseBody'),
  inlineResponseBodyConfigured: Symbol('inlineResponseBodyConfigured'),
  propTypes: Symbol('propTypes'),
  propTypesConfigured: Symbol('propTypesConfigured'),
  dataFieldMapping: Symbol('dataFieldMapping'),
  dataFieldMappingConfigured: Symbol('dataFieldMappingConfigured'),
  isImmutable: Symbol('isImmutable'),
  isImmutableConfigured: Symbol('isImmutableConfigured'),

  // private fields
  restClient: Symbol('restClient'),
  parentEntity: Symbol('parentEntity')
};
if ($Debug) {
  Object.freeze(PRIVATE);
}

/**
 * The base class for typed REST API entities. Usage of typed entities may be
 * optional and is dependant on the specific implementation of the REST API
 * client.
 */
export default class AbstractEntity {
  /**
   * Initializes the entity.
   *
   * @param {Object<string, *>} data Entity data, which will be directly
   *        assigned to the entity's fields.
   * @param {?AbstractEntity=} parentEntity The entity within which the
   *        resource containing this entity is located. Can be set to
   *        {@code null} if this entity belongs to a top-level resource
   *        without a parent.
   */
  constructor(data, parentEntity = null) {
    /**
     * The entity within which the resource containing this entity is
     * located. Can be set to null if this entity belongs to a top-level
     * resource without a parent.
     *
     * @type {?AbstractEntity}
     */
    this[PRIVATE.parentEntity] = parentEntity;
    Object.defineProperty(this, PRIVATE.parentEntity, {
      enumerable: false
    });

    let entityData = this.$deserialize(data);
    Object.assign(this, entityData);

    if ($Debug) {
      this.$validatePropTypes();

      if (this.constructor.isImmutable) {
        deepFreeze(this);
      }
    }
  }

  /**
   * Returns the name of the REST API resource containing this entity. The
   * resource name does not have to match the URI path fragment in the REST
   * API identifying the resource, depending on the REST API client's
   * implementation.
   *
   * @return {string} The name of the REST API resource containing this
   *         entity.
   */
  static get resourceName() {
    if ($Debug) {
      if (!this[PRIVATE.resourceNameConfigured]) {
        throw new Error(
          'The resourceName getter is abstract and must be overridden'
        );
      }
    }

    return this[PRIVATE.resourceName];
  }

  /**
   * This setter is used for compatibility with the Public Class Fields ES
   * proposal (at stage 2 at the moment of writing this).
   *
   * See the related getter for more details about this property.
   *
   * @param {string} resourceName The name of the REST API resource
   *        containing this entity.
   */
  static set resourceName(resourceName) {
    if ($Debug) {
      if (this[PRIVATE.resourceNameConfigured]) {
        throw new TypeError('The resourceName property cannot be reconfigured');
      }
    }

    this[PRIVATE.resourceName] = resourceName;
    if ($Debug) {
      this[PRIVATE.resourceNameConfigured] = true;
    }
  }

  /**
   * Returns the name of the field of this entity that contains the entity's
   * primary key (ID).
   *
   * @return {string} The name of the field containing the entity's ID.
   */
  static get idFieldName() {
    if ($Debug) {
      if (!this[PRIVATE.idFieldNameConfigured]) {
        throw new Error(
          'The idFieldName getter is abstract and must be overridden'
        );
      }
    }

    return this[PRIVATE.idFieldName];
  }

  /**
   * This setter is used for compatibility with the Public Class Fields ES
   * proposal (at stage 2 at the moment of writing this).
   *
   * See the related getter for more details about this property.
   *
   * @param {string} idFieldName The name of the field containing the
   *        entity's ID.
   */
  static set idFieldName(idFieldName) {
    if ($Debug) {
      if (this[PRIVATE.idFieldNameConfigured]) {
        throw new TypeError('The idFieldName property cannot be reconfigured');
      }
    }

    this[PRIVATE.idFieldName] = idFieldName;
    if ($Debug) {
      this[PRIVATE.idFieldNameConfigured] = true;
    }
  }

  /**
   * The flag specifying whether the REST API client should return only the
   * response body (processed into entity/entities) instead of the complete
   * response object.
   *
   * This is useful if all useful information outside the response body has
   * been processed by response post-processors, or only the response body
   * contains any useful data.
   *
   * @return {boolean} The flag specifying whether the REST client should
   *         return only the response body instead of the response object.
   */
  static get inlineResponseBody() {
    if (!this[PRIVATE.inlineResponseBodyConfigured]) {
      return false;
    }

    return this[PRIVATE.inlineResponseBody];
  }

  /**
   * This setter is used for compatibility with the Public Class Fields ES
   * proposal (at stage 2 at the moment of writing this).
   *
   * See the related getter for more details about this property.
   *
   * @param {boolean} inlineResponseBody The flag specifying whether the REST
   *        client should return only the response body instead of the
   *        response object.
   */
  static set inlineResponseBody(inlineResponseBody) {
    if ($Debug) {
      if (this[PRIVATE.inlineResponseBodyConfigured]) {
        throw new TypeError(
          'The inlineResponseBody property cannot be reconfigured'
        );
      }
    }

    this[PRIVATE.inlineResponseBody] = inlineResponseBody;
    this[PRIVATE.inlineResponseBodyConfigured] = true;
  }

  /**
   * Returns the constrains that should be applied on the properties on the
   * data-holding properties of this entity.
   *
   * The keys of the returned object are the names of the data-holding
   * properties of this entity that should be validated, the values represent
   * the validation constraints (these are implementation-specific).
   *
   * The constraints will be evaluated after setting the properties on this
   * entity using the entity's constructor of standard manipulation methods.
   *
   * Note that this class does not provides no implementation of actual
   * validation of these constraints - this should be provided by a plugin
   * extending this one.
   *
   * @return {Object<string, *>} The validation constrains that should be
   *         applied to this entity's properties.
   */
  static get propTypes() {
    if (!this[PRIVATE.propTypesConfigured]) {
      return {};
    }

    return this[PRIVATE.propTypes];
  }

  /**
   * This setter is used for compatibility with the Public Class Fields ES
   * proposal (at stage 2 at the moment of writing this).
   *
   * See the related getter for more details about this property.
   *
   * @param {Object<string, *>} propTypes The validation constrains that
   *        should be applied to this entity's properties.
   */
  static set propTypes(propTypes) {
    if ($Debug) {
      if (this[PRIVATE.propTypesConfigured]) {
        throw new TypeError('The propTypes property cannot be reconfigured');
      }
    }

    this[PRIVATE.propTypes] = propTypes;
    if ($Debug) {
      this[PRIVATE.propTypesConfigured] = true;
    }
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
   * @return {Object<string, (
   *           string|
   *           function(new: AbstractDataFieldMapper)|
   *           {
   *             dataFieldName: ?string,
   *             deserialize: function(*, AbstractEntity): *,
   *             serialize: function(*, AbstractEntity): *
   *           }
   *         )>} The description of how the raw data properties should be
   *         mapped to the entity properties and vice versa.
   */
  static get dataFieldMapping() {
    if (!this[PRIVATE.dataFieldMappingConfigured]) {
      return {};
    }

    return this[PRIVATE.dataFieldMapping];
  }

  /**
   * This setter is used for compatibility with the Public Class Fields ES
   * proposal (at stage 2 at the moment of writing this).
   *
   * See the related getter for more details about this property.
   *
   * @param {Object<string, (
   *          string|
   *          function(new: AbstractDataFieldMapper)|
   *          {
   *            dataFieldName: ?string,
   *            deserialize: function(*, AbstractEntity): *,
   *            serialize: function(*, AbstractEntity): *
   *          }
   *        )>} dataFieldMapping The description of how the raw data
   *        properties should be mapped to the entity properties and vice
   *        versa.
   */
  static set dataFieldMapping(dataFieldMapping) {
    if ($Debug) {
      if (this[PRIVATE.dataFieldMappingConfigured]) {
        throw new TypeError(
          'The dataFieldMapping property cannot be reconfigured'
        );
      }
    }

    this[PRIVATE.dataFieldMapping] = dataFieldMapping;
    if ($Debug) {
      this[PRIVATE.dataFieldMappingConfigured] = true;
    }
  }

  /**
   * Flag specifying whether the instances of this entity class should be
   * made automatically immutable (the instance will be deeply frozen) upon
   * instantiation.
   *
   * Setting this flag also modifies behavior of methods that would otherwise
   * modify the state of the entity to just return a modified version (as
   * they already do) without modifying the instance these methods are
   * invoked on.
   *
   * Note that the deep freeze of the entity's state will be applied in the
   * {@linkcode AbstractEntity}'s constructor, therefore the constructors
   * of classes extending this one cannot make final adjustments of the
   * entity's state once a call to the {@code super}-constructor has been
   * made.
   *
   * Also note that any embedded entity will be skipped over, allowing each
   * entity class to have consistent mutability of its instances.
   *
   * @return {boolean} Whether the instances of this entity class should be
   *         made automatically immutable upon instantiation.
   */
  static get isImmutable() {
    if (!this[PRIVATE.isImmutableConfigured]) {
      return false;
    }

    return this[PRIVATE.isImmutable];
  }

  /**
   * This setter is used for compatibility with the Public Class Fields ES
   * proposal (at stage 2 at the moment of writing this).
   *
   * See the related getter for more details about this property.
   *
   * @param {boolean} isImmutable Whether the instances of this entity class
   *        should be made automatically immutable upon instantiation.
   */
  static set isImmutable(isImmutable) {
    if ($Debug) {
      if (this[PRIVATE.isImmutableConfigured]) {
        throw new TypeError('The isImmutable property cannot be reconfigured');
      }
    }

    this[PRIVATE.isImmutable] = isImmutable;
    if ($Debug) {
      this[PRIVATE.isImmutableConfigured] = true;
    }
  }

  /**
   * Creates a data field mapper for mapping the property of the specified
   * name in the raw data to an instance of this entity class. The entity
   * having its data mapped will also be set as the parent entity of the
   * generated entity.
   *
   * @param {?string} dataFieldName The name of the raw data field being
   *        mapped, or {@code null} if it is the same as the name of the
   *        entity property being mapped.
   * @return {function(new: AbstractDataFieldMapper)} The generated data
   *         field mapper.
   */
  static asDataFieldMapper(dataFieldName = null) {
    let entityClass = this;
    return AbstractDataFieldMapper.makeMapper(
      dataFieldName,
      (data, parentEntity) => new entityClass(data, parentEntity),
      entity => entity.$serialize()
    );
  }

  /**
   * Returns the direct parent entity of this entity. The parent entity
   * contains the REST resource from which this entity originates. The getter
   * returns {@code null} if this entity's resource is a top-level resource
   * without a parent.
   *
   * @return {?AbstractEntity} The direct parent entity of this entity.
   */
  get $parentEntity() {
    return this[PRIVATE.parentEntity];
  }

  /**
   * Creates a clone of this entity.
   *
   * @param {boolean=} includingParent The flag specifying whether the parent
   *        entity should be cloned as well. The parent entity will be only
   *        referenced when this flag is not set. Defaults to {@code false}.
   * @return {AbstractEntity} A clone of this entity.
   */
  clone(includingParent = false) {
    let data = this.$serialize();
    let entityClass = this.constructor;
    let parentEntity = this[PRIVATE.parentEntity];

    if (includingParent && parentEntity) {
      parentEntity = parentEntity.clone(includingParent);
    }

    return new entityClass(data, parentEntity);
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
   * @return {AbstractEntity} The created patched clone.
   */
  cloneAndPatch(statePatch) {
    let data = this.$serialize();
    let patchData = this.$serialize(statePatch);
    let patchedData = Object.assign({}, data, patchData);
    let entityClass = this.constructor;
    let parentEntity = this[PRIVATE.parentEntity];

    return new entityClass(patchedData, parentEntity);
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
   * @return {Object<string, *>} Data object representing this entity in a
   *         way that is compatible with the REST API.
   */
  $serialize(data = this) {
    let mappings = this.constructor.dataFieldMapping;

    let serializedData = {};
    for (let entityPropertyName of Object.keys(data)) {
      if (!Object.prototype.hasOwnProperty.call(mappings, entityPropertyName)) {
        serializedData[entityPropertyName] = data[entityPropertyName];
        continue;
      }
      let mapper = mappings[entityPropertyName];
      let value = data[entityPropertyName];
      if (mapper instanceof Object) {
        let serializedValue = mapper.serialize(value, this);
        let dataFieldName =
          mapper.dataFieldName === null
            ? entityPropertyName
            : mapper.dataFieldName;
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
   * @return {Object<string, *>} The data ready to be assigned to this
   *         entity.
   */
  $deserialize(data) {
    let mappings = this.constructor.dataFieldMapping;
    let mappedDataProperties = {};
    for (let entityPropertyName of Object.keys(mappings)) {
      let mapper = mappings[entityPropertyName];
      if (mapper instanceof Object) {
        let dataFieldName = mapper.dataFieldName;
        if (dataFieldName === null) {
          dataFieldName = entityPropertyName;
        }
        mappedDataProperties[dataFieldName] = entityPropertyName;
      } else {
        mappedDataProperties[mapper] = entityPropertyName;
      }
    }

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
   * Validates the currently set properties of this entity against the
   * constraints specified by the static {@linkcode propTypes} property.
   *
   * @throws {TypeError} Thrown if any of the entity's currently set
   *         properties do not comply with the current property validation
   *         constraints. The error should carry information about all
   *         invalid properties, not just the first one.
   */
  $validatePropTypes() {
    // override this method to enable property type validation
  }
}
