import { Mapper } from './Mapper';
import { AbstractEntity } from '../AbstractEntity';

export class EntityMapper extends Mapper {
  #EntityClass: AbstractEntity;

  constructor(entity: AbstractEntity) {
    super();

    this.#EntityClass = entity;
  }

  deserialize(data: any) {
    if (!data || typeof data === 'string' || data instanceof AbstractEntity) {
      return data;
    }

    // @ts-ignore
    return Reflect.construct(this.#EntityClass, [data]);
  }

  serialize(entity: any) {
    if (!entity || !(entity instanceof AbstractEntity)) {
      return entity;
    }

    return entity.serialize();
  }
}
