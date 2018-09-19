
import AbstractDataFieldMapper from '../AbstractDataFieldMapper';
import AbstractEntity from '../AbstractEntity';
import AbstractRestClient from '../AbstractRestClient';

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

	let restResult;
	let calledClientMethods;
	let parametersToPass;
	let passedParameters;
	let restClient;
	let restClientCallbacks;

	class RestClient extends AbstractRestClient {
		list(resource, parameters = {}, options = {}, parentEntity = null) {
			calledClientMethods.list = true;
			passedParameters = parameters;
			return Promise.resolve(restResult);
		}

		get(resource, id, parameters = {}, options = {}, parentEntity = null) {
			calledClientMethods.get = true;
			passedParameters = parameters;
			return Promise.resolve(restResult);
		}

		patch(resource, id, data, parameters = {}, options = {}, parentEntity = null) {
			calledClientMethods.patch = true;
			passedParameters = parameters;

			if (restClientCallbacks.patch) {
				restClientCallbacks.patch(data);
			}
			return Promise.resolve(restResult);
		}

		replace(resource, id, data, parameters = {}, options = {}, parentEntity = null) {
			calledClientMethods.replace = true;
			passedParameters = parameters;

			if (restClientCallbacks.replace) {
				restClientCallbacks.replace(data);
			}
			return Promise.resolve(restResult);
		}

		create(resource, data, parameters = {}, options = {}, parentEntity = null) {
			calledClientMethods.create = true;
			passedParameters = parameters;

			if (restClientCallbacks.create) {
				restClientCallbacks.create(data);
			}
			return Promise.resolve(restResult);
		}

		delete(resource, id, parameters = {}, options = {}, parentEntity = null) {
			calledClientMethods.delete = true;
			passedParameters = parameters;

			return Promise.resolve(restResult);
		}
	}

	beforeEach(() => {
		restResult = null;
		calledClientMethods = {
			list: false,
			get: false,
			patch: false,
			replace: false,
			create: false,
			delete: false
		};
		restClientCallbacks = {
			create: null,
			patch: null,
			replace: null
		};
		restClient = new RestClient(null, null, null, [], []);
		parametersToPass = { key: 'value' };
		passedParameters = undefined;
	});

	it('should reject invalid rest client constructor argument', () => {
		expect(() => {
			new Entity(null, {});
		}).toThrowError(TypeError);

		new Entity(restClient, {});
	});

	it('should assign data to its instance', () => {
		let template = new Entity(restClient, {});
		template.id = 12;
		template.test = true;
		expect(new Entity(restClient, {
			id: 12,
			test: true
		})).toEqual(template);
	});

	it('should keep reference to its parent entity', () => {
		expect((new Entity(restClient, {}, new Entity(restClient, {
			id: 'yup'
		}))).$parentEntity).toEqual(new Entity(restClient, {
			id: 'yup'
		}));
	});

	it('should keep reference to the REST API client', () => {
		expect(new Entity(restClient, {}).$restClient).toBe(restClient);
	});

	it('should allow listing of entities', (done) => {
		restResult = 123;
		return Entity.list(restClient, parametersToPass).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.list).toBeTruthy();
			expect(passedParameters).toEqual(parametersToPass);
			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow retrieving a single entity', (done) => {
		restResult = 234;
		return Entity.get(restClient, 1, parametersToPass).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.get).toBeTruthy();
			expect(passedParameters).toEqual(parametersToPass);
			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow creating new entities', (done) => {
		restResult = 345;
		return Entity.create(restClient, {}, parametersToPass).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.create).toBeTruthy();
			expect(passedParameters).toEqual(parametersToPass);

			calledClientMethods.create = false;
			restResult = 456;
			parametersToPass = Object.assign({}, parametersToPass);
			let entity = new Entity(restClient, {});
			return entity.create(parametersToPass);
		}).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.create).toBeTruthy();
			expect(passedParameters).toEqual(parametersToPass);

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow deleting entities', (done) => {
		restResult = 567;
		return Entity.delete(restClient, 1, parametersToPass).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.delete).toBeTruthy();
			expect(passedParameters).toEqual(parametersToPass);

			calledClientMethods.delete = false;
			restResult = 678;
			parametersToPass = Object.assign({}, parametersToPass);
			let entity = new Entity(restClient, { id: 1 });
			return entity.delete(parametersToPass);
		}).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.delete).toBeTruthy();
			expect(passedParameters).toEqual(parametersToPass);

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow listing of sub-resource entities', (done) => {
		restResult = 789;
		let entity = new Entity(restClient, {});
		entity.list(Entity, parametersToPass).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.list).toBeTruthy();
			expect(passedParameters).toEqual(parametersToPass);

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow fetching of single entities', (done) => {
		restResult = 890;
		let entity = new Entity(restClient, {});
		entity.get(Entity, 1, parametersToPass).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.get).toBeTruthy();
			expect(passedParameters).toEqual(parametersToPass);

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow patching entities', (done) => {
		restResult = 901;
		let entity = new Entity(restClient, { id: 1 });
		entity.patch({ id: 2, test: 'yay' }, parametersToPass).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.patch).toBeTruthy();
			expect(passedParameters).toEqual(parametersToPass);

			expect(entity).toEqual(new Entity(restClient, {
				id: 2,
				test: 'yay'
			}));

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow replacing entities', (done) => {
		restResult = 12;
		let entity = new Entity(restClient, {});
		entity.replace(parametersToPass).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.replace).toBeTruthy();
			expect(passedParameters).toEqual(parametersToPass);

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	describe('serialization', () => {
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
			let entity = new TransformingEntity(restClient, {
				test: 'tested',
				serialized: true
			});
			expect(Object.assign({}, entity)).toEqual({
				test: 'tested',
				dynamic: true
			});
		});

		it('should create entities from deserialized data when using static ' +
				'create()', (done) => {
			let createCalled = false;
			restClientCallbacks.create = (data) => {
				createCalled = true;
				expect(data).toEqual({
					test: 'testing',
					serialized: true
				});
			};
			restResult = new TransformingEntity(restClient, {
				test: 'testing',
				serialized: true
			});
			TransformingEntity.create(restClient, {
				test: 'testing',
				dynamic: true
			}).then((entity) => {
				expect(serializeCalled).toBeTruthy();
				expect(Object.assign({}, entity)).toEqual({
					test: 'testing',
					dynamic: true
				});
				done();
			});
		});

		it('should use deserialized entity data in the patch method',
				(done) => {
			let entity = new TransformingEntity(restClient, {
				test: 'testing',
				testing: 'test',
				serialized: true
			});
			let patchCalled = false;
			restClientCallbacks.patch = (data) => {
				patchCalled = true;
				expect(data).toEqual({
					test: 'tested',
					test2: 1,
					serialized: true
				});
			};
			entity.patch({
				test: 'tested',
				test2: 1,
				onlyDynamic: true
			}).then(() => {
				expect(patchCalled).toBeTruthy();
				expect(Object.assign({}, entity)).toEqual({
					test: 'tested',
					testing: 'test',
					dynamic: true,
					onlyDynamic: true,
					test2: 1
				});
				done();
			});
		});

		it('should use deserialized entity data in the replace method',
				(done) => {
			let entity = new TransformingEntity(restClient, {
				test: 'testing',
				testing: 'test',
				serialized: true
			});
			let replaceCalled = false;
			restClientCallbacks.replace = (data) => {
				replaceCalled = true;
				expect(data).toEqual({
					test: 'tested',
					testing: 'test',
					serialized: true
				});
			};
			entity.test = 'tested';
			entity.replace().then(() => {
				expect(replaceCalled).toBeTruthy();
				expect(Object.assign({}, entity)).toEqual({
					test: 'tested',
					testing: 'test',
					dynamic: true
				});
				done();
			});
		});

		it('should use deserialized entity data in the dynamic create method',
				(done) => {
			let entity = new TransformingEntity(restClient, {
				test: 'testing',
				testing: 'test',
				serialized: true
			});
			let createCalled = false;
			restClientCallbacks.create = (data) => {
				createCalled = true;
				expect(data).toEqual({
					test: 'testing',
					testing: 'test',
					serialized: true
				});
			};
			entity.create().then(() => {
				expect(createCalled).toBeTruthy();
				expect(Object.assign({}, entity)).toEqual({
					test: 'testing',
					testing: 'test',
					dynamic: true
				});
				done();
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

			let entity = new DeclarativelyMappedEntity(restClient, {
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

		it('should allow declarative property mapping using mapper object',
				() => {
			class MappingEntity extends Entity {
				static get dataFieldMapping() {
					return {
						id: {
							dataFieldName: '_id',
							serialize(value, processedEntity) {
								expect(
									processedEntity instanceof MappingEntity
								).toBe(true);
								return -value;
							},
							deserialize(value, processedEntity) {
								expect(
									processedEntity instanceof MappingEntity
								).toBe(true);
								return -value;
							}
						},
						foo: {
							dataFieldName: null,
							serialize(value, processedEntity) {
								return value;
							},
							deserialize(value, processedEntity) {
								return value
							}
						},
						bar: {
							dataFieldName: 'bar',
							serialize(value, processedEntity) {
								return value;
							},
							deserialize(value, processedEntity) {
								return value
							}
						}
					};
				}
			}

			let entity = new MappingEntity(restClient, {
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

		it('should allow declarative property mapping using mapper classes',
				() => {
			class MappingEntity extends Entity {
				static get dataFieldMapping() {
					return {
						id: AbstractDataFieldMapper.makeMapper(
							'_id',
							(value, processedEntity) => {
								expect(
									processedEntity instanceof MappingEntity
								).toBe(true);
								return -value;
							},
							(value, processedEntity) => {
								expect(
									processedEntity instanceof MappingEntity
								).toBe(true);
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

			let entity = new MappingEntity(restClient, {
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
						otherSession: Session.asDataFieldMapper(
							'otherSession'
						),
						anotherSession: Session.asDataFieldMapper()
					};
				}
			}

			let entity = new User(restClient, {
				id: 1,
				_session: { id: 'ABC' },
				otherSession: { id: 'DEF' },
				anotherSession: { id: 'GHI' }
			});
			let templateEntity = new User(restClient, {});
			templateEntity.id = 1;
			templateEntity.session = new Session(restClient, { id: 'ABC' });
			templateEntity.otherSession = new Session(restClient, {
				id: 'DEF'
			});
			templateEntity.anotherSession = new Session(restClient, {
				id: 'GHI'
			});
			expect(entity).toEqual(templateEntity);
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

			let entity = new Entity(restClient, { id: 1 });
			entity.id = 2;
			entity.foo = 'bar';
			Object.defineProperty(entity, 'id', {
				enumerable: false
			});
		});

		it('should be deeply immutable if marked as such', () => {
			let entity = new ImmutableEntity(restClient, {
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
			let entity = new ImmutableEntity(restClient, {
				id: 1,
				text: 'is a text',
				created: new Date(),
				regexp: /a/
			}, new ImmutableEntity(restClient, {
				id: 'xy',
				isParent: true
			}, new ImmutableEntity(restClient, {
				id: 'grand-parent',
				isGrandParent: true
			})));
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
			let entity = new ImmutableEntity(restClient, {
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

		it('should be compatible with the patch() method', (done) => {
			class ImmutableMockEntity extends Entity {
				static get isImmutable() {
					return true;
				}
			}

			let entity = new ImmutableMockEntity(restClient, {
				id: 1,
				foo: 'bar'
			});
			restResult = {
				id: 1,
				foo: 'baz'
			};
			entity.patch({ foo: 'baz' }).then((patchedEntity) => {
				expect(entity.foo).toBe('bar');
				expect(patchedEntity.foo).toBe('baz');
				done();
			}).catch((error) => {
				fail(error);
				done();
			});
			expect(entity.foo).toBe('bar');
		});

	});

	describe('static properties', () => {

		it('should be possible to configure resourceName exactly once', () => {
			testStaticProperty('resourceName', null, true, 'fooBar');
		});

		it('should be possible to configure idFieldName exactly once', () => {
			testStaticProperty('idFieldName', null, true, 'id');
		});

		it('should be possible to configure inlineResponseBody exactly once',
				() => {
			testStaticProperty('inlineResponseBody', false, false, true);
		});

		it('should be possible to configure propTypes exactly once', () => {
			testStaticProperty('propTypes', {}, false, { id: 'integer:>0' });
		});

		it('should be possible to configure dataFieldMapping exactly once',
				() => {
			testStaticProperty('dataFieldMapping', {}, false, { id: '_id' });
		});

		it('should be possible to configure isImmutable exactly once', () => {
			testStaticProperty('isImmutable', false, false, true);
		});

		it(
			'should have all its private symbol properties marked as ' +
			'non-enumerable',
			() => {
				let entity = new Entity(restClient, {});
				for (let symbol of Object.getOwnPropertySymbols(entity)) {
					let descriptor = Object.getOwnPropertyDescriptor(
						entity,
						symbol
					);
					expect(descriptor.enumerable).toBe(false);
				}
			}
		);

		function testStaticProperty(propertyName, defaultValue, throwsError,
				testingValue) {
			class Entity1 extends AbstractEntity {}
			class Entity2 extends AbstractEntity {}

			if (throwsError) {
				expect(() => {
					return Entity1[propertyName];
				}).toThrow();
			} else {
				expect(Entity1[propertyName]).toEqual(defaultValue);
			}

			Entity2[propertyName] = testingValue;
			expect(Entity2[propertyName]).toBe(testingValue);

			// The property must not be affected on other entity classes
			if (throwsError) {
				expect(() => {
					return Entity1[propertyName];
				}).toThrow();
			} else {
				expect(Entity1[propertyName]).toEqual(defaultValue);
			}

			expect(() => {
				Entity2[propertyName] = testingValue;
			}).toThrow();
		}

	});

});
