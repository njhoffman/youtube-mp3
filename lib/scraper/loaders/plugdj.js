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
        service: 'plugDj'
      });
    });
  });

  const sorted = _.sortBy(songs, 'name');
  const skipped = [];

  const loadStats = { data: sorted, skipped };
  _.merge(stats, { dubtrackFm: loadStats });

  logger.info(`Loaded ${sorted.length} songs from ${filePath}`);

  return loadStats;
};
