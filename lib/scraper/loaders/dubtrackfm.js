const _ = require('lodash');
const columnify = require('columnify');

module.exports = ({ config, utils }, done) => {
  const { logger, loadFile } = utils;
  const { filePath, ignored } = config.data.dubtrackFm;

  const songs = [];

  const sets = loadFile({ filePath });
  if (!sets || sets.length === 0) {
    return done(null);
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

  const sorted = _.sortBy(songs, 'name');
  logger.info(`Loaded ${sorted.length} songs from ${filePath}`);
  logger.debug(columnify(sorted, { columns: ['id', 'author', 'title', 'type'] }));
  return done(null, sorted);
};
