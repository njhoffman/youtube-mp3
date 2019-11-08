const _ = require('lodash');
const columnify = require('columnify');
const { logger, loadFile } = require('../../utils');

module.exports = ({ config, stats }) => async () => {
  const { filePath } = config.data.plugDj;
  const songs = [];

  const sets = loadFile({ filePath });
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
        id: song.cid
      });
    });
  });

  const sorted = _.sortBy(songs, 'name');
  const ignored = [];

  const loadStats = { ignored, sorted };
  _.merge(stats, { dubtrackFm: loadStats });

  logger.info(`Loaded ${sorted.length} songs from ${filePath}`);
  logger.trace(columnify(sorted, { columns: ['id', 'author', 'title'] }));

  return sorted;
};
