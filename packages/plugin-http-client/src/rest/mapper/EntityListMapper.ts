import { BaseMapper } from './BaseMapper';
import { EntityMapper } from './EntityMapper';
import type { EntityConstructor } from '../BaseEntity';

/**
 * EntityListMapper transform array of object into entity property with array of entities.
 */
export class EntityListMapper extends BaseMapper {
  #entityMapper: EntityMapper;

  /**
   * Creates a mapper with the specified entity that is used for the transformation of a field containing array of objects.
   * @param entity
   */
  constructor(entity: EntityConstructor) {
    super();

    this.#entityMapper = new EntityMapper(entity);
  }

  deserialize(data: any) {
    if (!data || !Array.isArray(data)) {
      return data;
    }

    return data.map(entity => this.#entityMapper.deserialize(entity));
  }

  serialize(data: any) {
    if (!data || !Array.isArray(data)) {
      return data;
    }

    return data.map(item => this.#entityMapper.serialize(item));
  }
}
