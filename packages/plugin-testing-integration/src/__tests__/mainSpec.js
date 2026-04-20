jest.mock('@ima/testing-library', () => ({
  __esModule: true,
  setImaTestingLibraryClientConfig: jest.fn(),
  generateDictionary: jest.fn().mockResolvedValue({}),
}));

import * as main from '../main';

describe('Main', () => {
  it('exports plugin APIs', () => {
    expect(main).toEqual(
      expect.objectContaining({
        getConfig: expect.any(Function),
        setConfig: expect.any(Function),
        initImaApp: expect.any(Function),
        clearImaApp: expect.any(Function),
      })
    );
  });

  it('does not re-export testing-library utilities', () => {
    expect(main).not.toHaveProperty('renderWithContext');
    expect(main).not.toHaveProperty('screen');
    expect(main).not.toHaveProperty('setupImaTestingIntegration');
  });
});
