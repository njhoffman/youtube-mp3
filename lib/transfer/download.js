const YoutubeMp3Downloader = require('youtube-mp3-downloader');

const config = require('../../config');
const { logger } = require('../utils');

const initDownloader = initialStats => {
  const stats = { ...initialStats };
  return song =>
    new Promise((resolve, reject) => {
      stats.n += 1;

      const pfx = `#${stats.n} (${stats.completed}/${stats.total})`;

      const YD = new YoutubeMp3Downloader({
        ...config.downloader,
        outputPath: config.output.filesPath
      });

      YD.on('finished', (err, data) => {
        // stats.[transferredBytes, runtime, averageSpeed], youtubeUrl, videoTitle, artist, title, thumbnail
        logger.info(`${pfx} Transferred: ${data.videoId} to ${data.file}`);
        stats.completed += 1;
        resolve({ ...song, fullPath: data.file });
      });

      YD.on('error', error => {
        const errorMessage = `Couldn't transfer ${error} - ${song.id} (${song.path})`;
        stats.errors.push(errorMessage);
        logger.error(errorMessage);
        resolve();
      });

      YD.on('progress', progress => {
        // progress.[transferred, length, remaining, eta, runtime, delta, speed]
        logger.debug(`${pfx} Downloading: ${progress.videoId} ${Math.floor(progress.progress.percentage)}%`);
      });

      logger.info(`${pfx} Downloading: ${song.id} to ${song.path}`);
      YD.download(song.id, song.path);
    });
};

module.exports = initDownloader;
