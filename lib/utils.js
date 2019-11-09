const _ = require('lodash');
const columnify = require('columnify');
const fs = require('fs');
const { promisify } = require('util');

const logger = require('./utils/logger');

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

const writeFile = async ({ filePath, data }) => {
  const outputData = columnify(data, { columns: ['id', 'author', 'title', 'name'], columnSplitter: '|' });
  logger.info(`Writing ${data.length} songs to: ${filePath}`);
  return promisify(fs.writeFile)(filePath, outputData);
};

const makeDirectory = async directory => promisify(fs.mkdir)(directory);

const parallel = (tasks, fn) => Promise.all(tasks.map(task => fn(task)));

const serial = (tasks, fn) => tasks.reduce((promise, task) => promise.then(prev => fn(task, prev)), Promise.resolve());

module.exports = {
  makeDirectory,
  serial,
  parallel,
  logger,
  loadFile,
  writeFile
};
