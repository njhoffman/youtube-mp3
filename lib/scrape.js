const _ = require('lodash');
const async = require('async');
const initConfig = require('../config');
const initUtils = require('./utils');
const { loadPlugDj, loadDubtrackFm /* , loadYoutube  */ } = require('./loaders');

const loadData = (app, allDone) =>
  async.parallel(
    {
      plugDj: done => loadPlugDj(app, done),
      dubtrackFm: done => loadDubtrackFm(app, done)
      // youtube: done => loadYoutube(app, done)
    },
    allDone
  );

const processFiles = ({ config, utils }, data, done) => {
  // const { logger } = utils;
  _.map(_.keys(data), serviceName => {
    utils.writeFile({ serviceName, data: data[serviceName] });
  });
  done();
};

const run = () => {
  const config = initConfig();
  const app = { config, utils: initUtils(config) };
  async.waterfall([done => loadData(app, done), (data, done) => processFiles(app, data, done)], (err, res) => {
    if (err) {
      throw new Error(err);
    }
    console.log('Finished');
  });
};

run();
