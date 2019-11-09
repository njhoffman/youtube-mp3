const Promise = require('bluebird');

const config = require('../config');
// const { logger } = require('./utils');
const initDownloader = require('./transfer/download');
const loadSongList = require('./transfer/load');

const run = async () => {
  const { listPath } = config.output;
  const songs = await loadSongList(listPath);

  const stats = { n: 0, completed: 0, total: songs.length, errors: [] };
  const downloadFile = initDownloader(stats);

  await Promise.map(
    songs,
    song => {
      console.log('download', song.id);
      return downloadFile(song);
    },
    { concurrency: 2 }
  );

  console.log('MY STATS', stats);
};

run();
