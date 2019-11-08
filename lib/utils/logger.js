const _ = require('lodash');
const { inspect } = require('util');
const chalk = require('chalk');

const config = require('../../config');

const padRight = (str, len) => (len > str.length ? str + new Array(len - str.length + 1).join(' ') : str);

/* eslint-disable no-console */
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

const logger = _.mapValues(levelMap, level => msg => log(level, msg));
/* eslint-enable no-console */

module.exports = logger;
