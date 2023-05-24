import { BaseMapper } from './BaseMapper';
import { BaseEntity, Entity } from '../BaseEntity';

export class EntityMapper extends BaseMapper {
  #EntityClass: Entity;

  constructor(entity: Entity) {
    super();

    this.#EntityClass = entity;
  }

  deserialize(data: any) {
    if (!data || typeof data === 'string' || data instanceof BaseEntity) {
      return data;
    }

    // @ts-ignore
    return Reflect.construct(this.#EntityClass, [data]);
  }

  serialize(entity: any) {
    if (!entity || !(entity instanceof BaseEntity)) {
      return entity;
    }

    return entity.serialize();
  }
}
