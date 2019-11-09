const _ = require('lodash');
const config = require('../config');
const { writeFile, logger } = require('./utils');
const { loadPlugDj, loadDubtrackFm /* , loadYoutube  */ } = require('./scraper/loaders');

const run = async () => {
  const app = { config, stats: {} };
  const data = await Promise.all([loadPlugDj(app), loadDubtrackFm(app)]);
  // const dubtrackFmData = await loadDubtrackFm(app);
  const songs = _.sortBy(_.uniqBy(_.flatten(data), 'id'), 'author');
  const dupes = _.without(_.flatten(data), ...songs);
  dupes.forEach(dupe => logger.warn(`Duplicate removed: (${dupe.service}) ${dupe.id} ${dupe.name}`));

  await writeFile({ filePath: config.data.outputPath, data: songs });

  _.each(_.keys(app.stats), service => {
    const stat = app.stats[service];
    logger.info(`${service} parsed with ${stat.ignored.length} ignored, ${stat.sorted.length} identified songs`);
  });
  logger.info(`${songs.length} total entries, ${dupes.length} duplicates removed.`);
};

run();
