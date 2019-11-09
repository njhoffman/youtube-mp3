const _ = require('lodash');
const async = require('async');
const { downloadFile } = require('./transfer/download');
const { parseServices } = require('./transfer/parse');
const { logger } = require('./utils');
const config = require('../config');

const run = () => {
  async.waterfall(
    [
      done => async.map(_.keys(config.data), parseServices, done),
      (songBatches, done) => {
        const songs = _.uniqBy(_.flatten(songBatches), 'id');
        const dupes = _.without(_.flatten(songBatches), ...songs);
        dupes.forEach(dupe => logger.warn(`Duplicate removed: ${dupe.id} ${dupe.name}`));
        const stats = { n: 0, total: songs.length, errors: [] };
        done(null, { songs, stats });
      },
      ({ songs, stats }, done) => async.mapLimit(songs, 1, downloadFile(stats), done)
    ],
    (err, res) => {
      console.log('FINISHED', res, err);
    }
  );
};
run();
