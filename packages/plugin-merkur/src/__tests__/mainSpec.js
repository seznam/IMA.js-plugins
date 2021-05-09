import * as Main from '../main';

describe('Main', () => {
  it('should export $registerImaPlugin', () => {
    expect(typeof Main.$registerImaPlugin).toEqual('function');
  });

  it('should export MerkurResource', () => {
    expect(typeof Main.MerkurResource).toEqual('function');
  });
});
