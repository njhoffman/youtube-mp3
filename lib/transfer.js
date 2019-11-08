const _ = require('lodash');
const { downloadBatches } = require('./transfer/download');
const { parseServices } = require('./transfer/parse');
const config = require('../config');

const run = () => {
  Promise.all(_.map(_.keys(config.data), parseServices))
    .then(downloadBatches)
    .then(stats => {
      console.log('** FINISHED', stats);
    })
    .catch(err => {
      console.error(err);
    });
};

run();
