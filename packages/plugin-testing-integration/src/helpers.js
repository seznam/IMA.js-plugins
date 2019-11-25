import path from 'path';
import globby from 'globby';

/**
 * Requires specified file from projectPath
 * @param {string} projectPath relative project path to a file
 * @returns {*} File exports
 */
function requireFromProject(projectPath) {
  return require(path.resolve(projectPath));
}

/**
 * Loads all files matching the glob pattern
 * @param {string[]} patterns Glob patterns
 */
function loadFiles(patterns) {
  return globby.sync(patterns).map(file => {
    try {
      return requireFromProject(file);
    } catch (e) {
      console.error(
        `Tried to load file at path "${file}", but recieved following error.`
      );
      console.error(e);
    }

    return {};
  });
}

export { requireFromProject, loadFiles };
