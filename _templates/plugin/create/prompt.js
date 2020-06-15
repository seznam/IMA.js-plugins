module.exports = {
  prompt: ({ prompter }) => {
    return new Promise((resolve) => {
      prompter
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: 'What is the name of plugin?',
          },
          {
            type: 'input',
            name: 'description',
            message: 'What is the description?',
          },
          {
            type: 'input',
            name: 'version',
            message: 'What is the version? (default 0.0.1)',
          },
        ])
        .then(({ name, description, version }) => {
          const date = new Date().toISOString().split('T')[0];
          resolve({
            name,
            description,
            date,
            version,
          });
        });
    });
  },
};
