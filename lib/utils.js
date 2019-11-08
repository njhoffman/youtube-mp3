const _ = require('lodash');
const columnify = require('columnify');
const { inspect } = require('util');
const chalk = require('chalk');
const fs = require('fs');

const padLeft = (str, len) => (len > str.length ? new Array(len - str.length + 1).join(' ') + str : str);

const padRight = (str, len) => (len > str.length ? str + new Array(len - str.length + 1).join(' ') : str);

const parseJson = str => {
  let result;
  try {
    result = JSON.parse(str.toString());
  } catch (e) {
    return e;
  }
  return result;
};

/* eslint-disable no-console */
const logger = config => {
  const levelMap = {
    trace: 6,
    debug: 5,
    info: 4,
    warn: 3,
    error: 2,
    fatal: 1
  };

  const log = (level, msg) => {
    let label = _.findKey(levelMap, lmap => lmap === level);
    const color = config.logger.colors[label];
    label = chalk.bold(` ${padRight(label.toUpperCase(), 6)}`);
    label = color.fg ? chalk.rgb(...color.fg)(label) : label;
    label = color.bg ? chalk.bgRgb(...color.bg)(label) : label;

    if (config.logger.stdout.level >= level) {
      if (_.isObject(msg)) {
        console.log([label, inspect(msg, { colors: true })].join('\n'));
      } else if (msg.indexOf('\n') !== -1) {
        console.log([label, msg].join('\n\n'));
      } else {
        console.log([label, msg].join('  '));
      }
    }
  };

  return _.mapValues(levelMap, level => msg => log(level, msg));
};
/* eslint-enable no-console */

const loadFile = config => ({ filePath }) => {
  const { trace, info, error } = logger(config);

  info(`Loading file: ${filePath}`);

  const fileExists = fs.existsSync(filePath);
  if (!fileExists) {
    error(`File does not exists: ${filePath}`);
    return false;
  }

  const contents = fs.readFileSync(filePath);
  const json = parseJson(contents);

  if (_.isError(json)) {
    error(`File is not valid JSON: ${filePath}`);
    error(` --${json}`);
    return false;
  }
  trace(json);
  return json;
};

const writeFile = config => ({ serviceName, data }) => {
  const { info } = logger(config);
  const { outputPath } = config.data[serviceName];
  const outputData = columnify(data, { columns: ['id', 'author', 'title', 'name'], columnSplitter: '|' });
  info(`Writing ${outputData.length} bytes to: ${outputPath}`);
  fs.writeFileSync(outputPath, outputData);
};

module.exports = config => ({
  logger: logger(config),
  loadFile: loadFile(config),
  writeFile: writeFile(config),
  padRight,
  padLeft
});
