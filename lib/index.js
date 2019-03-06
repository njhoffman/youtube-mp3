const async = require('async');
const initConfig = require('../config');
const initUtils = require('./utils');
const initYoutubeMp3 = require('./youtube-mp3');
const { loadPlugDj, loadDubtrackFm, loadYoutube } = require('./loaders');

const loadData = (app, allDone) => async.parallel({
  plugDj: (done) => loadPlugDj(app, done),
  dubtrackFm: (done) => loadDubtrackFm(app, done),
  youtube: (done) => loadYoutube(app, done)
}, allDone);

const processFiles = ({ config, utils }, data, done) => {
  const { logger } = utils;
  logger.trace('help');
  logger.debug('help');
  logger.info('help');
  logger.warn('help');
  logger.error('help');
  logger.fatal('help');
  // console.log('PROCESS FILES', data);
};

const run = () => {
  const config = initConfig();
  const app = { config, utils: initUtils(config) };
  async.waterfall([
    (done) => initYoutubeMp3(app, done),
    (done) => loadData(app, done),
    (data, done) => processFiles(app, data, done),
  ], (err, res) => {
    if (err) {
      throw new Error(err);
    }
    console.log('Finished', res);
  });
};

run();
