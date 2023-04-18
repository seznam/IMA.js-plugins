export { default as AbstractResource } from './AbstractResource';
export { default as AbstractEntity } from './AbstractEntity';
export { default as Processor, Operation } from './processor/Processor';
export {
  default as RestClient,
  OPTION_TRANSFORM_PROCESSORS,
} from './RestClient';
export { dateMapper, dateMapperNullable } from './dataMapper/dateMapper';
export { default as defaultToArray } from './dataMapper/defaultToArray';
export { entityMapper, entityListMapper } from './dataMapper/entityMapper';
