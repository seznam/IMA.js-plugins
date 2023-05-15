import { Mapper } from './Mapper';

export class DefaultToArray extends Mapper {
  deserialize(value: any) {
    return value || [];
  }
}
