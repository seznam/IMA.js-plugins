import { BaseMapper } from './BaseMapper';
import { BaseEntity, EntityConstructor } from '../BaseEntity';

/**
 * EntityMapper transform object into entity property which is instance of BaseEntity.
 */
export class EntityMapper extends BaseMapper {
  #EntityClass: EntityConstructor;

  /**
   * Creates a mapper with the specified entity that is used for the transformation field.
   * @param entity
   */
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
