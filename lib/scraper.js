const _ = require('lodash');
const async = require('async');
const config = require('../config');
const { writeFile, logger } = require('./utils');
const { loadPlugDj, loadDubtrackFm /* , loadYoutube  */ } = require('./scraper/loaders');

const loadData = app => done =>
  async.parallel(
    {
      plugDj: loadPlugDj(app),
      dubtrackFm: loadDubtrackFm(app)
      // youtube: done => loadYoutube(app, done)
    },
    done
  );

const writeFiles = ({ data }, done) =>
  async.map(
    _.keys(data),
    serviceName =>
      writeFile({
        filePath: config.data[serviceName].outputPath,
        data: data[serviceName]
      }),
    done
  );

const run = () => {
  const app = { config, stats: {} };
  async.waterfall([loadData(app), writeFiles /* , writeLog */], (err, res) => {
    if (err) {
      logger.error(err);
      throw new Error(err);
    }

    _.keys(app.stats).forEach(serviceName => {
      const stat = app.stats[serviceName];
      logger.info(`${serviceName} parsed with ${stat.ignored.length} ignored, ${stat.sorted.length} identified songs`);
    });
  });
};

run();
