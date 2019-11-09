const _ = require('lodash');
const { logger, loadFile } = require('../../utils');

module.exports = async ({ config, stats }) => {
  const { filePath } = config.data.dubtrackFm;

  const songs = [];

  const sets = await loadFile({ filePath });
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
        duration: _song.songLength,
        service: 'dubtrackFm'
      });
    });
  });

  const skipped = _.filter(songs, song => song.type !== 'youtube');
  const sorted = _.sortBy(_.filter(songs, { type: 'youtube' }), 'author');
  logger.info(`Loaded ${sorted.length} songs from ${filePath}`);

  const loadStats = { data: sorted };
  loadStats.skipped = skipped.map(song => {
    logger.warn(`Skipped (${song.service}) - ${song.type} id: ${song.id} ${song.name}`);
    return { ...song, reason: song.type };
  });

  _.merge(stats, { plugDj: loadStats });

  return loadStats;
};
