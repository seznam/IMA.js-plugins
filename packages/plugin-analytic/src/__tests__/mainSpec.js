import { AbstractAnalytic, Events } from '../main';

describe('Main', () => {
  it('should has AbstractAnalytic class', () => {
    expect(typeof AbstractAnalytic === 'function').toEqual(true);
  });

  it('should has constant value Events', () => {
    expect(typeof Events === 'object').toEqual(true);
  });
});
