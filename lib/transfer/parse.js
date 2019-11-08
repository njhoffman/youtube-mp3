const _ = require('lodash');
const { promisify } = require('util');
const fs = require('fs');

const config = require('../../config');
const utils = require('../utils');

const loadFile = async outputPath => promisify(fs.readFile)(outputPath);

const makeDirectory = async directory => promisify(fs.mkdir)(directory);

const parseData = (line, i) => {
  // skip header line
  const lineParts = line.split('|');
  if (i > 0 && lineParts.length > 3) {
    return {
      id: lineParts[0].trim(),
      artist: lineParts[1].trim(),
      title: lineParts[2].trim()
    };
  }
  return null;
};

const parseService = async ({ serviceName, outputPath, downloadFile }) => {
  const { logger } = utils;
  logger.info(`Loading ${outputPath}`);
  const data = (await loadFile(outputPath)).toString();

  const outputDirectory = `${config.downloader.outputPath}/${serviceName}`;
  logger.info(`Making directory ${outputDirectory}`);
  // await makeDirectory(outputDirectory);

  const parsedData = data
    .split('\n')
    .map(parseData)
    .filter(Boolean)
    .map(song => ({ ...song, serviceName, path: `${song.artist} - ${song.title}.mp3` }));

  logger.info(`Parsed ${parsedData.length} songs from ${outputPath.replace(config.appPath, '')}`);

  return { songs: parsedData, serviceName };
};

const parseServices = async serviceName =>
  parseService({
    serviceName,
    outputPath: config.data[serviceName].outputPath
  });

module.exports = { parseServices };
