import { AbstractAnalytic, Events } from '../main';

describe('Main', () => {
  it('should has AbstractAnalytic class', () => {
    expect(typeof AbstractAnalytic === 'function').toBe(true);
  });

  it('should has constant value Events', () => {
    expect(typeof Events === 'object').toBe(true);
  });
});
