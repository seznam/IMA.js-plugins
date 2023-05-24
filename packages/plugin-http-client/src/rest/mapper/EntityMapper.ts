import { BaseMapper } from './BaseMapper';
import { BaseEntity, EntityConstructor } from '../BaseEntity';

export class EntityMapper extends BaseMapper {
  #EntityClass: EntityConstructor;

  constructor(entity: EntityConstructor) {
    super();

    this.#EntityClass = entity;
  }

  deserialize(data: any) {
    if (!data || typeof data === 'string' || data instanceof BaseEntity) {
      return data;
    }

    return Reflect.construct(this.#EntityClass, [data]);
  }

  serialize(entity: any) {
    if (!entity || !(entity instanceof BaseEntity)) {
      return entity;
    }

    return entity.serialize();
  }
}
