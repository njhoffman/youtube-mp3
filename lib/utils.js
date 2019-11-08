const _ = require('lodash');
const columnify = require('columnify');
const fs = require('fs');

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

const loadFile = ({ filePath }) => {
  logger.info(`Loading file: ${filePath}`);

  const fileExists = fs.existsSync(filePath);
  if (!fileExists) {
    logger.error(`File does not exists: ${filePath}`);
    return false;
  }

  const contents = fs.readFileSync(filePath);
  const json = parseJson(contents);

  if (_.isError(json)) {
    logger.error(`File is not valid JSON: ${filePath}`);
    logger.error(` --${json}`);
    return false;
  }
  logger.trace(json);
  return json;
};

const writeFile = ({ filePath, data }) => {
  const outputData = columnify(data, { columns: ['id', 'author', 'title', 'name'], columnSplitter: '|' });
  logger.info(`Writing ${filePath.length} bytes to: ${filePath}`);
  fs.writeFileSync(filePath, outputData);
};

module.exports = {
  logger,
  loadFile,
  writeFile
};
