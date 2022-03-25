import path from 'path';

/**
 * Requires specified file from projectPath
 * @param {string} projectPath relative project path to a file
 * @returns {*} File exports
 */
function requireFromProject(projectPath) {
  return require(path.resolve(projectPath));
}

export { requireFromProject };
