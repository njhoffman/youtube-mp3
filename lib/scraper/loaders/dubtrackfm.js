const _ = require('lodash');
const columnify = require('columnify');
const { logger, loadFile } = require('../../utils');

module.exports = ({ config, stats }) => async () => {
  const { filePath } = config.data.dubtrackFm;

  const songs = [];

  const sets = loadFile({ filePath });
  if (!sets || sets.length === 0) {
    return null;
    // return done(null);
  }

  sets.forEach(set => {
    // _id, name, images, type, fkid, streamUrl, songLength
    set.data.forEach(({ _song }) => {
      const nameParts = _song.name.split('-');
      songs.push({
        name: _song.name,
        author: nameParts.length > 0 ? nameParts[0] : '',
        title: nameParts.length > 0 ? nameParts.splice(1).join('-') : nameParts[0],
        type: _song.type,
        id: _song.fkid,
        duration: _song.songLength
      });
    });
  });

  const ignored = _.filter(songs, song => song.type !== 'youtube');
  const sorted = _.sortBy(_.filter(songs, { type: 'youtube' }), 'author');
  logger.info(`Loaded ${sorted.length} songs from ${filePath}`);

  const loadStats = { ignored, sorted };
  loadStats.ignored.forEach(song => logger.warn(`Ignored (${song.type}): ${song.id} ${song.name}`));
  _.merge(stats, { plugDj: loadStats });

  logger.trace(columnify(sorted, { columns: ['id', 'author', 'title', 'type'] }));
  return sorted;
};
