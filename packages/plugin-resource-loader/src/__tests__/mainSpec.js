import { ResourceLoader } from '../main';

describe('Main', () => {
  it('should has ResourceLoader', () => {
    expect(typeof ResourceLoader).toBe('function');
  });
});
