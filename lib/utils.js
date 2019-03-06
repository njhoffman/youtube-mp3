const _ = require('lodash');
const chalk = require('chalk');

const padLeft = (str, len) => (
  len > str.length
    ? (new Array(len - str.length + 1)).join(' ') + str
    : str
);

const padRight = (str, len) => (
  len > str.length
    ? str + (new Array(len - str.length + 1)).join(' ')
    : str
);

const levelMap = {
  trace: 6,
  debug: 5,
  info: 4,
  warn: 3,
  error: 2,
  fatal: 1
};

const logger = (config) => {
  const log = (level, msg) => {
    let label = _.findKey(levelMap, lmap => (lmap === level));
    const color = config.logger.colors[label];
    label = chalk.bold(` ${padRight(label.toUpperCase(), 6)}`);
    label = color.fg ? chalk.rgb(color.fg)(label) : label;
    label = color.bg ? chalk.bgRgb(...color.bg)(label) : label;
    console.log([
      label,
      msg
    ].join('  '));
  };

  return _.mapValues(levelMap, level => (msg) => log(level, msg));
};

module.exports = (config) => ({
  logger: logger(config),
  padRight,
  padLeft
});
