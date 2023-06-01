import { BaseMapper } from './BaseMapper';

/**
 * DefaultToArray mapper defines for entity property default value as empty array.
 */
export class DefaultToArray extends BaseMapper {
  deserialize(value: any) {
    return value || [];
  }
}
