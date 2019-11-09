const _ = require('lodash');
const { logger, loadFile } = require('../../utils');

module.exports = async ({ config, stats }) => {
  const { filePath } = config.data.plugDj;
  const songs = [];

  const sets = await loadFile({ filePath });
  if (!sets || sets.length === 0) {
    return null;
  }

  sets.forEach(set => {
    // title, author, cid, duration, format, image
    set.data.forEach(song => {
      songs.push({
        name: `${song.author} - ${song.title}`,
        author: song.author,
        title: song.title,
        duration: song.duration,
        id: song.cid,
        type: /^\d{9}$/.test(song.cid) ? 'soundcloud' : 'youtube',
        service: 'plugDj'
      });
    });
  });

  const skipped = _.filter(songs, song => song.type !== 'youtube');
  const sorted = _.sortBy(songs, 'name');

  const loadStats = { data: sorted, skipped };
  loadStats.skipped = skipped.map(song => {
    logger.warn(`Skipped (${song.service}) - ${song.type} id: ${song.id} ${song.name}`);
    return { ...song, reason: song.type };
  });
  _.merge(stats, { dubtrackFm: loadStats });

  logger.info(`Loaded ${sorted.length} songs from ${filePath}`);

  return loadStats;
};
