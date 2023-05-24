import { BaseMapper } from './BaseMapper';
import { EntityMapper } from './EntityMapper';
import { Entity } from '../BaseEntity';

export class EntityListMapper extends BaseMapper {
  #entityMapper: EntityMapper;

  constructor(entity: Entity) {
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
