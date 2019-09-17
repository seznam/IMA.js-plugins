jest.mock('path');
jest.mock('globby');

import path from 'path';
import globby from 'globby';
import { requireFromProject, loadFiles } from '../helpers';

jest.mock('projectPath', () => 'projectPath', { virtual: true });
jest.mock('loadFilesRequire.js', () => 'loadFilesRequire.js', {
  virtual: true
});

describe('Helpers', () => {
  it('can require file from project', () => {
    path.resolve = jest.fn().mockReturnValue('projectPath');

    expect(requireFromProject('projectPath')).toEqual('projectPath');
  });

  it('can load files', () => {
    const patterns = 'pattern';
    globby.sync = jest.fn().mockReturnValue(['loadFilesRequire.js']);

    let results = loadFiles(patterns);

    expect(globby.sync).toHaveBeenCalledWith(patterns);
    expect(results).toEqual(['loadFilesRequire.js']);
  });
});
