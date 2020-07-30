import AbstractHalsonEntity from './AbstractHalsonEntity';
import HalsonConfigurator from './HalsonConfigurator';
import HalsonLinkGenerator from './HalsonLinkGenerator';
import HalsonResponsePostProcessor from './HalsonResponsePostProcessor';
import HalsonRestClient from './HalsonRestClient';
import embedName from './decorator/embedName';
import idParameterName from './decorator/idParameterName';
import inlineEmbeds from './decorator/inlineEmbeds';

const $registerImaPlugin = () => {};

export {
  $registerImaPlugin,
  AbstractHalsonEntity,
  HalsonConfigurator,
  HalsonLinkGenerator,
  HalsonResponsePostProcessor,
  HalsonRestClient,
  embedName,
  idParameterName,
  inlineEmbeds
};
