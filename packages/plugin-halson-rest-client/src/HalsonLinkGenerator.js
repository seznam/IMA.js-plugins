import { LinkGenerator } from '@ima/plugin-rest-client';
import uriTemplateParser from 'uri-template';

/**
 * Private field symbols.
 *
 * @type {Object<string, symbol>}
 */
const PRIVATE = Object.freeze({
  uriTemplates: Symbol('uriTemplates'),
});

/**
 * URI generator for the HAL+JSON REST API client.
 */
export default class HalsonLinkGenerator extends LinkGenerator {
  /**
   * Initializes the link generator.
   */
  constructor() {
    super();

    /**
     * Cache of parsed URI templates. The keys are the raw URI templates.
     *
     * @type {Map<string, {expand: function(Object<string, (number|string|(number|string)[])>): string}>}
     */
    this[PRIVATE.uriTemplates] = new Map();

    Object.freeze(this);
  }

  /**
   * @inheritdoc
   */
  createLink(parentEntity, resource, id, parameters, serverConfiguration) {
    let linkName = resource.resourceName;
    let idParameterName = resource.idParameterName;

    let links;
    if (parentEntity) {
      links = parentEntity._links;
    } else {
      links = serverConfiguration.links;
    }

    if (!links[linkName]) {
      throw new Error(
        'The link to the provided resource (' +
          `${resource} AKA ${linkName}) is not set. Fix the link ` +
          'provided by the server'
      );
    }

    let linkTemplate = links[linkName];
    if (linkTemplate.href) {
      linkTemplate = linkTemplate.href;
    }
    let linkParameters = parameters;
    if (id !== null) {
      linkParameters = Object.assign({}, parameters, {
        [idParameterName]: id,
      });
    }

    return this._processURITemplate(
      linkTemplate,
      linkParameters,
      serverConfiguration.apiRoot
    );
  }

  /**
   * Processes the provided URI template by replacing the placeholders with
   * the provided parameter values.
   *
   * @param {string} template URI template to process.
   * @param {Object<string, (number|string|(number|string)[])>} parameters
   *        Map of URI template's placeholder names to values.
   * @param {string} apiRoot The URI to the REST API root.
   * @returns {string} Generated URI.
   */
  _processURITemplate(template, parameters, apiRoot) {
    let parsedTemplate;
    if (this[PRIVATE.uriTemplates].has(template)) {
      parsedTemplate = this[PRIVATE.uriTemplates].get(template);
    } else {
      parsedTemplate = uriTemplateParser.parse(template);
      this[PRIVATE.uriTemplates].set(template, parsedTemplate);
    }

    let link = parsedTemplate.expand(parameters);

    if (link.substring(0, 1) === '/') {
      link = `${apiRoot}${link}`;
    }

    return link;
  }
}
