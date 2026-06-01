import * as index from '../index';

describe('units index', () => {
  it('exports public units API', () => {
    expect(index).toMatchSnapshot();
  });
});
