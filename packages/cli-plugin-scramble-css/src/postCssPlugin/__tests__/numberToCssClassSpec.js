import {
  clearCache,
  FORBIDDEN_CLASSNAMES,
  numberToCssClass,
} from '../numberToCssClass';

function generateClassesArray(length, useLowerCase = false) {
  const classNames = [];

  for (let i = 0; i < length; i++) {
    const className = numberToCssClass(i);
    classNames.push(useLowerCase ? className.toLocaleLowerCase() : className);
  }

  return classNames;
}

describe('numberToCssClass()', () => {
  afterEach(clearCache);

  it('should generate unique classes', () => {
    const classNames = generateClassesArray(50000);
    const uniqueClassNames = [...new Set(classNames)];

    expect(classNames).toEqual(uniqueClassNames);
  });

  it.each(FORBIDDEN_CLASSNAMES)(
    'should not generate any variant of class %p',
    className => {
      const useLowerCase = true;
      const classNames = generateClassesArray(50000, useLowerCase);

      expect(classNames[49999]).toEqual(expect.any(String));
      expect(classNames[49999].length).toBeGreaterThan(0);
      expect(classNames.includes(className.toLowerCase())).toBeFalsy();
    }
  );

  it('should generate same class when called in a loop and directly', () => {
    const classNames = generateClassesArray(50000);
    clearCache();

    expect(numberToCssClass(49999)).toBe(classNames[49999]);
  });

  it('should return same class when called repeatedly', () => {
    const className = numberToCssClass(49999);

    expect(numberToCssClass(49999)).toBe(className);
  });
});
