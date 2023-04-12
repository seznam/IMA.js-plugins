const entityMapper = ResourceEntity => ({
  dataFieldName: null,
  deserialize(data) {
    if (!data || typeof data === 'string' || data instanceof ResourceEntity) {
      return data;
    }

    return new ResourceEntity(data);
  },
  serialize(entity) {
    if (!entity || !(entity instanceof ResourceEntity)) {
      return entity;
    }

    return entity.$serialize();
  },
});

const entityListMapper = ResourceEntity => ({
  dataFieldName: null,
  deserialize(data) {
    if (!data || !Array.isArray(data)) {
      return data;
    }

    return data.map(entity => entityMapper(ResourceEntity).deserialize(entity));
  },
  serialize(data) {
    if (!data || !Array.isArray(data)) {
      return data;
    }

    return data.map(item => entityMapper(ResourceEntity).serialize(item));
  },
});

export { entityMapper, entityListMapper };
