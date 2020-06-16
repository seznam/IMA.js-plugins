import AbstractDataFieldMapper from '../AbstractDataFieldMapper';
import AbstractEntity from '../AbstractEntity';
import { testStaticProperty } from './RestClientTestUtils';

describe('AbstractEntity', () => {
  class Entity extends AbstractEntity {
    static get resourceName() {
      return 'foo';
    }

    static get idFieldName() {
      return 'id';
    }

    static get inlineResponseBody() {
      return true;
    }
  }

  it('should support a parent entity', () => {
    let parentEntity = new Entity({ id: 1 });
    let entity = new Entity({ id: 2 }, parentEntity);

    expect(entity.$parentEntity).toBe(parentEntity);
  });

  it('should assign data to its instance', () => {
    let template = new Entity({});
    template.id = 12;
    template.test = true;
    expect(
      new Entity({
        id: 12,
        test: true
      })
    ).toEqual(template);
  });

  it('should keep reference to its parent entity', () => {
    expect(
      new Entity(
        {},
        new Entity({
          id: 'yup'
        })
      ).$parentEntity
    ).toEqual(
      new Entity({
        id: 'yup'
      })
    );
  });

  describe('serialization', () => {
    // eslint-disable-next-line no-unused-vars
    let serializeCalled = false;

    class TransformingEntity extends Entity {
      $serialize(data = this) {
        serializeCalled = true;
        let serialized = super.$serialize(data);
        serialized.serialized = true;
        delete serialized.dynamic;
        delete serialized.onlyDynamic;
        return serialized;
      }

      $deserialize(data) {
        let clone = Object.assign({}, data);
        clone.dynamic = true;
        delete clone.serialized;
        return clone;
      }
    }

    beforeEach(() => {
      serializeCalled = false;
    });

    it('should deserialize entity data upon creation', () => {
      let entity = new TransformingEntity({
        test: 'tested',
        serialized: true
      });
      expect(Object.assign({}, entity)).toEqual({
        test: 'tested',
        dynamic: true
      });
    });

    it('should allow declarative property mapping', () => {
      class DeclarativelyMappedEntity extends Entity {
        static get dataFieldMapping() {
          return {
            someField: 'some_field',
            another: 'another'
          };
        }
      }

      let entity = new DeclarativelyMappedEntity({
        id: 1, // not mapped
        some_field: 'and here is the value',
        another: 'that is not renamed'
      });
      let entityProperties = Object.assign({}, entity);
      expect(entityProperties).toEqual({
        id: 1,
        someField: 'and here is the value',
        another: 'that is not renamed'
      });

      expect(entity.$serialize()).toEqual({
        id: 1,
        some_field: 'and here is the value',
        another: 'that is not renamed'
      });
    });

    it('should allow declarative property mapping using mapper object', () => {
      class MappingEntity extends Entity {
        static get dataFieldMapping() {
          return {
            id: {
              dataFieldName: '_id',
              serialize(value, processedEntity) {
                expect(processedEntity instanceof MappingEntity).toBe(true);
                return -value;
              },
              deserialize(value, processedEntity) {
                expect(processedEntity instanceof MappingEntity).toBe(true);
                return -value;
              }
            },
            foo: {
              dataFieldName: null,
              serialize(value) {
                return value;
              },
              deserialize(value) {
                return value;
              }
            },
            bar: {
              dataFieldName: 'bar',
              serialize(value) {
                return value;
              },
              deserialize(value) {
                return value;
              }
            }
          };
        }
      }

      let entity = new MappingEntity({
        _id: 123,
        foo: 'a',
        bar: 'b'
      });
      expect(Object.assign({}, entity)).toEqual({
        id: -123,
        foo: 'a',
        bar: 'b'
      });
      expect(entity.$serialize()).toEqual({
        _id: 123,
        foo: 'a',
        bar: 'b'
      });
    });

    it('should allow declarative property mapping using mapper classes', () => {
      class MappingEntity extends Entity {
        static get dataFieldMapping() {
          return {
            id: AbstractDataFieldMapper.makeMapper(
              '_id',
              (value, processedEntity) => {
                expect(processedEntity instanceof MappingEntity).toBe(true);
                return -value;
              },
              (value, processedEntity) => {
                expect(processedEntity instanceof MappingEntity).toBe(true);
                return -value;
              }
            ),
            foo: AbstractDataFieldMapper.makeMapper(
              null,
              value => value,
              value => value
            ),
            bar: AbstractDataFieldMapper.makeMapper(
              'bar',
              value => value,
              value => value
            )
          };
        }
      }

      let entity = new MappingEntity({
        _id: 123,
        foo: 'a',
        bar: 'b'
      });
      expect(Object.assign({}, entity)).toEqual({
        id: -123,
        foo: 'a',
        bar: 'b'
      });
      expect(entity.$serialize()).toEqual({
        _id: 123,
        foo: 'a',
        bar: 'b'
      });
    });

    it('should allow create field mappers from entity classes', () => {
      class Session extends Entity {}

      class User extends Entity {
        static get dataFieldMapping() {
          return {
            session: Session.asDataFieldMapper('_session'),
            otherSession: Session.asDataFieldMapper('otherSession'),
            anotherSession: Session.asDataFieldMapper()
          };
        }
      }

      let entity = new User({
        id: 1,
        _session: { id: 'ABC' },
        otherSession: { id: 'DEF' },
        anotherSession: { id: 'GHI' }
      });
      let templateEntity = new User({});
      templateEntity.id = 1;
      templateEntity.session = new Session({ id: 'ABC' });
      templateEntity.otherSession = new Session({
        id: 'DEF'
      });
      templateEntity.anotherSession = new Session({
        id: 'GHI'
      });
      expect(entity).toMatchObject(templateEntity);
      expect(entity.session.$parentEntity).toBe(entity);
      expect(entity.otherSession.$parentEntity).toBe(entity);
      expect(entity.anotherSession.$parentEntity).toBe(entity);

      expect(templateEntity.$serialize()).toEqual({
        id: 1,
        _session: { id: 'ABC' },
        otherSession: { id: 'DEF' },
        anotherSession: { id: 'GHI' }
      });
    });
  });

  describe('immutability', () => {
    class ImmutableEntity extends AbstractEntity {
      static get isImmutable() {
        return true;
      }
    }

    it('should be mutable by default', () => {
      class Entity extends AbstractEntity {}

      let entity = new Entity({ id: 1 });
      entity.id = 2;
      entity.foo = 'bar';
      Object.defineProperty(entity, 'id', {
        enumerable: false
      });
    });

    it('should be deeply immutable if marked as such', () => {
      let entity = new ImmutableEntity({
        id: 1,
        foo: {
          bar: {
            baz: 2
          }
        }
      });
      expect(Object.isFrozen(entity)).toBe(true);
      expect(Object.isFrozen(entity.foo)).toBe(true);
      expect(Object.isFrozen(entity.foo.bar)).toBe(true);
    });

    it('should be able to clone an entity', () => {
      let entity = new ImmutableEntity(
        {
          id: 1,
          text: 'is a text',
          created: new Date(),
          regexp: /a/
        },
        new ImmutableEntity(
          {
            id: 'xy',
            isParent: true
          },
          new ImmutableEntity({
            id: 'grand-parent',
            isGrandParent: true
          })
        )
      );

      let clone = entity.clone();
      expect(clone).not.toBe(entity);
      expect(clone).toEqual(entity);
      expect(clone.$parentEntity).toBe(entity.$parentEntity);
      expect(clone.clone()).not.toBe(clone);

      let deepClone = entity.clone(true);
      expect(deepClone).not.toBe(entity);
      expect(deepClone).not.toBe(clone);
      expect(deepClone).toEqual(entity);
      expect(deepClone.$parentEntity).not.toBe(entity.$parentEntity);
      expect(deepClone.$parentEntity.$parentEntity).not.toBe(
        entity.$parentEntity.$parentEntity
      );
    });

    it('should enable creating modified clones of the entity', () => {
      let entity = new ImmutableEntity({
        id: 1,
        foo: 'bar'
      });
      let patchedEntity = entity.cloneAndPatch({
        id: 2,
        baz: '000'
      });
      expect(patchedEntity.$serialize()).toEqual({
        id: 2,
        foo: 'bar',
        baz: '000'
      });
    });
  });

  describe('static properties', () => {
    it('should be possible to configure resourceName exactly once', () => {
      testStaticProperty(AbstractEntity, 'resourceName', null, true, 'fooBar');
    });

    it('should be possible to configure idFieldName exactly once', () => {
      testStaticProperty(AbstractEntity, 'idFieldName', null, true, 'id');
    });

    it('should be possible to configure inlineResponseBody exactly once', () => {
      testStaticProperty(
        AbstractEntity,
        'inlineResponseBody',
        false,
        false,
        true
      );
    });

    it('should be possible to configure propTypes exactly once', () => {
      testStaticProperty(AbstractEntity, 'propTypes', {}, false, {
        id: 'integer:>0'
      });
    });

    it('should be possible to configure dataFieldMapping exactly once', () => {
      testStaticProperty(AbstractEntity, 'dataFieldMapping', {}, false, {
        id: '_id'
      });
    });

    it('should be possible to configure isImmutable exactly once', () => {
      testStaticProperty(AbstractEntity, 'isImmutable', false, false, true);
    });

    it(
      'should have all its private symbol properties marked as ' +
        'non-enumerable',
      () => {
        let entity = new Entity({});
        for (let symbol of Object.getOwnPropertySymbols(entity)) {
          let descriptor = Object.getOwnPropertyDescriptor(entity, symbol);
          expect(descriptor.enumerable).toBe(false);
        }
      }
    );
  });
});
