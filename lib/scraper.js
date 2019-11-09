const _ = require('lodash');
const config = require('../config');
const { writeFile, logger } = require('./utils');
const { loadPlugDj, loadDubtrackFm /* , loadYoutube  */ } = require('./scraper/loaders');

const run = async () => {
  const app = { config, stats: {} };
  const { listPath, skippedPath } = config.output;

  const [plugDj, dubtrackFm] = await Promise.all([loadPlugDj(app), loadDubtrackFm(app)]);

  const skipped = _.flatten([plugDj.skipped, dubtrackFm.skipped]);
  const data = _.flatten([plugDj.data, dubtrackFm.data]);
  const songs = _.sortBy(_.uniqBy(data, 'id'), 'author');
  const dupes = _.without(data, ...songs).map(dupe => {
    logger.warn(`Duplicate removed: (${dupe.service}) ${dupe.id} ${dupe.name}`);
    return { ...dupe, reason: 'duplicate' };
  });

  await writeFile({ filePath: listPath, data: songs });

  await writeFile({ filePath: skippedPath, data: _.flatten([dupes, skipped]) });

  _.each(_.keys(app.stats), service => {
    const { data: serviceData, skipped: serviceSkipped } = app.stats[service];
    logger.info(`${service} parsed with ${serviceSkipped.length} skipped, ${serviceData.length} identified songs`);
  });

  logger.info(`${songs.length} total entries, ${dupes.length} duplicates removed.`);
};

run();
