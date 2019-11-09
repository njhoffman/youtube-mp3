const _ = require('lodash');
const columnify = require('columnify');
const fs = require('fs');
const { promisify } = require('util');

const logger = require('./utils/logger');

// TODO: use async versions of fs instead of promisify wrapper

const parseJson = str => {
  let result;
  try {
    result = JSON.parse(str.toString());
  } catch (e) {
    return e;
  }
  return result;
};

const loadFile = async ({ filePath }) => {
  logger.info(`Loading file: ${filePath}`);

  const fileExists = fs.existsSync(filePath);
  if (!fileExists) {
    logger.error(`File does not exists: ${filePath}`);
    return false;
  }

  const contents = await promisify(fs.readFile)(filePath);
  const json = parseJson(contents);

  if (_.isError(json)) {
    logger.error(`File is not valid JSON: ${filePath}`);
    logger.error(` --${json}`);
    return false;
  }
  logger.trace(json);
  return json;
};

// TODO: make append flag and columns argument parameters
const writeFile = async ({ filePath, data }) => {
  const outputData = columnify(data, {
    columns: ['id', 'author', 'title', 'name', 'service', 'reason'],
    columnSplitter: '|'
  });
  logger.info(`Writing ${data.length} songs to: ${filePath}`);
  return promisify(fs.writeFile)(filePath, outputData);
};

const appendFile = async ({ filePath, data }) => {
  const outputData = columnify(data, {
    columns: ['id', 'author', 'title', 'name', 'service', 'reason'],
    columnSplitter: '|'
  });
  logger.info(`Writing ${data.length} songs to: ${filePath}`);
  return promisify(fs.appendFile)(filePath, outputData);
};

const makeDirectory = async directory => promisify(fs.mkdir)(directory);

module.exports = {
  makeDirectory,
  logger,
  loadFile,
  appendFile,
  writeFile
};
