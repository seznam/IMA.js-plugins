import { BaseMapper } from './BaseMapper';

export class DefaultToArray extends BaseMapper {
  deserialize(value: any) {
    return value || [];
  }
}
