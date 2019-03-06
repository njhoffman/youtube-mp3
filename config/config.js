module.exports = () => ({
  logger: {
    colors: {
      fatal: { fg: [255, 255, 255], bg: [230, 20, 20] },
      error: { fg: [255, 255, 255], bg: [180, 20, 20] },
      warn:  { fg: [255, 255, 255], bg: [180, 60, 20] },
      log:   { fg: [255, 255, 255], bg: [60, 110, 180] },
      info:  { fg: [255, 255, 255], bg: [20, 70, 180] },
      debug: { fg: [255, 255, 255], bg: [80, 100, 200] },
      trace: { fg: [255, 255, 255], bg: [80, 120, 220] },
    },
    file: {
      name: 'youtube-mp3.log',
      level: 3
    },
    stdout: {
      level: 6
    }
  },
  ffmpegPath:          '/path/to/ffmpeg', // Where is the FFmpeg binary located?
  outputPath:          '/path/to/mp3/folder', // Where should the downloaded and encoded files be stored?
  youtubeVideoQuality: 'highest', // What video quality should be used?
  queueParallelism:    2, // How many parallel downloads/encodes should be started?
  progressTimeout:     2000 // How long should be the interval of the progress reports
});
