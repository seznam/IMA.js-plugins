import { asMedia, asUnit, sizeUnitFactory } from '../utils';

describe('units utils', () => {
  it('sizeUnitFactory - creates size unit function', () => {
    const px = sizeUnitFactory('px');
    const unit = px(16);

    expect(unit.__propertyDeclaration).toBe(true);
    expect(unit.valueOf()).toBe(16);
    expect(unit.toString()).toBe('16px');
  });

  it('asUnit - creates unit with one part and default template', () => {
    const unit = asUnit('rem', [2]);

    expect(unit.__propertyDeclaration).toBe(true);
    expect(unit.valueOf()).toBe(2);
    expect(unit.toString()).toBe('2rem');
  });

  it('asUnit - creates unit with multiple parts and custom template', () => {
    const unit = asUnit('rgb', [1, 2, 3], '${unit}(${parts})');

    expect(unit.__propertyDeclaration).toBe(true);
    expect(unit.valueOf()).toBe('rgb(1,2,3)');
    expect(unit.toString()).toBe('rgb(1,2,3)');
  });

  it('asMedia - creates media query', () => {
    const media = asMedia('~"screen and (min-width: 320px)"');

    expect(media.__mediaQuery).toBe(true);
    expect(media.valueOf()).toBe('~"screen and (min-width: 320px)"');
    expect(media.toString()).toBe('~"screen and (min-width: 320px)"');
  });
});
