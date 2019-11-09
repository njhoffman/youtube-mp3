const { promisify } = require('util');
const fs = require('fs');

const config = require('../../config');
const { logger } = require('../utils');

const loadFile = async outputPath => promisify(fs.readFile)(outputPath);

const parseData = (line, i) => {
  const { genre, album } = config.output;
  // skip header line
  const lineParts = line.split('|');
  if (i > 0 && lineParts.length > 3) {
    return {
      id: lineParts[0].trim(),
      artist: lineParts[1].trim(),
      title: lineParts[2].trim(),
      name: lineParts[3].trim(),
      genre,
      album
    };
  }
  return null;
};

const loadSongList = async listPath => {
  logger.info(`Loading list from ${listPath}`);
  const data = (await loadFile(listPath)).toString();

  const parsedData = data
    .split('\n')
    .map(parseData)
    .filter(Boolean)
    .map(song => ({ ...song, path: `${song.artist} - ${song.title}.mp3` }));

  logger.info(`Parsed ${parsedData.length} songs from ${listPath.replace(config.appPath, '')}`);
  return parsedData;
};

module.exports = loadSongList;
