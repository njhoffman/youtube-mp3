const YoutubeMp3Downloader = require('youtube-mp3-downloader');

module.exports = (app, done) => {
  done(null);
  // Configure YoutubeMp3Downloader with your settings
  const YD = new YoutubeMp3Downloader({
  });

  // Download video and save as MP3 file
  YD.download('Vhd6Kc4TZls');

  YD.on('finished', (err, data) => {
    console.log(JSON.stringify(data));
  });

  YD.on('error', (error) => {
    console.log(error);
  });

  YD.on('progress', (progress) => {
    console.log(JSON.stringify(progress));
  });
};
