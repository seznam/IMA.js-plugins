export function testStaticProperty(
  baseClass,
  propertyName,
  defaultValue,
  throwsError,
  testingValue
) {
  class Entity1 extends baseClass {}
  class Entity2 extends baseClass {}

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
