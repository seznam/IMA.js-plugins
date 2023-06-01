import { BaseEntity } from '../BaseEntity';
import { BaseMapper } from '../mapper/BaseMapper';

describe('BaseEntity', () => {
  class TransformingEntity extends BaseEntity {
    serialize(data = this) {
      let serialized = super.serialize(data);
      serialized.serialized = true;
      delete serialized.dynamic;
      delete serialized.onlyDynamic;
      return serialized;
    }

    deserialize(data) {
      let clone = Object.assign({}, data);
      clone.dynamic = true;
      delete clone.serialized;
      return clone;
    }
  }

  it('should assign data to its instance', () => {
    let template = new BaseEntity({});
    template.id = 12;
    template.test = true;
    expect(
      new BaseEntity({
        id: 12,
        test: true,
      })
    ).toEqual(template);
  });

  it('should deserialize entity data upon creation', () => {
    let entity = new TransformingEntity({
      test: 'tested',
      serialized: true,
    });
    expect(Object.assign({}, entity)).toEqual({
      test: 'tested',
      dynamic: true,
    });
  });

  it('should allow declarative property mapping', () => {
    class DeclarativelyMappedEntity extends BaseEntity {
      get dataFieldMapping() {
        return {
          some_field: 'someField',
          another: 'another',
        };
      }
    }

    let entity = new DeclarativelyMappedEntity({
      id: 1, // not mapped
      some_field: 'and here is the value',
      another: 'that is not renamed',
    });
    let entityProperties = Object.assign({}, entity);
    expect(entityProperties).toEqual({
      id: 1,
      someField: 'and here is the value',
      another: 'that is not renamed',
    });

    expect(entity.serialize()).toEqual({
      id: 1,
      some_field: 'and here is the value',
      another: 'that is not renamed',
    });
  });

  it('should allow declarative property mapping using mapper object', () => {
    class NegativMapper extends BaseMapper {
      serialize(value) {
        return -value;
      }
      deserialize(value) {
        return -value;
      }
    }
    class MappingEntity extends BaseEntity {
      get dataFieldMapping() {
        return {
          _id: {
            newKey: 'id',
            mapper: new BaseMapper(),
          },
          foo: new BaseMapper(),
          bar: {
            newKey: 'barbar',
            mapper: new NegativMapper(),
          },
          baz: new NegativMapper(),
        };
      }
    }

    let entity = new MappingEntity({
      _id: 123,
      foo: 'a',
      bar: 125,
      baz: 5,
    });
    expect(Object.assign({}, entity)).toEqual({
      id: 123,
      foo: 'a',
      barbar: -125,
      baz: -5,
    });
    expect(entity.serialize()).toEqual({
      _id: 123,
      foo: 'a',
      bar: 125,
      baz: 5,
    });
  });

  it('should be able to clone an entity', () => {
    let entity = new BaseEntity({
      id: 1,
      text: 'is a text',
      created: new Date(),
      regexp: /a/,
    });

    let clone = entity.clone();
    expect(clone).not.toBe(entity);
    expect(clone).toEqual(entity);
    expect(clone.clone()).not.toBe(clone);
  });

  it('should enable creating modified clones of the entity', () => {
    let entity = new BaseEntity({
      id: 1,
      foo: 'bar',
    });
    let patchedEntity = entity.cloneAndPatch({
      id: 2,
      baz: '000',
    });
    expect(patchedEntity.serialize()).toEqual({
      id: 2,
      foo: 'bar',
      baz: '000',
    });
  });
});
