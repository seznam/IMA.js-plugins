let gulpConfig = {
  terminateListeners: [],
  onTerminate() {
    gulpConfig.terminateListeners.forEach(listener => {
      listener();
    });

    setTimeout(() => process.exit());
  },
  shared: {
    browserifyInstance: null
  }
};

if (gulpConfig.onTerminate) {
  process.on('SIGINT', gulpConfig.onTerminate.bind(null, 'SIGINT'));
  process.on('SIGTERM', gulpConfig.onTerminate.bind(null, 'SIGTERM'));
  process.on('SIGHUP', gulpConfig.onTerminate.bind(null, 'SIGHUP'));
}

module.exports = gulpConfig;
