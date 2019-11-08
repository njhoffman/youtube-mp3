const path = require('path');
const YoutubeMp3Downloader = require('youtube-mp3-downloader');

const config = require('../../config');
const utils = require('../utils');

const initDownloader = (subDirectory, total) => {
  const outputPath = path.join(config.downloader.outputPath, subDirectory);
  const { logger } = utils;

  const stats = { n: 0, subDirectory, total, errors: [] };
  return async song =>
    new Promise((resolve, reject) => {
      const pfx = `(${stats.n + 1}/${stats.total})`;
      const YD = new YoutubeMp3Downloader({ ...config.downloader, outputPath });
      YD.on('finished', (err, data) => {
        // stats.[transferredBytes, runtime, averageSpeed], youtubeUrl, videoTitle, artist, title, thumbnail
        logger.info(`${pfx} Transferred: ${data.videoId} to ${data.file}`);
        stats.n += 1;
        resolve(stats);
      });

      YD.on('error', error => {
        const errorMessage = `Couldn't transfer to ${subDirectory}: ${error} - ${song.id} (${song.path})`;
        stats.errors.push(errorMessage);
        logger.error(errorMessage);
        resolve(stats);
      });

      YD.on('progress', progress => {
        // progress.[transferred, length, remaining, eta, runtime, delta, speed]
        logger.debug(`${pfx} Downloading: ${progress.videoId} ${Math.floor(progress.progress.percentage)}%`);
      });

      logger.info(`${pfx} Downloading: ${song.id} to ${song.path}`);
      YD.download(song.id, song.path);
    });
};

const downloadFiles = ({ songs, serviceName }) => {
  const downloadFile = initDownloader(serviceName, songs.length);
  return songs.reduce((promise, song) => promise.then(() => downloadFile(song)), Promise.resolve());
};

const downloadBatches = songBatches => {
  const stats = [];
  return songBatches.reduce(
    (promise, songBatch) =>
      promise.then(async () => {
        stats.push(await downloadFiles(songBatch));
        return stats;
      }),
    Promise.resolve()
  );
};

module.exports = {
  downloadBatches
};
