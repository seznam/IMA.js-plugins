import {
  Q,
  ch,
  cm,
  dvh,
  dvw,
  em,
  ex,
  hex,
  hsl,
  hsla,
  inches,
  lessMap,
  lh,
  lvh,
  lvw,
  mm,
  pc,
  percent,
  pt,
  px,
  rem,
  rgb,
  rgba,
  rlh,
  svh,
  svw,
  theme,
  vb,
  vh,
  vi,
  vmax,
  vmin,
  vw,
} from '../units';

describe('units', () => {
  it.each([
    ['em', em, 'em'],
    ['ex', ex, 'ex'],
    ['ch', ch, 'ch'],
    ['rem', rem, 'rem'],
    ['lh', lh, 'lh'],
    ['rlh', rlh, 'rlh'],
    ['vw', vw, 'vw'],
    ['vh', vh, 'vh'],
    ['vmin', vmin, 'vmin'],
    ['vmax', vmax, 'vmax'],
    ['vb', vb, 'vb'],
    ['vi', vi, 'vi'],
    ['svw', svw, 'svw'],
    ['svh', svh, 'svh'],
    ['lvw', lvw, 'lvw'],
    ['lvh', lvh, 'lvh'],
    ['dvw', dvw, 'dvw'],
    ['dvh', dvh, 'dvh'],
    ['cm', cm, 'cm'],
    ['mm', mm, 'mm'],
    ['Q', Q, 'Q'],
    ['inches', inches, 'in'],
    ['pc', pc, 'pc'],
    ['pt', pt, 'pt'],
    ['px', px, 'px'],
    ['percent', percent, '%'],
  ])('%s creates size unit', (name, unitFactory, unit) => {
    const unitValue = unitFactory(12);

    expect(unitValue.__propertyDeclaration).toBe(true);
    expect(unitValue.valueOf()).toBe(12);
    expect(unitValue.toString()).toBe(`12${unit}`);
  });

  it.each([
    ['hex', hex('ffffff'), 'ffffff', '#ffffff'],
    ['hex with hash', hex('#000000'), '000000', '#000000'],
    ['rgb', rgb(255, 255, 255), 'rgb(255,255,255)', 'rgb(255,255,255)'],
    [
      'rgba',
      rgba(255, 255, 255, 0.5),
      'rgba(255,255,255,0.5)',
      'rgba(255,255,255,0.5)',
    ],
    ['hsl', hsl(0, 100, 50), 'hsl(0,100%,50%)', 'hsl(0,100%,50%)'],
    [
      'hsla',
      hsla(0, 100, 50, 0.5),
      'hsla(0,100%,50%,0.5)',
      'hsla(0,100%,50%,0.5)',
    ],
  ])('%s creates color unit', (name, unitValue, value, result) => {
    expect(unitValue.__propertyDeclaration).toBe(true);
    expect(unitValue.valueOf()).toBe(value);
    expect(unitValue.toString()).toBe(result);
  });

  it('creates less map', () => {
    const values = {
      one: 1,
      two: px(2),
      three: hex('#333333'),
      four: percent(4),
    };
    const map = lessMap(values);

    expect(map.__lessMap).toBe(true);
    expect(map.valueOf()).toBe(values);
    expect(map.valueOf('one')).toBe(1);
    expect(map.valueOf('two')).toBe(2);
    expect(map.valueOf('three')).toBe('333333');
    expect(map.valueOf('four')).toBe(4);
    expect(map.toString()).toBe(
      '\tone: 1;\n\ttwo: 2px;\n\tthree: #333333;\n\tfour: 4%;\n'
    );
  });

  it('creates theme', () => {
    const colorLink = {
      light: hex('#710e0e'),
      dark: hex('#b85e5e'),
      fruit: 'red',
    };
    const themeUnit = theme(colorLink);

    expect(themeUnit.__theme).toBe(true);
    expect(themeUnit.valueOf()).toBe(colorLink);
    expect(themeUnit.valueOf('light')).toBe('710e0e');
    expect(themeUnit.valueOf('dark')).toBe('b85e5e');
    expect(themeUnit.valueOf('fruit')).toBe('red');
    expect(themeUnit.toString()).toBe(
      '\tlight: #710e0e;\n\tdark: #b85e5e;\n\tfruit: red;\n'
    );
  });
});
