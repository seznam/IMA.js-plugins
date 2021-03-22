import { generateDictionary } from '../localization';
// import globby from 'globby';
// import { requireFromProject } from './helpers';
const mockDictFiles = {
  'thisComponentCS.json': {
    keyOne: 'foo',
    keyTwo: 'bar'
  },
  'that_componentCS.JSON': {
    keyA: 'baz',
    keyB: 'quux'
  }
};

jest.mock('globby', () => ({
  sync: jest.fn(() => ['thisComponentCS.json', 'that_componentCS.JSON'])
}));

const mockGlobby = require('globby');
const { requireFromProject: mockRequireFromProject } = require('../helpers');

jest.mock('../helpers', () => ({
  requireFromProject: jest.fn(filename => {
    return mockDictFiles[filename];
  })
}));

const expectedDictionary = {
  thisComponent: {
    keyOne: expect.anything(),
    keyTwo: expect.anything()
  },
  that_component: {
    keyA: expect.anything(),
    keyB: expect.anything()
  }
};

describe('Localization', () => {
  describe('generateDictionary', () => {
    it('can generate a dictionary from dictionary JSONs, given glob patterns', () => {
      const languages = {
        cs: ['./some/path/*CS.JSON'],
        en: ['./some/path/*EN.JSON']
      };
      const locale = 'cs';
      const dict = generateDictionary(languages, locale);

      expect(mockGlobby.sync).toHaveBeenCalledWith(['./some/path/*CS.JSON']);
      expect(mockRequireFromProject).toHaveBeenCalledTimes(2);
      expect(mockRequireFromProject).toHaveBeenNthCalledWith(
        1,
        'thisComponentCS.json'
      );
      expect(mockRequireFromProject).toHaveBeenNthCalledWith(
        2,
        'that_componentCS.JSON'
      );
      expect(dict).toMatchObject(expectedDictionary);
    });
  });
});
