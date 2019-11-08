const path = require('path');
const YoutubeMp3Downloader = require('youtube-mp3-downloader');

module.exports = ({ config, utils }, subDirectory) => {
  const outputPath = path.join(config.downloader.outputPath, subDirectory);
  const { logger } = utils;

  return async song =>
    new Promise((resolve, reject) => {
      const YD = new YoutubeMp3Downloader({ ...config.downloader, outputPath });
      YD.on('finished', (err, data) => {
        // stats.[transferredBytes, runtime, averageSpeed], youtubeUrl, videoTitle, artist, title, thumbnail
        logger.info(`Transferred: ${data.videoId} to ${data.file}`);
        resolve(data);
      });

      YD.on('error', error => {
        // console.log(`ERROR BITCHES`, error, song);
        reject(error, song);
      });

      YD.on('progress', progress => {
        // progress.[transferred, length, remaining, eta, runtime, delta, speed]
        logger.debug(`Downloading: ${progress.videoId} ${Math.floor(progress.progress.percentage)}%`);
      });

      logger.info(`Downloading: ${song.id} to ${song.path}`);
      YD.download(song.id, song.path);
    });
};
