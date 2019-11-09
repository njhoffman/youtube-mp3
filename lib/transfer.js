const _ = require('lodash');
const Promise = require('bluebird');
const NodeID3 = require('node-id3');

const config = require('../config');
const { logger } = require('./utils');
const initDownloader = require('./transfer/download');
const loadSongList = require('./transfer/load');

const updateTag = (file, i) => {
  logger.info(`#${i + 1} Applying Tags: ${file.fullPath}`);
  const data = _.pick(file, ['artist', 'title', 'genre', 'album']);
  NodeID3.update(data, file.fullPath);
};

const run = async () => {
  const { listPath } = config.output;
  const songs = await loadSongList(listPath);

  const stats = { n: 0, completed: 0, total: songs.length, errors: [] };
  const downloadFile = initDownloader(stats);

  const downloaded = await Promise.map(
    songs,
    song => {
      return downloadFile(song);
    },
    { concurrency: 2 }
  ).filter(Boolean);

  _.each(downloaded, updateTag);

  logger.info(`Finished processing ${downloaded.length} songs`);
};

run();
