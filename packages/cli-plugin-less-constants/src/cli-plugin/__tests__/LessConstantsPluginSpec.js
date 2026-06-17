import fs from 'fs';
import os from 'os';
import path from 'path';

import { hex, lessMap, px, theme } from '../../units/units';
import { generateLessConstants } from '../generatorLessConstants';
import { LessConstantsPlugin } from '../LessConstantsPlugin';

jest.mock(
  '@ima/dev-utils/logger',
  () => ({
    createLogger: jest.fn(() => ({
      error: jest.fn(),
      plugin: jest.fn(),
    })),
  }),
  { virtual: true }
);

describe('LessConstantsPlugin', () => {
  let exitSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
  });

  afterEach(() => {
    exitSpy.mockRestore();
  });

  it('exits when entry file is missing', async () => {
    const rootDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), 'less-constants-plugin-')
    );

    try {
      const plugin = new LessConstantsPlugin({
        entry: 'missing.js',
      });

      await expect(
        plugin.preProcess({ rootDir }, { webpackAliases: {} })
      ).rejects.toThrow('process.exit');

      const { createLogger } = jest.requireMock('@ima/dev-utils/logger');

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(createLogger.mock.results[0].value.error).toHaveBeenCalledWith(
        `entry file at path '${path.join(rootDir, 'missing.js')}' doesn't exist.`
      );
    } finally {
      await fs.promises.rm(rootDir, { recursive: true, force: true });
    }
  });

  describe('_processThemeOptions', () => {
    it('uses "light" as default when defaultTheme is not provided', () => {
      const plugin = new LessConstantsPlugin({
        entry: 'lessConstants.js',
        themes: ['light', 'dark'],
      });

      expect(plugin._processThemeOptions()).toEqual({
        defaultTheme: 'light',
        themes: ['light', 'dark'],
      });
    });

    it('uses ["light"] as default when themes are not provided', () => {
      const plugin = new LessConstantsPlugin({
        entry: 'lessConstants.js',
        defaultTheme: 'light',
      });

      expect(plugin._processThemeOptions()).toEqual({
        defaultTheme: 'light',
        themes: ['light'],
      });
    });

    it('uses light theme as the only theme when no theme options are provided', () => {
      const plugin = new LessConstantsPlugin({
        entry: 'lessConstants.js',
      });

      expect(plugin._processThemeOptions()).toEqual({
        defaultTheme: 'light',
        themes: ['light'],
      });
    });

    it('uses the only configured theme', () => {
      const plugin = new LessConstantsPlugin({
        entry: 'lessConstants.js',
        defaultTheme: 'dark',
        themes: ['dark'],
      });

      expect(plugin._processThemeOptions()).toEqual({
        defaultTheme: 'dark',
        themes: ['dark'],
      });
    });

    it('uses explicit default theme with multiple themes', () => {
      const plugin = new LessConstantsPlugin({
        entry: 'lessConstants.js',
        defaultTheme: 'dark',
        themes: ['light', 'dark', 'contrast'],
      });

      expect(plugin._processThemeOptions()).toEqual({
        defaultTheme: 'dark',
        themes: ['light', 'dark', 'contrast'],
      });
    });

    it.each([
      [
        'non-array themes',
        { themes: 'dark' },
        ['Invalid themes option. Expected an array of themes.'],
      ],
      [
        'invalid default theme',
        { defaultTheme: 'contrast' },
        [
          'Invalid default theme',
          'contrast',
          'Valid options are',
          'light, dark',
        ],
      ],
      [
        'default theme missing in themes list',
        { defaultTheme: 'dark', themes: ['light'] },
        ['Default theme', 'dark', 'must be included in themes list.'],
      ],
      [
        'multiple themes without both light and dark',
        { themes: ['light', 'contrast'] },
        [
          'Themes list must include both',
          'light',
          'dark',
          'when multiple themes are specified.',
        ],
      ],
    ])('exits for %s', (name, options, errorMessageParts) => {
      const plugin = new LessConstantsPlugin({
        entry: 'lessConstants.js',
        ...options,
      });
      const { createLogger } = jest.requireMock('@ima/dev-utils/logger');

      expect(() => plugin._processThemeOptions()).toThrow('process.exit');
      expect(exitSpy).toHaveBeenCalledWith(1);
      const errorMessage = String(
        createLogger.mock.results.at(-1).value.error.mock.calls[0][0]
      );

      errorMessageParts.forEach(errorMessagePart => {
        expect(errorMessage).toContain(errorMessagePart);
      });
    });
  });

  describe('_verifyConstantsUsed', () => {
    const lessConstants = generateLessConstants({
      contentWidth: px(1024),
      zIndex: lessMap({
        dropdown: 2,
        modal: 5,
      }),
      colorText: theme({
        light: hex('#ffffff'),
        dark: hex('#000000'),
      }),
      colorBorder: hex('#b85e5e'),
    });

    it('does nothing when verify option is not provided', async () => {
      const plugin = new LessConstantsPlugin({
        entry: 'lessConstants.js',
      });
      const { createLogger } = jest.requireMock('@ima/dev-utils/logger');

      await plugin._verifyConstantsUsed(lessConstants);

      expect(
        createLogger.mock.results.at(-1).value.plugin
      ).not.toHaveBeenCalled();
    });

    it('logs that all constants are used', async () => {
      const directory = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), 'less-constants-plugin-verify-')
      );

      try {
        await fs.promises.writeFile(
          path.join(directory, 'component.less'),
          `
.component {
  width: var(--content-width);
  z-index: @z-index[modal];
  color: @color-text[dark];
  border-color: var(--color-border);
}
`,
          'utf-8'
        );
        await fs.promises.mkdir(path.join(directory, 'nested'));
        await fs.promises.writeFile(
          path.join(directory, 'nested/dropdown.less'),
          '.component { z-index: var(--z-index-dropdown); }',
          'utf-8'
        );

        const plugin = new LessConstantsPlugin({
          entry: 'lessConstants.js',
          verify: [directory],
        });
        const { createLogger } = jest.requireMock('@ima/dev-utils/logger');

        await plugin._verifyConstantsUsed(lessConstants);

        const logger = createLogger.mock.results.at(-1).value;
        expect(String(logger.plugin.mock.calls[0][0])).toContain(
          'All constants are used in less files in'
        );
        expect(String(logger.plugin.mock.calls[0][0])).toContain(directory);
      } finally {
        await fs.promises.rm(directory, { recursive: true, force: true });
      }
    });

    it('logs unused constants', async () => {
      const directory = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), 'less-constants-plugin-verify-')
      );

      try {
        await fs.promises.writeFile(
          path.join(directory, 'component.less'),
          '.component { width: var(--content-width); }',
          'utf-8'
        );

        const plugin = new LessConstantsPlugin({
          entry: 'lessConstants.js',
          verify: [directory],
        });
        const { createLogger } = jest.requireMock('@ima/dev-utils/logger');

        await plugin._verifyConstantsUsed(lessConstants);

        const logger = createLogger.mock.results.at(-1).value;
        expect(logger.plugin).toHaveBeenCalledWith(
          'The following constants are not used in any less file (as less variables or CSS variables):'
        );
        expect(logger.plugin).toHaveBeenCalledWith('z-index[dropdown]');
        expect(logger.plugin).toHaveBeenCalledWith('z-index[modal]');
        expect(logger.plugin).toHaveBeenCalledWith('color-text');
        expect(logger.plugin).toHaveBeenCalledWith('color-border');
      } finally {
        await fs.promises.rm(directory, { recursive: true, force: true });
      }
    });
  });

  it('generates less and css constants files', async () => {
    const rootDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), 'less-constants-plugin-')
    );

    try {
      const entry = 'app/lessConstants.js';
      const entryPath = path.join(rootDir, entry);

      await fs.promises.mkdir(path.dirname(entryPath), { recursive: true });
      await fs.promises.writeFile(entryPath, 'export default {};', 'utf-8');

      const plugin = new LessConstantsPlugin({
        entry,
        themes: ['light', 'dark'],
      });
      plugin._compileEntry = jest.fn().mockResolvedValue({
        contentWidth: px(1024),
        colorText: theme({
          light: hex('#ffffff'),
          dark: hex('#000000'),
        }),
      });

      await plugin.preProcess({ rootDir }, { webpackAliases: {} });

      await expect(
        fs.promises.readFile(
          path.join(rootDir, 'build/less-constants/constants.less'),
          'utf-8'
        )
      ).resolves.toContain('@content-width: 1024px;');
      await expect(
        fs.promises.readFile(
          path.join(rootDir, 'build/less-constants/cssConstants.less'),
          'utf-8'
        )
      ).resolves.toContain('--content-width: 1024px;');
      expect(plugin._compileEntry).toHaveBeenCalledWith(
        entryPath,
        { rootDir },
        { webpackAliases: {} }
      );
    } finally {
      await fs.promises.rm(rootDir, { recursive: true, force: true });
    }
  });
});
