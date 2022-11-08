jest.mock('path');

import path from 'path';

import { requireFromProject } from '../helpers';

jest.mock('projectPath', () => 'projectPath', { virtual: true });

describe('Helpers', () => {
  it('can require file from project', () => {
    path.resolve = jest.fn().mockReturnValue('projectPath');

    expect(requireFromProject('projectPath')).toBe('projectPath');
  });
});
