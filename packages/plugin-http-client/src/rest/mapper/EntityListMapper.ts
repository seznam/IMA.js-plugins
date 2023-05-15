import { EntityMapper } from './EntityMapper';
import { Mapper } from './Mapper';
import { AbstractEntity } from '../AbstractEntity';

export class EntityListMapper extends Mapper {
  #entityMapper: EntityMapper;

  constructor(entity: AbstractEntity) {
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
