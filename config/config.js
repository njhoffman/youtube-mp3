const path = require('path');
const appRoot = require('app-root-path');

const config = {
  appPath: `${appRoot}`,
  logger: {
    colors: {
      fatal: { fg: [255, 255, 255], bg: [230, 20, 20] },
      error: { fg: [255, 255, 255], bg: [180, 20, 20] },
      warn: { fg: [255, 255, 255], bg: [180, 60, 20] },
      log: { fg: [255, 255, 255], bg: [60, 110, 180] },
      info: { fg: [255, 255, 255], bg: [20, 70, 180] },
      debug: { fg: [255, 255, 255], bg: [80, 100, 200] },
      trace: { fg: [255, 255, 255], bg: [80, 120, 220] }
    },
    file: {
      name: 'youtube-mp3.log',
      level: 3
    },
    stdout: {
      level: 5
    }
  },
  output: {
    genre: '[Singles]',
    album: 'Unsorted Singles',
    skippedPath: path.join(`${appRoot}`, 'output/skipped.tsv'),
    listPath: path.join(`${appRoot}`, 'output/songs.tsv'),
    filesPath: path.join(`${appRoot}`, 'output/files')
  },
  data: {
    plugDj: {
      filePath: path.join(`${appRoot}`, 'data/03-24-2019/plug.dj.json'),
      ignored: []
    },
    dubtrackFm: {
      filePath: path.join(`${appRoot}`, 'data/03-24-2019/dubtrack.fm.json'),
      ignored: []
    }
    // youtube: {
    //   filePath: path.join(`${appRoot}`, 'data/youtube.json'),
    //   ignored: []
    // }
  },
  downloader: {
    ffmpegPath: '/usr/bin/ffmpeg', // Where is the FFmpeg binary located?
    youtubeVideoQuality: 'highest', // What video quality should be used?
    queueParallelism: 1, // How many parallel downloads/encodes should be started?
    progressTimeout: 2000 // How long should be the interval of the progress reports
  }
};

module.exports = config;
