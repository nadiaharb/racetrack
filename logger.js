const loglevel = require('loglevel');

const logger = loglevel.getLogger('race-track-app');
logger.setLevel(process.env.LOG_LEVEL || 'info');

module.exports = logger;
