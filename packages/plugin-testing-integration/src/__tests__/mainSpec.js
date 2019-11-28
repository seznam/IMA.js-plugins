import * as main from '../main';

describe('Main', () => {
  it('can export all necessary properties', () => {
    expect(main).toMatchSnapshot();
  });
});
