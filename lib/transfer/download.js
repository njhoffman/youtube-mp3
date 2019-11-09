const path = require('path');
const YoutubeMp3Downloader = require('youtube-mp3-downloader');

const config = require('../../config');
const utils = require('../utils');

const downloadFile = initialStats => {
  const stats = { ...initialStats };
  return (song, done) => {
    const pfx = `(${stats.n + 1}/${stats.total})`;
    const { logger } = utils;
    const outputPath = path.join(config.downloader.outputPath, song.serviceName);
    const YD = new YoutubeMp3Downloader({ ...config.downloader, outputPath });
    YD.on('finished', (err, data) => {
      // stats.[transferredBytes, runtime, averageSpeed], youtubeUrl, videoTitle, artist, title, thumbnail
      logger.info(`${pfx} ${song.serviceName} Transferred: ${data.videoId} to ${data.file}`);
      stats.n += 1;
      done(null, stats);
    });

    YD.on('error', error => {
      const errorMessage = `Couldn't transfer ${song.serviceName}: ${error} - ${song.id} (${song.path})`;
      stats.errors.push(errorMessage);
      logger.error(errorMessage);
      stats.n += 1;
      done(null, stats);
    });

    YD.on('progress', progress => {
      // progress.[transferred, length, remaining, eta, runtime, delta, speed]
      logger.debug(
        `${pfx} ${song.serviceName} Downloading: ${progress.videoId} ${Math.floor(progress.progress.percentage)}%`
      );
    });

    logger.info(`${pfx} ${song.serviceName} Downloading: ${song.id} to ${song.path}`);
    console.log(outputPath, song.path);
    YD.download(song.id, song.path);
  };
};

module.exports = {
  downloadFile
};
