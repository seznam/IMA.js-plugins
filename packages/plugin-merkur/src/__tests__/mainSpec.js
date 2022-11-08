import * as Main from '../main';

describe('Main', () => {
  it('should export MerkurResource', () => {
    expect(typeof Main.MerkurResource).toBe('function');
  });
});
