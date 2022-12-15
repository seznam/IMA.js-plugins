import { AbstractEntity } from '@ima/plugin-rest-client';

/**
 * Private field symbols.
 *
 * @type {Object<string, symbol>}
 */
const PRIVATE = Object.freeze({
  embedName: Symbol('embedName'),
  embedNameConfigured: Symbol('embedNameConfigured'),
  idParameterName: Symbol('idParameterName'),
  idParameterNameConfigured: Symbol('idParameterNameConfigured'),
  inlineEmbeds: Symbol('inlineEmbeds'),
  inlineEmbedsConfigured: Symbol('inlineEmbedsConfigured'),
});

/**
 * The base class for typed REST API HALSON entities. The resources in the REST
 * API will be identified by classes extending this one by the HALSON REST API
 * client.
 */
export default class AbstractHalsonEntity extends AbstractEntity {
  /**
   * Initializes the entity using the provided data.
   *
   * @param {Object<string, *>} data Entity data, which will be directly
   *        assigned to the entity's fields.
   * @param {?AbstractHalsonEntity=} parentEntity The entity within which the
   *        resource containing this entity is located. Can be set to
   *        {@code null} if this entity belongs to a top-level resource
   *        without a parent.
   */
  constructor(data, parentEntity = null) {
    super(data, parentEntity);

    if (!this._links) {
      this._links = {};
    }
    Object.defineProperty(this, '_links', {
      enumerable: false,
    });
  }

  /**
   * Returns the name of the embed within which the entities will most likely
   * be embedded when listing the entities from their resource.
   *
   * @returns {string} The name of the embed within which the entities will
   *         most likely be embedded when listing the entities from their
   *         resource.
   */
  static get embedName() {
    if (this[PRIVATE.embedNameConfigured]) {
      return this[PRIVATE.embedName];
    }

    throw new Error('The embedName getter is abstract and must be overridden');
  }

  /**
   * Configures the name of the embed within which the entities will most
   * likely be embedded when listing the entities from their resource.
   *
   * This setter is used mainly for compatibility with the Public Class
   * Fields ES proposal.
   *
   * @param {string} embedName The name the embed within which the entities
   *        will most likely be embedded when listing the entities from their
   *        resource.
   */
  static set embedName(embedName) {
    this[PRIVATE.embedName] = embedName;
    this[PRIVATE.embedNameConfigured] = true;
  }

  /**
   * Returns the name of the ID parameter used in this entity's resource to
   * identify individual entities.
   *
   * @returns {string} The name of the ID parameter used in this entity's
   *         resource to identify individual entities.
   */
  static get idParameterName() {
    if (this[PRIVATE.idParameterNameConfigured]) {
      return this[PRIVATE.idParameterName];
    }

    throw new Error(
      'The idParameterName getter is abstract and must be overridden'
    );
  }

  /**
   * Configures the name of the ID parameter used in this entity's resource
   * to identify individual entities.
   *
   * This setter is used mainly for compatibility with the Public Class
   * Fields ES proposal.
   *
   * @param {string} idParameterName The name of the ID parameter used in
   *        this entity's resource to identify individual entities.
   */
  static set idParameterName(idParameterName) {
    this[PRIVATE.idParameterName] = idParameterName;
    this[PRIVATE.idParameterNameConfigured] = true;
  }

  /**
   * Returns the names of the embedded resources that should be inlined into
   * the entity's fields.
   *
   * The embed names may contain prefixes separated by a colon ({@code :})
   * from the resource name. The prefixes will not be included in the names
   * of the entity fields into which the embedded resources will be inlined.
   *
   * @returns {?string[]} The names of the embedded resources that should be
   *         inlined into the entity's fields.
   */
  static get inlineEmbeds() {
    if (this[PRIVATE.inlineEmbedsConfigured]) {
      return this[PRIVATE.inlineEmbeds];
    }

    return null;
  }

  /**
   * Configures the names of the embedded resources that should be inlined
   * into the entity's fields.
   *
   * This setter is used mainly for compatibility with the Public Class
   * Fields ES proposal.
   *
   * @param {?string[]} inlineEmbeds The names of the embedded resources that
   *        should be inlined into the entity's fields.
   */
  static set inlineEmbeds(inlineEmbeds) {
    this[PRIVATE.inlineEmbeds] = inlineEmbeds;
    this[PRIVATE.inlineEmbedsConfigured] = true;
  }
}
